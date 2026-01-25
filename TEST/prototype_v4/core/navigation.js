// =================================================================
// Stock-Keeper UI Prototype V4 - Navigation
// Screen loading and navigation with config-based routing
// =================================================================

let config = null;
let currentScreen = null;

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
            const response = await fetch(screen.path);
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);
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
