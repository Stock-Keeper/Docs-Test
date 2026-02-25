// =================================================================
// Stock-Keeper UI Prototype V4 - Portfolio List Controller
// Portfolio Domain
// =================================================================

import { navigateTo } from '../../core/navigation.js';

let state = {
    portfolios: [],
    isLoading: false
};

/**
 * Initialize portfolio list screen
 */
export function init() {
    console.log('[PortfolioList] Initializing...');

    const screen = document.getElementById('screen-portfolio-list');
    if (!screen) return;

    // Settings Button (헤더)
    const settingsBtn = screen.querySelector('#settings-btn');
    if (settingsBtn) {
        const newBtn = settingsBtn.cloneNode(true);
        settingsBtn.parentNode.replaceChild(newBtn, settingsBtn);
        newBtn.addEventListener('click', () => navigateTo('settings-main'));
    }

    // Notification Button (헤더)
    const notificationBtn = screen.querySelector('#notification-btn');
    if (notificationBtn) {
        const newBtn = notificationBtn.cloneNode(true);
        notificationBtn.parentNode.replaceChild(newBtn, notificationBtn);
        newBtn.addEventListener('click', () => navigateTo('notification-center'));
    }

    // FAB (포트폴리오 추가)
    const fab = screen.querySelector('#portfolio-add-fab');
    if (fab) {
        const newFab = fab.cloneNode(true);
        fab.parentNode.replaceChild(newFab, fab);
        newFab.addEventListener('click', openCreateModal);
    }

    // List items click delegation
    const listContainer = screen.querySelector('#portfolio-list-container');
    if (listContainer) {
        const newContainer = listContainer.cloneNode(true);
        listContainer.parentNode.replaceChild(newContainer, listContainer);

        newContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.portfolio-card');
            if (card) {
                const id = card.dataset.id;
                console.log(`[PortfolioList] Card clicked: ${id}`);
                navigateTo('portfolio-detail', { id });
            }
        });
    }

    // Initialize Modal Listeners
    initModalListeners(screen);

    console.log('[PortfolioList] Initialized');
}

/**
 * Initialize Modal Listeners
 */
function initModalListeners(screen) {
    const modal = screen.querySelector('#create-portfolio-modal');
    if (!modal) return;

    // Close buttons
    const closeBtnX = modal.querySelector('#portfolio-modal-close-btn');
    const cancelBtn = modal.querySelector('#portfolio-modal-cancel-btn');

    // Clone to ensure clean listeners
    if (closeBtnX) {
        const newBtn = closeBtnX.cloneNode(true);
        closeBtnX.parentNode.replaceChild(newBtn, closeBtnX);
        newBtn.addEventListener('click', closeCreateModal);
    }

    if (cancelBtn) {
        const newBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newBtn, cancelBtn);
        newBtn.addEventListener('click', closeCreateModal);
    }

    // Create button
    const createBtn = modal.querySelector('#portfolio-modal-create-btn');
    if (createBtn) {
        const newBtn = createBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(newBtn, createBtn);
        newBtn.addEventListener('click', handleCreatePortfolio);
        newBtn.disabled = true; // Initial state: disabled because name is empty
    }

    // Input listeners (Character count & Validation)
    const nameInput = modal.querySelector('#portfolio-name-input');
    const descInput = modal.querySelector('#portfolio-desc-input');
    const nameCount = modal.querySelector('#name-count');
    const descCount = modal.querySelector('#desc-count');

    if (nameInput) {
        const newInput = nameInput.cloneNode(true);
        nameInput.parentNode.replaceChild(newInput, nameInput);

        newInput.addEventListener('input', (e) => {
            const len = e.target.value.length;
            if (nameCount) nameCount.textContent = `${len}/20자`;

            // Enable/Disable create button
            const btn = modal.querySelector('#modal-create-btn');
            if (btn) btn.disabled = len === 0;
        });
    }

    if (descInput) {
        const newInput = descInput.cloneNode(true);
        descInput.parentNode.replaceChild(newInput, descInput);

        newInput.addEventListener('input', (e) => {
            const len = e.target.value.length;
            if (descCount) descCount.textContent = `${len}/100자`;
        });
    }
}

/**
 * Open Create Modal
 */
