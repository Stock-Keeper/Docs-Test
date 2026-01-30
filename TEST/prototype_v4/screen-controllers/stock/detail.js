// =================================================================
// Stock-Keeper UI Prototype V4 - Stock Detail Controller
// Stock Domain
// =================================================================

import { navigateTo, goBack } from '../../core/navigation.js';

// Dummy Data (Can be replaced by shared store or API)
const MOCK_STOCK_DETAIL = {
    name: '삼성전자',
    code: '005930',
    price: 74500,
    change: 1200,
    changeRate: 1.6,
    time: '15:42 기준',
    holdings: {
        quantity: 150,
        avgPrice: 71200,
        totalValue: 11175000,
        profit: 495000,
        profitRate: 4.6
    },
    ratio: {
        current: 35,
        target: 30,
        deviation: 17, // +17%
        isOver: true
    }
};

let currentStockId = null;
let currentStockData = null;

// Edit State
let editQuantity = 0;
let editRating = 0;
let editBaseRatioSum = 70; // Other stocks sum

/**
 * Initialize detail screen
 * @param {Object} params - { id: '005930', stockData: {...} }
 */
export function init(params) {
    console.log('[StockDetail] Initializing with params:', params);

    currentStockId = params?.id || '005930'; // Default for dev
    currentStockData = MOCK_STOCK_DETAIL; // Replace with params.stockData if available in real app

    render(currentStockData);
    attachListeners();
}

function render(data) {
    // Header
    setText('stock-detail-name', data.name);
    setText('stock-detail-code', data.code);

    // Price
    setText('detail-current-price', `₩${data.price.toLocaleString()}`);

    const changeEl = document.getElementById('detail-price-change');
    if (changeEl) {
        changeEl.textContent = `${data.changeRate >= 0 ? '+' : ''}${data.change.toLocaleString()} (${data.changeRate >= 0 ? '+' : ''}${data.changeRate}%)`;
        changeEl.className = `price-change ${data.changeRate >= 0 ? 'positive' : 'negative'}`;
    }

    setText('detail-price-time', data.time);

    // Holdings
    setText('detail-quantity', `${data.holdings.quantity}주`);
    setText('detail-avg-price', `₩${data.holdings.avgPrice.toLocaleString()}`);
    setText('detail-total-value', `₩${data.holdings.totalValue.toLocaleString()}`);

    setText('detail-profit', `${data.holdings.profit >= 0 ? '+' : ''}₩${data.holdings.profit.toLocaleString()}`);
    const profitEl = document.getElementById('detail-profit');
    if (profitEl) profitEl.className = `holdings-value ${data.holdings.profit >= 0 ? 'positive' : 'negative'}`;

    setText('detail-profit-rate', `${data.holdings.profitRate >= 0 ? '+' : ''}${data.holdings.profitRate}%`);
    const rateEl = document.getElementById('detail-profit-rate');
    if (rateEl) rateEl.className = `holdings-value ${data.holdings.profitRate >= 0 ? 'positive' : 'negative'}`;

    // Ratio
    setText('detail-current-ratio', `${data.ratio.current}%`);
    const currentBar = document.getElementById('current-ratio-bar');
    if (currentBar) currentBar.style.width = `${Math.min(data.ratio.current, 100)}%`;

    setText('detail-target-ratio', `${data.ratio.target}%`);
    const targetBar = document.getElementById('target-ratio-bar');
    if (targetBar) targetBar.style.width = `${Math.min(data.ratio.target, 100)}%`;

    // Deviation Info
    const devInfo = document.getElementById('ratio-deviation-info');
    const devText = document.getElementById('deviation-text');

    if (Math.abs(data.ratio.deviation) > 10) { // Threshold 10%
        if (devInfo) {
            devInfo.className = 'ratio-deviation warning';
            devInfo.style.display = 'flex';
        }
        if (devText) devText.textContent = `괴리율 ${data.ratio.deviation > 0 ? '+' : ''}${data.ratio.deviation}% (임계값 초과)`;
    } else {
        if (devInfo) {
            devInfo.className = 'ratio-deviation ok';
            devInfo.style.display = 'flex';
        }
        if (devText) devText.textContent = '적정 범위 내';
    }
}

