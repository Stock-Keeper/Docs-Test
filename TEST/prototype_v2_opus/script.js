// =================================================================
// Stock-Keeper UI Prototype V2 Opus - Script
// Based on prototype_v1 with multi-theme support
// =================================================================

// =============================================
// THEME & MODE MANAGEMENT
// =============================================
const themes = ['sage']; // Forest theme only
const modes = ['dark', 'light'];
let currentTheme = 'sage'; // Fixed to sage
let currentMode = localStorage.getItem('sk-mode') || 'dark';

function setTheme(themeName) {
    if (!themes.includes(themeName)) return;

    currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('sk-theme', themeName);

    // Update active state on buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.dataset.theme === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setMode(modeName) {
    if (!modes.includes(modeName)) return;

    currentMode = modeName;
    document.documentElement.setAttribute('data-mode', modeName);
    localStorage.setItem('sk-mode', modeName);

    // Update active state on buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.dataset.mode === modeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize theme and mode on load
document.addEventListener('DOMContentLoaded', () => {
    setTheme(currentTheme);
    setMode(currentMode);

    // Add click handlers to theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });

    // Add click handlers to mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setMode(btn.dataset.mode);
        });
    });

    console.log('UI Prototype V2 Opus loaded');
    console.log('Available themes:', themes.join(', '));
    console.log('Available modes:', modes.join(', '));
    console.log('Available screens: login, profile, home, detail, search, rebalance, settings');
});

// =============================================
// SCREEN NAVIGATION
// =============================================
function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        // Scroll to top of screen
        targetScreen.scrollTop = 0;
    }

    // Hide any open modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// =============================================
// MODAL CONTROL
// =============================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// =============================================
// INTERACTIVE ELEMENTS
// =============================================

// Chip Selection
document.querySelectorAll('.chip-group .chip').forEach(chip => {
    chip.addEventListener('click', () => {
        chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Color Picker Selection
document.querySelectorAll('.color-picker .color-option').forEach(color => {
    color.addEventListener('click', () => {
        color.parentElement.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
        color.classList.add('selected');
    });
});

// Radio Option Selection
document.querySelectorAll('.radio-option').forEach(option => {
    option.addEventListener('click', () => {
        option.parentElement.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        option.querySelector('input[type="radio"]').checked = true;
    });
});

// Number Input Controls
document.querySelectorAll('.number-input').forEach(container => {
    const input = container.querySelector('input[type="number"]');
    const minusBtn = container.querySelector('.num-btn:first-child');
    const plusBtn = container.querySelector('.num-btn:last-child');

    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value) || 0;
            if (currentValue > 0) {
                input.value = currentValue - 1;
                updateEstimatedAmount(input);
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value) || 0;
            input.value = currentValue + 1;
            updateEstimatedAmount(input);
        });
    }
});

// Update estimated amount when quantity changes
function updateEstimatedAmount(input) {
    const container = input.closest('.modal-body');
    if (container) {
        const quantity = parseInt(input.value) || 0;
        const price = 186500; // 예시 가격
        const estimated = container.querySelector('.estimated');
        if (estimated) {
            estimated.textContent = `예상 금액: ₩${(quantity * price).toLocaleString()}`;
        }
    }
}

// Range Slider Value Display
document.querySelectorAll('.ratio-slider').forEach(slider => {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');
    slider.addEventListener('input', () => {
        if (valueDisplay) {
            valueDisplay.textContent = slider.value + '%';
        }
    });
});

// Stock Detail (for future expansion)
function showStockDetail(stockName) {
    console.log('Stock selected:', stockName);
    // Could open a detail modal here
}

// =============================================
// HAPTIC FEEDBACK SIMULATION
// =============================================
document.querySelectorAll('button, .portfolio-card, .stock-row, .result-item').forEach(element => {
    element.addEventListener('mousedown', () => {
        element.style.transform = element.style.transform ?
            element.style.transform.replace('scale(0.98)', 'scale(0.96)') :
            'scale(0.98)';
    });

    element.addEventListener('mouseup', () => {
        setTimeout(() => {
            element.style.transform = '';
        }, 100);
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = '';
    });
});