function openCreateModal() {
    const modal = document.getElementById('create-portfolio-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Focus name input
        const nameInput = modal.querySelector('#portfolio-name-input');
        if (nameInput) {
            nameInput.value = ''; // Reset
            setTimeout(() => nameInput.focus(), 100);
        }

        // Reset description and counts
        const descInput = modal.querySelector('#portfolio-desc-input');
        if (descInput) descInput.value = '';

        const nameCount = modal.querySelector('#name-count');
        if (nameCount) nameCount.textContent = '0/20자';

        const descCount = modal.querySelector('#desc-count');
        if (descCount) descCount.textContent = '0/100자';

        // Disable create button
        const createBtn = modal.querySelector('#modal-create-btn');
        if (createBtn) createBtn.disabled = true;
    }
}

/**
 * Close Create Modal
 */
function closeCreateModal() {
    const modal = document.getElementById('create-portfolio-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Handle Create Portfolio
 */
async function handleCreatePortfolio() {
    const nameInput = document.getElementById('portfolio-name-input');
    const descInput = document.getElementById('portfolio-desc-input');

    if (!nameInput) return;

    const name = nameInput.value.trim();
    const desc = descInput ? descInput.value.trim() : '';

    if (!name) return;

    console.log(`[PortfolioList] Creating portfolio: ${name}, ${desc}`);

    closeCreateModal();
    // In real app, re-fetch and render. Here we stay in default state.
}

// State Management Listener
window.addEventListener('app-state-change', (e) => {
    if (e.detail.screenId === 'portfolio-list') {
        renderState(e.detail.state);
    }
});

function renderState(stateId) {
    const container = document.getElementById('portfolio-list-container');
    const emptyState = document.getElementById('portfolio-empty-state');
    const errorState = document.getElementById('portfolio-error-state');

    // Reset all
    if (container) container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';

    // Remove loading override if exists
    // (Assuming loading skeleton is handled by innerHTML replacement or overlay)

    switch (stateId) {
        case 'loading':
            if (container) {
                container.style.display = 'flex';
                // Inject Skeletons
                container.innerHTML = Array(3).fill(0).map(() => `
                    <div class="portfolio-card skeleton-card" style="height: 120px; background: rgba(255,255,255,0.05);"></div>
                `).join('');
            }
            break;

        case 'empty':
            if (emptyState) emptyState.style.display = 'flex';
            break;

        case 'error':
            if (errorState) errorState.style.display = 'flex';
            break;

        case 'show-splash-ad':
            // 컨트롤 패널 상태 버튼 클릭 시 수동으로 전면 광고 창 호출
            navigateTo('ads-splash-interstitial');
            break;

        case 'default':
        default:
            if (container) {
                container.style.display = 'flex';
                // Restore Dummy Data (Quick & Dirty re-render)
                // ideally call renderPortfolios(state.portfolios)
                // For prototype, just reload initial dummy data or similar
                // init(); // Removing unnecessary init call
                // Better: Just re-inject HTML.
                container.innerHTML = `
                    <!-- Portfolio Card 1 -->
                    <div class="portfolio-card" data-id="1">
                        <div class="portfolio-card-header">
                            <div class="portfolio-color" style="background: linear-gradient(135deg, #FF6B6B, #EE5D5D);"></div>
                            <div class="portfolio-info">
                                <h4>메인 포트폴리오</h4>
                                <span class="portfolio-stocks">삼성전자 외 2종목</span>
                            </div>
                            <span class="portfolio-arrow">›</span>
                        </div>
                        <div class="portfolio-card-body">
                            <div class="portfolio-value">
                                <span class="value-label">총 평가금액</span>
                                <span class="value-amount">₩32,450,000</span>
                            </div>
                            <div class="portfolio-return positive">+7.27%</div>
                        </div>
                        <div class="cash-section">
                            <span class="cash-label">예수금</span>
                            <div class="portfolio-sub-row">
                                <span class="cash-value">₩1,622,500</span>
                                <span class="rebalance-badge">리밸런싱 필요</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Portfolio Card 2 -->
                    <div class="portfolio-card" data-id="2">
                        <div class="portfolio-card-header">
                            <div class="portfolio-color" style="background: linear-gradient(135deg, #4facfe, #00f2fe);"></div>
                            <div class="portfolio-info">
                                <h4>성장주 투자</h4>
                                <span class="portfolio-stocks">테슬라</span>
                            </div>
                            <span class="portfolio-arrow">›</span>
                        </div>
                        <div class="portfolio-card-body">
                            <div class="portfolio-value">
                                <span class="value-label">총 평가금액</span>
                                <span class="value-amount">₩8,780,500</span>
                            </div>
                            <div class="portfolio-return positive">+12.45%</div>
                        </div>
                    </div>
                `;
            }
            break;
    }
}
