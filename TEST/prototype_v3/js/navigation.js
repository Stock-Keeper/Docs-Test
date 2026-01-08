// =================================================================
// Stock-Keeper UI Prototype V3 - Navigation
// Screen loading and navigation
// =================================================================

const SCREENS = [
    'login', 'profile', 'home', 'detail', 'search', 'rebalance', 'settings'
];

let currentScreen = 'screen-login';

/**
 * Load all screen HTML files dynamically
 */
async function loadAllScreens() {
    const container = document.getElementById('screen-container');

    for (const screen of SCREENS) {
        try {
            const response = await fetch(`screens/${screen}.html`);
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);
            }
        } catch (error) {
            console.error(`Failed to load screen: ${screen}`, error);
        }
    }
}

/**
 * Load modal components
 */
async function loadModals() {
    const container = document.getElementById('modal-container');

    try {
        const response = await fetch('components/modals.html');
        if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Failed to load modals', error);
    }
}

/**
 * Navigate to a specific screen
 * @param {string} screenId - ID of the screen to navigate to
 */
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        updateNavButtons();
        updateStateButtons();
    }
}

/**
 * Initialize navigation event listeners
 */
function initNavigation() {
    document.querySelectorAll('.nav-btn-vertical').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.screen);
        });
    });

    // Initialize state buttons visibility for initial screen
    updateStateButtons();
}

/**
 * Update active state of navigation buttons
 */
function updateNavButtons() {
    document.querySelectorAll('.nav-btn-vertical').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === currentScreen);
    });
}

/**
 * Update visibility of state toggle buttons based on current screen
 */
function updateStateButtons() {
    document.querySelectorAll('.state-btn').forEach(btn => {
        const forScreens = btn.dataset.forScreens || '';
        const screens = forScreens.split(' ').map(s => s.trim()).filter(Boolean);
        const isVisible = screens.includes(currentScreen);
        btn.classList.toggle('visible', isVisible);
    });
}

// =============================================
// MODAL MANAGEMENT
// =============================================

/**
 * Show a modal by ID
 * @param {string} modalId - ID of the modal to show
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Hide a modal by ID
 * @param {string} modalId - ID of the modal to hide
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}