// =============================================
// STATE TOGGLE FUNCTIONS (for demo)
// =============================================
let emptyStates = { home: false, detail: false, search: false };
let loadingState = false;
let errorState = false;

function toggleEmptyState(screen) {
    emptyStates[screen] = !emptyStates[screen];
    const isOn = emptyStates[screen];

    if (screen === 'home') {
        const content = document.querySelector('#screen-home .portfolio-section');
        const summary = document.querySelector('#screen-home .home-summary');
        const emptyEl = document.getElementById('home-empty-state');
        const fab = document.querySelector('#screen-home .fab');

        if (content) content.style.display = isOn ? 'none' : '';
        if (summary) summary.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
        if (fab) fab.style.display = isOn ? 'none' : '';
    } else if (screen === 'detail') {
        const summary = document.querySelector('#screen-detail .detail-summary');
        const stocks = document.querySelector('#screen-detail .stocks-section');
        const actions = document.querySelector('#screen-detail .detail-actions');
        const emptyEl = document.getElementById('detail-empty-state');

        if (summary) summary.style.display = isOn ? 'none' : '';
        if (stocks) stocks.style.display = isOn ? 'none' : '';
        if (actions) actions.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
    } else if (screen === 'search') {
        const results = document.querySelector('#screen-search .search-results');
        const emptyEl = document.getElementById('search-empty-state');

        if (results) results.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
    }

    showToast(`${screen} Empty: ${isOn ? 'ON' : 'OFF'}`);
}

function toggleLoadingState() {
    loadingState = !loadingState;
    const isOn = loadingState;

    // 홈 화면 로딩 상태
    const homeContent = document.querySelector('#screen-home .portfolio-section');
    const homeSummary = document.querySelector('#screen-home .home-summary');
    const homeLoading = document.getElementById('home-loading-state');
    const fab = document.querySelector('#screen-home .fab');

    if (homeContent) homeContent.style.display = isOn ? 'none' : '';
    if (homeSummary) homeSummary.style.display = isOn ? 'none' : '';
    if (homeLoading) homeLoading.style.display = isOn ? 'block' : 'none';
    if (fab) fab.style.display = isOn ? 'none' : '';

    // 로딩 켤 때 Empty/Error는 끔
    if (isOn) {
        emptyStates.home = false;
        errorState = false;
        const emptyEl = document.getElementById('home-empty-state');
        const errorEl = document.getElementById('home-error-state');
        if (emptyEl) emptyEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
    }

    showToast(`Loading: ${isOn ? 'ON' : 'OFF'}`);
}

function toggleErrorState() {
    errorState = !errorState;
    const isOn = errorState;

    // 홈 화면 에러 상태
    const homeContent = document.querySelector('#screen-home .portfolio-section');
    const homeSummary = document.querySelector('#screen-home .home-summary');
    const homeError = document.getElementById('home-error-state');
    const fab = document.querySelector('#screen-home .fab');

    if (homeContent) homeContent.style.display = isOn ? 'none' : '';
    if (homeSummary) homeSummary.style.display = isOn ? 'none' : '';
    if (homeError) homeError.style.display = isOn ? 'flex' : 'none';
    if (fab) fab.style.display = isOn ? 'none' : '';

    // 에러 켤 때 Empty/Loading은 끔
    if (isOn) {
        emptyStates.home = false;
        loadingState = false;
        const emptyEl = document.getElementById('home-empty-state');
        const loadingEl = document.getElementById('home-loading-state');
        if (emptyEl) emptyEl.style.display = 'none';
        if (loadingEl) loadingEl.style.display = 'none';
    }

    showToast(`Error: ${isOn ? 'ON' : 'OFF'}`);
}

function showToast(message) {
    // Create toast element
    let toast = document.getElementById('demo-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}
