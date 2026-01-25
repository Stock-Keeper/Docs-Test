// =================================================================
// Stock-Keeper UI Prototype V4 - Theme Manager
// =================================================================

let isDarkMode = true;

/**
 * Initialize theme system
 */
export function initTheme() {
    const toggle = document.getElementById('mode-toggle-input');
    if (toggle) {
        toggle.checked = isDarkMode;
        toggle.addEventListener('change', () => toggleTheme());
    }
    applyTheme();
}

/**
 * Toggle between dark and light mode
 */
export function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
}

/**
 * Apply current theme
 */
function applyTheme() {
    document.documentElement.setAttribute('data-mode', isDarkMode ? 'dark' : 'light');
}

export { isDarkMode };
