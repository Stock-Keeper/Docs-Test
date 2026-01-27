// =================================================================
// Stock-Keeper UI Prototype V4 - Control Panel
// Dynamic control panel generation from screens.json
// =================================================================

let config = null;
let currentPhase = 'P1';

/**
 * Initialize control panel from config
 * @param {Object} screenConfig - screens.json configuration
 */
export async function initControlPanel(screenConfig) {
    config = screenConfig;
    const panel = document.getElementById('control-panel');
    if (!panel) return;

    panel.innerHTML = `
        <!-- App Control -->
        <div class="control-app-row">
            <button class="app-start-btn" id="app-start-btn" onclick="startApp()" data-title="앱 시작">🚀</button>
            <button class="app-reset-btn" onclick="resetApp()" data-title="초기화">🔄</button>
        </div>
        
        <!-- Phase Toggle -->
        <div class="control-phase-row">
            ${config.phases.map(p => `
                <button class="phase-btn ${p === currentPhase ? 'active' : ''}" 
                        data-phase="${p}" 
                        onclick="setPhase('${p}')">${p}</button>
            `).join('')}
        </div>
        
        <!-- Theme Toggle -->
        <div class="control-theme-row">
            <label class="mode-toggle">
                <input type="checkbox" id="mode-toggle-input" checked>
                <span class="mode-toggle-slider"></span>
            </label>
        </div>
        
        <div class="control-columns">
            <!-- Navigation Column -->
            <div class="nav-column" id="nav-column"></div>
            
            <!-- State Buttons Column -->
            <div class="state-column" id="state-column"></div>
        </div>
    `;

    renderNavButtons();
    renderStateButtons();
}

/**
 * Render navigation buttons based on current phase
 */
function renderNavButtons() {
    const navColumn = document.getElementById('nav-column');
    if (!navColumn) return;

    const visibleScreens = config.screens
        .filter(s => config.phases.indexOf(s.phase) <= config.phases.indexOf(currentPhase))
        .sort((a, b) => a.navButton.order - b.navButton.order);

    navColumn.innerHTML = visibleScreens.map(screen => `
        <button class="nav-btn" 
                data-screen="${screen.id}" 
                data-title="${screen.name}">${screen.navButton.icon}</button>
    `).join('');
}

/**
 * Render state buttons for all screens
 */
function renderStateButtons() {
    const stateColumn = document.getElementById('state-column');
    if (!stateColumn) return;

    const allStateButtons = [];

    config.screens.forEach(screen => {
        screen.stateButtons?.forEach(btn => {
            allStateButtons.push(`
                <button class="state-btn" 
                        data-for-screens="${screen.id}"
                        data-state="${btn.id}"
                        data-title="${btn.title}"
                        onclick="toggleState('${screen.id}', '${btn.id}', this)">${btn.icon}</button>
            `);
        });
    });

    stateColumn.innerHTML = allStateButtons.join('');
}

/**
 * Set current phase filter
 * @param {string} phase - Phase to set (P1, P2, P3)
 */
window.setPhase = function (phase) {
    currentPhase = phase;

    // Update phase button states
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.phase === phase);
    });

    // Re-render nav buttons
    renderNavButtons();

    // Re-init navigation listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            import('./navigation.js').then(nav => nav.navigateTo(btn.dataset.screen));
        });
    });
};

/**
 * Toggle state for a screen
 */
window.toggleState = function (screenId, stateId, btnElement) {
    // 1. Toggle Active State
    const wasActive = btnElement.classList.contains('active');

    // De-activate all buttons for this screen first (Mutually Exclusive)
    const siblings = document.querySelectorAll(`.state-btn[data-for-screens="${screenId}"]`);
    siblings.forEach(btn => btn.classList.remove('active'));

    // Activate clicked button if it wasn't already active
    if (!wasActive) {
        btnElement.classList.add('active');
    }

    const newState = !wasActive ? stateId : 'default';

    // 2. Dispatch Event for Controllers
    console.log(`[ControlPanel] State Changed: ${screenId} -> ${newState}`);
    const event = new CustomEvent('app-state-change', {
        detail: {
            screenId: screenId,
            state: newState
        }
    });
    window.dispatchEvent(event);
};

export { currentPhase };
