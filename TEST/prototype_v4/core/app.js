// =================================================================
// Stock-Keeper UI Prototype V4 - Main App
// ES6 Module Entry Point
// =================================================================

import { initNavigation, navigateTo, loadAllScreens } from './navigation.js';
import { initControlPanel } from './control-panel.js';
import { initTheme } from './theme.js';
import { showToast } from './utils.js';

// App State
let isFirstVisit = true;

// =================================================================
// INITIALIZATION
// =================================================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Load screens configuration
        const config = await fetch('config/screens.json').then(r => r.json());
        
        // 2. Initialize control panel (dynamic from config)
        await initControlPanel(config);
        
        // 3. Load all screen HTML files
        await loadAllScreens(config);
        
        // 4. Initialize navigation
        initNavigation(config);
        
        // 5. Initialize theme
        initTheme();
        
        // 6. Show off screen (powered off state)
        showOffScreen();
        
        console.log('✅ Stock-Keeper V4 initialized');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
    }
});

// =================================================================
// APP FLOW CONTROL
// =================================================================

function showOffScreen() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const container = document.getElementById('screen-container');
    if (container) container.style.background = '#000';
    
    const startBtn = document.getElementById('app-start-btn');
    if (startBtn) startBtn.disabled = false;
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
}

window.startApp = function() {
    const startBtn = document.getElementById('app-start-btn');
    if (startBtn) startBtn.disabled = true;
    
    navigateTo('splash');
    
    setTimeout(() => {
        if (isFirstVisit) {
            navigateTo('login');
        } else {
            navigateTo('login');
        }
    }, 2000);
};

window.resetApp = function() {
    isFirstVisit = true;
    showOffScreen();
    showToast('앱이 초기화되었습니다.');
};

// Export for global access
export { showOffScreen };
