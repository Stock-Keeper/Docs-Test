// =================================================================
// Stock-Keeper UI Prototype V4 - Navigation
// Screen loading and navigation with config-based routing
// =================================================================

let config = null;
let currentScreen = null;
const loadedControllers = new Map();

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
}

/**
 * Load all screen HTML files based on config
 * @param {Object} screenConfig - screens.json configuration
 */
export async function loadAllScreens(screenConfig) {
    const container = document.getElementById('screen-container');

    // Load off screen first
    container.innerHTML = '<div id="screen-off" class="screen active"></div>';

    for (const screen of screenConfig.screens) {
        try {
            // 1. Load HTML
            const response = await fetch(screen.path);
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);
                
                // 2. Load Controller (if exists)
                if (screen.controller) {
                    try {
                        // Dynamic import
                        const module = await import('../' + screen.controller);
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
 */
export function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Find and show target screen
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        updateNavButtons();
        updateStateButtons();
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

// Make updateScreenState global for control-panel.js to use if needed
window.updateScreenState = updateScreenState;
