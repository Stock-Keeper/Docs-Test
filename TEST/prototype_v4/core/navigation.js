// =================================================================
// Stock-Keeper UI Prototype V4 - Navigation
// Screen loading and navigation with config-based routing
// =================================================================

import { initTabBar, updateTabBarState, updateTabBarForScreen } from './tab-bar.js';

let config = null;
let currentScreen = null;
const loadedControllers = new Map();
const historyStack = []; // 네비게이션 히스토리 스택

/**
 * Initialize navigation with config
 * @param {Object} screenConfig - screens.json configuration
 */
export function initNavigation(screenConfig) {
    config = screenConfig;

    // Add click listeners to nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.screen);
        });
    });

    // Initialize tab bar
    initTabBar(navigateTo);
}

/**
 * Go back to previous screen
 */
export function goBack(options = {}) {
    const normalized = typeof options === 'string'
        ? { fallbackScreenId: options }
        : (options || {});

    const fallbackScreenId = resolveFallbackScreen(normalized.fallbackScreenId || 'portfolio-list');
    const requirePrefix = normalized.requirePrefix;

    if (historyStack.length > 1) {
        // 현재 화면 제거
        historyStack.pop();

        // 연속 중복 히스토리 제거
        while (historyStack.length > 1 && historyStack[historyStack.length - 1] === currentScreen) {
            historyStack.pop();
        }

        let prevScreen = historyStack[historyStack.length - 1];

        if (requirePrefix && (!prevScreen || !prevScreen.startsWith(requirePrefix))) {
            prevScreen = fallbackScreenId;
        }

        if (!isScreenRegistered(prevScreen)) {
            prevScreen = fallbackScreenId;
        }

        navigateTo(prevScreen, false); // 히스토리에 추가하지 않음
        return;
    }

    // 히스토리가 없으면 fallback 화면으로
    navigateTo(fallbackScreenId, false);
}

/**
 * Load all screen HTML files based on config
 * @param {Object} screenConfig - screens.json configuration
 */
export async function loadAllScreens(screenConfig) {
    const container = document.getElementById('screen-container');
    const cacheBust = Date.now();

    // Load off screen first
    container.innerHTML = '<div id="screen-off" class="screen active"></div>';

    for (const screen of screenConfig.screens) {
        try {
            // 1. Load HTML
            const response = await fetch(`${screen.path}?v=${cacheBust}`, {
                cache: 'no-store'
            });
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);

                // 2. Load Controller (if exists)
                if (screen.controller) {
                    try {
                        // Dynamic import
                        const module = await import(`../${screen.controller}?v=${cacheBust}`);
                        loadedControllers.set(screen.id, module);

                        // Initialize if init() exists
                        if (module.init) {
                            module.init();
                        } else {
                            // Fallback for named init (e.g., initLoginScreen)
                            // Try to find a function starting with 'init'
                            const initFn = Object.values(module).find(v => typeof v === 'function' && v.name.startsWith('init'));
                            if (initFn) initFn();
                        }
                    } catch (err) {
                        console.warn(`Failed to load controller for ${screen.id}:`, err);
                    }
                }
            }
        } catch (error) {
            console.warn(`Screen not found: ${screen.path}`);
        }
    }
}

/**
 * Navigate to a screen by ID
 * @param {string} screenId - Screen ID from config
 * @param {boolean} addToHistory - 히스토리에 추가할지 (기본: true)
 */
export function navigateTo(screenId, addToHistory = true) {
    // 1. Call cleanup on current screen controller if it exists
    if (currentScreen) {
        const currentController = loadedControllers.get(currentScreen);
        if (currentController && typeof currentController.cleanup === 'function') {
            currentController.cleanup();
        }
        // Also reset its state to default
        updateScreenState(currentScreen, 'default');
    }

    // 2. Clear all active state buttons in Control Panel
    // This ensures that when we return or switch, no state buttons are left visually active
    document.querySelectorAll('.state-btn').forEach(btn => btn.classList.remove('active'));

    // 3. Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // 4. Find and show target screen
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;

        // 히스토리 스택에 추가
        if (addToHistory) {
            historyStack.push(screenId);
        }

        updateNavButtons();
        updateStateButtons();

        // 탭바 상태 업데이트
        updateTabBarState(screenId);

        // 화면 설정에 따른 탭바 표시/숨김 처리
        const screenConfig = config?.screens?.find(s => s.id === screenId);
        const currentPhase = document.body.getAttribute('data-current-phase') || 'P1';
        updateTabBarForScreen(screenConfig, currentPhase);

        // 5. Call controller lifecycle methods
        const controller = loadedControllers.get(screenId);
        if (controller) {
            // Reset first (clear state)
            if (typeof controller.reset === 'function') {
                controller.reset();
            }
            // Then start (initialize screen)
            if (typeof controller.start === 'function') {
                controller.start();
            }
        }
    }
}

/**
 * Update screen state (called from control panel)
 * @param {string} screenId 
 * @param {string} stateId 
 */
export function updateScreenState(screenId, stateId) {
    const controller = loadedControllers.get(screenId);
    if (!controller) return;

    // Try standard setState or legacy set{ScreenName}State
    if (controller.setState) {
        controller.setState(stateId);
    } else {
        // Fallback: find setXState function
        const setFn = Object.values(controller).find(v => typeof v === 'function' && v.name.startsWith('set') && v.name.endsWith('State'));
        if (setFn) setFn(stateId);
    }
}

/**
 * Update nav button active states
 */
function updateNavButtons() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === currentScreen);
    });
}

/**
 * Update state button visibility based on current screen
 */
function updateStateButtons() {
    document.querySelectorAll('.state-btn').forEach(btn => {
        const forScreens = (btn.dataset.forScreens || '').split(' ');
        const isVisible = forScreens.includes(currentScreen);
        btn.classList.toggle('visible', isVisible);
    });
}

/**
 * Get current screen ID
 */
export function getCurrentScreen() {
    return currentScreen;
}

function isScreenRegistered(screenId) {
    return !!config?.screens?.some(screen => screen.id === screenId);
}

function resolveFallbackScreen(preferredFallbackId) {
    if (isScreenRegistered(preferredFallbackId)) return preferredFallbackId;
    if (isScreenRegistered('portfolio-list')) return 'portfolio-list';
    return config?.screens?.[0]?.id || preferredFallbackId;
}

// Make updateScreenState global for control-panel.js to use if needed
window.updateScreenState = updateScreenState;
