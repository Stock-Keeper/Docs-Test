// =================================================================
// Stock-Keeper UI Prototype V3 - Main App
// Modular structure with dynamic screen loading
// =================================================================

// =============================================
// APP STATE
// =============================================
let isFirstVisit = true; // Simulated first-visit flag

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllScreens();
    await loadModals();
    initTheme();
    initNavigation();

    // Start with "off" screen (powered off state)
    showOffScreen();

    console.log('✅ Stock-Keeper V3 initialized (powered off)');
});

// =============================================
// APP FLOW CONTROL
// =============================================

/**
 * Show powered-off screen
 */
function showOffScreen() {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show off screen if exists, otherwise create a black screen effect
    const offScreen = document.getElementById('screen-off');
    if (offScreen) {
        offScreen.classList.add('active');
    } else {
        // Fallback: just hide everything
        const container = document.getElementById('screen-container');
        if (container) {
            container.style.background = '#000';
        }
    }

    // Enable start button
    const startBtn = document.getElementById('app-start-btn');
    if (startBtn) startBtn.disabled = false;

    // Update nav buttons
    document.querySelectorAll('.nav-btn-vertical').forEach(btn => btn.classList.remove('active'));
}

/**
 * Start the app - Splash → Onboarding (if first visit) → Login
 */
function startApp() {
    const startBtn = document.getElementById('app-start-btn');
    if (startBtn) startBtn.disabled = true;

    // Navigate to splash screen
    navigateTo('screen-splash');

    // After splash animation (2 seconds), navigate to next screen
    setTimeout(() => {
        if (isFirstVisit) {
            // First visit: go to onboarding
            const onboarding = document.getElementById('screen-onboarding');
            if (onboarding) {
                navigateTo('screen-onboarding');
            } else {
                // Onboarding not implemented yet, go to login
                navigateTo('screen-login');
            }
        } else {
            // Returning user: go directly to login
            navigateTo('screen-login');
        }
    }, 2000);
}

/**
 * Reset app to initial state (first-visit mode)
 */
function resetApp() {
    isFirstVisit = true;
    showOffScreen();
    showToast('앱이 초기화되었습니다. (첫 방문 상태)');
}

/**
 * Mark onboarding as complete (called when user finishes onboarding)
 */
function completeOnboarding() {
    isFirstVisit = false;
    navigateTo('screen-login');
}
