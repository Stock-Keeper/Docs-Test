// =================================================================
// Stock-Keeper UI Prototype V3 - Theme Management
// Dark/Light mode switching
// =================================================================

let currentMode = localStorage.getItem('sk-mode') || 'dark';

/**
 * Initialize theme from localStorage or default
 */
function initTheme() {
    const toggle = document.getElementById('mode-toggle-input');

    // Set initial state (checked = dark mode)
    if (toggle) {
        toggle.checked = currentMode === 'dark';
        toggle.addEventListener('change', () => {
            setMode(toggle.checked ? 'dark' : 'light');
        });
    }

    setMode(currentMode);
}

/**
 * Set the current theme mode
 * @param {string} modeName - 'dark' or 'light'
 */
function setMode(modeName) {
    if (!['dark', 'light'].includes(modeName)) return;

    document.documentElement.setAttribute('data-mode', modeName);
    currentMode = modeName;
    localStorage.setItem('sk-mode', modeName);

    // Sync toggle state
    const toggle = document.getElementById('mode-toggle-input');
    if (toggle) {
        toggle.checked = modeName === 'dark';
    }
}