function attachListeners() {
    // Back
    document.getElementById('stock-detail-back-btn')?.addEventListener('click', () => goBack());

    // Edit Modal Openers
    document.getElementById('stock-edit-btn')?.addEventListener('click', openEditModal);

    // Delete
    document.getElementById('stock-delete-btn')?.addEventListener('click', openDeleteModal);

    // Modal Controls - Edit
    document.getElementById('edit-modal-close-btn')?.addEventListener('click', closeEditModal);
    document.getElementById('edit-cancel-btn')?.addEventListener('click', closeEditModal);
    document.getElementById('edit-save-btn')?.addEventListener('click', saveEdit);

    // Modal Controls - Delete
    document.getElementById('delete-modal-close-btn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('delete-cancel-btn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('delete-confirm-btn')?.addEventListener('click', confirmDelete);

    // Edit Logic
    document.getElementById('edit-qty-minus-btn')?.addEventListener('click', () => adjustEditQuantity(-1));
    document.getElementById('edit-qty-plus-btn')?.addEventListener('click', () => adjustEditQuantity(1));

    document.getElementById('edit-quantity-input')?.addEventListener('input', (e) => {
        editQuantity = parseInt(e.target.value) || 0;
    });

    document.getElementById('edit-ratio-slider')?.addEventListener('input', (e) => {
        editRating = parseInt(e.target.value);
        updateEditRatioDisplay();
    });
}

function openEditModal() {
    const modal = document.getElementById('stock-edit-modal');
    if (!modal || !currentStockData) return;

    // Init Values
    editQuantity = currentStockData.holdings.quantity;
    editRating = currentStockData.ratio.target;

    // Set UI
    setText('edit-stock-name', currentStockData.name);
    setText('edit-stock-code', currentStockData.code);

    const qtyInput = document.getElementById('edit-quantity-input');
    if (qtyInput) qtyInput.value = editQuantity;

    const slider = document.getElementById('edit-ratio-slider');
    if (slider) slider.value = editRating;

    updateEditRatioDisplay();

    modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('stock-edit-modal');
    if (modal) modal.style.display = 'none';
}

function adjustEditQuantity(delta) {
    const input = document.getElementById('edit-quantity-input');
    if (!input) return;

    let newValue = editQuantity + delta;
    if (newValue < 1) newValue = 1;

    editQuantity = newValue;
    input.value = editQuantity;
}

function updateEditRatioDisplay() {
    setText('edit-ratio-value', `${editRating}%`);
    setText('edit-base-ratio', `${editBaseRatioSum}%`);
    setText('edit-current-ratio', `${editRating}%`);

    const total = editBaseRatioSum + editRating;
    setText('edit-total-ratio', `${total}%`);

    const infoBox = document.getElementById('edit-ratio-sum-info');
    const warningMsg = document.getElementById('edit-ratio-warning-message');
    const warningIcon = document.getElementById('edit-ratio-warning-icon');
    const slider = document.getElementById('edit-ratio-slider');
    const sliderVal = document.getElementById('edit-ratio-value');

    if (total > 100) {
        infoBox?.classList.add('exceeded'); // checking css class name.. v3 css used 'exceeded' or 'warning'?
        // Checked detail.css: .edit-ratio-sum-info.exceeded
        warningMsg?.classList.add('show');
        warningIcon?.classList.add('show');
        slider?.classList.add('warning');
        sliderVal?.classList.add('warning');
    } else {
        infoBox?.classList.remove('exceeded');
        warningMsg?.classList.remove('show');
        warningIcon?.classList.remove('show');
        slider?.classList.remove('warning');
        sliderVal?.classList.remove('warning');
    }
}

function saveEdit() {
    console.log(`Saving Edit: Qty=${editQuantity}, Ratio=${editRating}%`);
    // API logic here
    closeEditModal();
}

// Delete Modal Functions
function openDeleteModal() {
    const modal = document.getElementById('stock-delete-modal');
    if (modal) modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('stock-delete-modal');
    if (modal) modal.style.display = 'none';
}

function confirmDelete() {
    console.log('Stock deleted');
    closeDeleteModal();
    goBack();
}

// =================================================================
// STATE MANAGEMENT
// =================================================================

/**
 * Set screen state (called from control panel)
 * @param {string} stateId - 'loading', 'delete', 'default'
 */
export function setState(stateId) {
    console.log('[StockDetail] Setting state:', stateId);

    // Elements to toggle
    const contentSections = document.querySelectorAll('.price-section, .chart-section, .holdings-section, .ratio-section, .stock-detail-actions');
    const loadingState = getOrCreateStateElement('detail-loading-state', 'loading-state', '⏳', '로딩 중...', '데이터를 불러오고 있습니다');

    // Reset
    if (loadingState) loadingState.style.display = 'none';
    closeDeleteModal(); // Reset modal

    switch (stateId) {
        case 'loading':
            contentSections.forEach(el => el.style.display = 'none');
            // Show skeleton UI
            let skeletonContainer = document.getElementById('detail-skeleton-container');
            if (!skeletonContainer) {
                const screen = document.getElementById('screen-stock-detail');
                const body = screen?.querySelector('.screen-body');
                if (body) {
                    skeletonContainer = document.createElement('div');
                    skeletonContainer.id = 'detail-skeleton-container';
                    skeletonContainer.style.padding = '0 20px';
                    skeletonContainer.innerHTML = `
                        <!-- Price Skeleton -->
                        <div style="padding: 20px 0; border-bottom: 1px solid var(--border-color);">
                            <div class="skeleton-text" style="width: 120px; height: 32px; margin-bottom: 8px;"></div>
                            <div class="skeleton-text" style="width: 100px; height: 16px;"></div>
                        </div>
                        <!-- Holdings Skeleton -->
                        <div style="margin-top: 24px;">
                            <div class="skeleton-text" style="width: 100px; height: 18px; margin-bottom: 16px;"></div>
                            <div class="skeleton-text" style="width: 100%; height: 180px; border-radius: 16px;"></div>
                        </div>
                        <!-- Ratio Skeleton -->
                        <div style="margin-top: 24px;">
                            <div class="skeleton-text" style="width: 80px; height: 18px; margin-bottom: 16px;"></div>
                            <div class="skeleton-text" style="width: 100%; height: 120px; border-radius: 16px;"></div>
                        </div>
                    `;
                    // Insert after header
                    const header = body.querySelector('.header');
                    if (header && header.nextSibling) {
                        body.insertBefore(skeletonContainer, header.nextSibling);
                    } else {
                        body.appendChild(skeletonContainer);
                    }
                }
            }
            if (skeletonContainer) skeletonContainer.style.display = 'block';
            break;
        case 'delete':
            // Hide skeleton, show content, open modal
            const skeletonDel = document.getElementById('detail-skeleton-container');
            if (skeletonDel) skeletonDel.style.display = 'none';
            contentSections.forEach(el => el.style.display = '');
            openDeleteModal();
            break;
        case 'default':
        default:
            // Hide skeleton, show content
            const skeletonDef = document.getElementById('detail-skeleton-container');
            if (skeletonDef) skeletonDef.style.display = 'none';
            contentSections.forEach(el => el.style.display = '');
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
        const screen = document.getElementById('screen-stock-detail');
        if (!screen) return null;
        const container = screen.querySelector('.screen-body');
        if (!container) return null;

        // Insert after header
        const header = container.querySelector('.header');

        el = document.createElement('div');
        el.id = id;
        el.className = className;
        el.style.display = 'none';
        el.innerHTML = `
            <div class="empty-icon">${icon}</div>
            <h3 class="empty-title">${title}</h3>
            <p class="empty-desc">${desc}</p>
        `;

        if (header && header.nextSibling) {
            container.insertBefore(el, header.nextSibling);
        } else {
            container.appendChild(el);
        }
    }
    return el;
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// =================================================================
// EVENT LISTENERS FOR CONTROL PANEL
// =================================================================
window.addEventListener('app-state-change', (e) => {
    if (e.detail.screenId === 'stock-detail') {
        setState(e.detail.state);
    }
});
