// =================================================================
// Stock-Keeper UI Prototype V4 - Stock Search Controller
// Stock Domain
// =================================================================

import { navigateTo, goBack } from '../../core/navigation.js';

// Dummy Data for Search
const MOCK_STOCKS = [
    { name: '삼성전자', code: '005930', market: 'KOSPI', price: 74500, change: 1200, changeRate: 1.6 },
    { name: 'SK하이닉스', code: '000660', market: 'KOSPI', price: 142000, change: -2500, changeRate: -1.7 },
    { name: 'NAVER', code: '035420', market: 'KOSPI', price: 215000, change: 3000, changeRate: 1.4 },
    { name: '카카오', code: '035720', market: 'KOSPI', price: 54300, change: -500, changeRate: -0.9 },
    { name: '현대차', code: '005380', market: 'KOSPI', price: 186500, change: 2300, changeRate: 1.24 },
    { name: 'LG에너지솔루션', code: '373220', market: 'KOSPI', price: 412000, change: 5000, changeRate: 1.2 },
    { name: 'POSCO홀딩스', code: '005490', market: 'KOSPI', price: 450000, change: 15000, changeRate: 3.4 },
    { name: '셀트리온', code: '068270', market: 'KOSDAQ', price: 180000, change: 2000, changeRate: 1.1 }
];

// 이미 보유 중인 종목 코드 (더미)
const OWNED_STOCK_CODES = ['005930', '035420'];

let selectedStock = null;
let addQuantity = 10;
let addRatio = 10;
let baseRatioSum = 90; // Mock existing ratio sum

/**
 * Initialize search screen
 */
export function init() {
    console.log('[StockSearch] Initializing...');
    reset(); // Call reset on init
    attachListeners();
    updateRatioSummary();
}

/**
 * Reset screen state (clears inputs and results)
 */
export function reset() {
    console.log('[StockSearch] Resetting state...');
    selectedStock = null;
    addQuantity = 10;
    addRatio = 10;

    // Clear Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Clear Results
    handleSearch('');
}

function attachListeners() {
    // Back Button
    const backBtn = document.getElementById('search-back-btn');
    if (backBtn) {
        // Clone to ensure clean listeners or just use once since we are initing
        const newBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBtn, backBtn);
        newBtn.addEventListener('click', () => goBack());
    }

    // Search Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = ''; // Clear input on init
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Clear Search Button
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
        clearBtn.style.display = 'none';
        clearBtn.addEventListener('click', clearSearch);
    }

    // Modal Controls
    const closeBtn = document.getElementById('stock-modal-close-btn');
    if (closeBtn) {
        const newBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newBtn, closeBtn);
        newBtn.addEventListener('click', closeStockModal);
    }

    const cancelBtn = document.getElementById('stock-modal-cancel-btn');
    if (cancelBtn) {
        const newBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newBtn, cancelBtn);
        newBtn.addEventListener('click', closeStockModal);
    }

    const confirmBtn = document.getElementById('stock-modal-confirm-btn');
    if (confirmBtn) {
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        newBtn.addEventListener('click', confirmAddStock);
    }

    // Quantity Controls
    document.getElementById('qty-minus-btn')?.addEventListener('click', () => adjustQuantity(-1));
    document.getElementById('qty-plus-btn')?.addEventListener('click', () => adjustQuantity(1));

    // Quantity Input
    document.getElementById('stock-quantity')?.addEventListener('input', (e) => {
        addQuantity = parseInt(e.target.value) || 0;
        updateEstimatedAmount();
    });

    // Ratio Slider
    document.getElementById('ratio-slider')?.addEventListener('input', (e) => {
        addRatio = parseInt(e.target.value);
        updateRatioDisplay();
    });
}

function handleSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    const emptyState = document.getElementById('search-empty-state');
    const initialState = document.getElementById('search-initial-state');
    const clearBtn = document.getElementById('clear-search-btn');

    // Toggle clear button
    if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }

    if (!query) {
        resultsContainer.innerHTML = '';
        initialState.style.display = 'flex';
        emptyState.style.display = 'none';
        return;
    }

    initialState.style.display = 'none';

    // Filter logic
    const results = MOCK_STOCKS.filter(stock =>
        stock.name.includes(query) || stock.code.includes(query)
    );

    if (results.length === 0) {
        resultsContainer.innerHTML = '';
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        renderResults(results);
    }
}

function renderResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    results.forEach(stock => {
        const isOwned = OWNED_STOCK_CODES.includes(stock.code);
        const item = document.createElement('div');
        item.className = `result-item${isOwned ? ' owned' : ''}`;
        item.innerHTML = `
            <div class="result-info">
                <span class="result-name">${stock.name}${isOwned ? ' <span class="owned-badge">보유</span>' : ''}</span>
                <span class="result-code">${stock.code} · ${stock.market}</span>
            </div>
            <div class="result-price">
                <span class="price">₩${stock.price.toLocaleString()}</span>
                <span class="change ${stock.changeRate >= 0 ? 'positive' : 'negative'}">
                    ${stock.changeRate >= 0 ? '+' : ''}${stock.changeRate}%
                </span>
            </div>
        `;

        // 보유 종목은 클릭 불가
        if (!isOwned) {
            item.addEventListener('click', () => openStockModal(stock));
        }
        container.appendChild(item);
    });
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        handleSearch('');
        searchInput.focus();
    }
}

// ===================================
// Modal Logic
// ===================================

function openStockModal(stock) {
    selectedStock = stock;
    const modal = document.getElementById('stock-add-modal');
    if (!modal) return;

    // Reset inputs
    addQuantity = 10;
    addRatio = 10;

    // Render Modal Data
    setText('modal-stock-name', stock.name);
    setText('modal-stock-code', stock.code);
    setText('modal-stock-price', `₩${stock.price.toLocaleString()}`);

    const changeEl = document.getElementById('modal-stock-change');
    if (changeEl) {
        changeEl.textContent = `${stock.changeRate >= 0 ? '+' : ''}${stock.changeRate}%`;
        changeEl.className = `price-change ${stock.changeRate >= 0 ? 'positive' : 'negative'}`;
    }

    // Update Inputs
    const qtyInput = document.getElementById('stock-quantity');
    if (qtyInput) qtyInput.value = addQuantity;

    const slider = document.getElementById('ratio-slider');
    if (slider) slider.value = addRatio;

    updateEstimatedAmount();
    updateRatioDisplay();

    // Show Modal
    modal.style.display = 'flex';

    // Close on outside click is handled by CSS structure (overlay is parent), 
    // but we need JS to detect click on overlay vs content if structure is one block
    // structure: #stock-add-modal (overlay) > .modal-content
    modal.onclick = (e) => {
        if (e.target === modal) closeStockModal();
    };
}

function closeStockModal() {
    const modal = document.getElementById('stock-add-modal');
    if (modal) modal.style.display = 'none';
}

function adjustQuantity(delta) {
    const input = document.getElementById('stock-quantity');
    if (!input) return;

    let newValue = addQuantity + delta;
    if (newValue < 1) newValue = 1;

    addQuantity = newValue;
    input.value = addQuantity;
    updateEstimatedAmount();
}

function updateEstimatedAmount() {
    if (!selectedStock) return;
    const total = selectedStock.price * addQuantity;
    setText('estimated-amount', `예상 금액: ₩${total.toLocaleString()}`);
}

function updateRatioDisplay() {
    setText('ratio-display', `${addRatio}%`);
    setText('base-ratio-display', `${baseRatioSum}%`);
    setText('current-add-ratio', `${addRatio}%`);

    const total = baseRatioSum + addRatio;
    setText('total-ratio', `${total}%`);

    const infoBox = document.getElementById('ratio-sum-info');
    const warningMsg = document.getElementById('ratio-warning-message');
    const warningIcon = document.getElementById('ratio-warning-icon');
    const slider = document.getElementById('ratio-slider');
    const sliderVal = document.getElementById('ratio-display');
    const confirmBtn = document.getElementById('confirm-add-btn');

    if (total > 100) {
        infoBox?.classList.add('warning');
        warningMsg?.classList.add('show');
        warningIcon?.classList.add('show');
        slider?.classList.add('warning');
        sliderVal?.classList.add('warning');
        confirmBtn?.classList.add('warning');
    } else {
        infoBox?.classList.remove('warning');
        warningMsg?.classList.remove('show');
        warningIcon?.classList.remove('show');
        slider?.classList.remove('warning');
        sliderVal?.classList.remove('warning');
        confirmBtn?.classList.remove('warning');
    }
}

function confirmAddStock() {
    if (!selectedStock) return;

    // Logic to add stock to portfolio would go here
    console.log(`Adding stock: ${selectedStock.name}, Qty: ${addQuantity}, Ratio: ${addRatio}%`);

    closeStockModal();
    // Maybe show toast or navigate back
    goBack();
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// =================================================================
// STATE MANAGEMENT
// =================================================================

/**
 * Set screen state (called from control panel)
 * @param {string} stateId - 'loading', 'empty', 'error', 'default'
 */
export function setState(stateId) {
    console.log('[StockSearch] Setting state:', stateId);

    const resultsContainer = document.getElementById('search-results');
    const emptyState = document.getElementById('search-empty-state');
    const initialState = document.getElementById('search-initial-state');
    const loadingState = getOrCreateStateElement('search-loading-state', 'loading-state', '⏳', '검색 중...', '잠시만 기다려주세요');
    const errorState = getOrCreateStateElement('search-error-state', 'error-state', '⚠️', '에러가 발생했습니다', '다시 시도해주세요');

    // Reset visibility
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    if (initialState) initialState.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';

    switch (stateId) {
        case 'loading':
            // Show skeleton search result cards
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                resultsContainer.innerHTML = Array(3).fill(0).map(() => `
                    <div class="result-item skeleton-item">
                        <div class="result-info">
                            <div class="skeleton-text" style="width: 100px; height: 18px; margin-bottom: 6px;"></div>
                            <div class="skeleton-text" style="width: 80px; height: 14px;"></div>
                        </div>
                        <div class="result-price" style="text-align: right;">
                            <div class="skeleton-text" style="width: 70px; height: 18px; margin-bottom: 6px; margin-left: auto;"></div>
                            <div class="skeleton-text" style="width: 50px; height: 14px; margin-left: auto;"></div>
                        </div>
                    </div>
                `).join('');
            }
            break;
        case 'empty':
            if (emptyState) emptyState.style.display = 'flex';
            break;
        case 'error':
            if (errorState) {
                errorState.style.display = 'flex';
                errorState.style.flex = '1';
                errorState.style.justifyContent = 'center';
                errorState.style.alignItems = 'center';
            }
            break;
        case 'default':
        default:
            // Show initial state or results if query exists?? 
            // For simplicity, default goes back to initial state unless we have results logic.
            // But usually default implies "normal content".
            // Let's rely on current input value.
            const searchInput = document.getElementById('search-input');
            if (searchInput && searchInput.value.length > 0) {
                if (resultsContainer) resultsContainer.style.display = 'block';
            } else {
                if (initialState) initialState.style.display = 'flex';
            }
            break;
    }
}

/**
 * Helper to get or create a state element dynamically
 */
function getOrCreateStateElement(id, className, icon, title, desc) {
    let el = document.getElementById(id);
    if (!el) {
        // Fix: Scope to this specific screen
        const screen = document.getElementById('screen-stock-search');
        if (!screen) return null;
        const container = screen.querySelector('.screen-body');
        if (!container) return null;

        el = document.createElement('div');
        el.id = id;
        el.className = className;
        el.style.display = 'none';
        el.innerHTML = `
            <div class="empty-icon">${icon}</div>
            <h3 class="empty-title">${title}</h3>
            <p class="empty-desc">${desc}</p>
        `;
        container.appendChild(el);
    }
    return el;
}

function updateRatioSummary() {
    setText('current-ratio-sum', `${baseRatioSum}%`);
}

// =================================================================
// EVENT LISTENERS FOR CONTROL PANEL
// =================================================================
window.addEventListener('app-state-change', (e) => {
    if (e.detail.screenId === 'stock-search') {
        setState(e.detail.state);
    }
});
