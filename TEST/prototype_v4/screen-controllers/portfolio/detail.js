// =================================================================
// Stock-Keeper UI Prototype V4 - Portfolio Detail Controller
// Portfolio Domain
// =================================================================

import { navigateTo } from '../../core/navigation.js';

// Dummy Data
const PORTFOLIOS = {
    '1': {
        name: '메인 포트폴리오',
        totalValue: 32450000,
        cashValue: 1622500,
        cashRatio: 5,
        returnValue: 2200000,
        returnRate: 7.27,
        stocks: [
            { name: '삼성전자', code: '005930', value: 11357500, changeRate: 5.2, currentRatio: 35, targetRatio: 30, deviation: 17, isOver: true },
            { name: 'SK하이닉스', code: '000660', value: 8112500, changeRate: 8.1, currentRatio: 25, targetRatio: 25, deviation: 0, isOk: true },
            { name: 'NAVER', code: '035420', value: 6490000, changeRate: 3.7, currentRatio: 20, targetRatio: 20, deviation: 0, isOk: true },
            { name: '카카오', code: '035720', value: 3894000, changeRate: -4.3, currentRatio: 12, targetRatio: 15, deviation: -20, isUnder: true },
            { name: 'LG에너지솔루션', code: '373220', value: 2596000, changeRate: 12.5, currentRatio: 8, targetRatio: 10, deviation: -20, isUnder: true }
        ],
        needRebalance: true,
        rebalanceMsg: '삼성전자 +17% 초과 · 카카오 -20% 미달'
    },
    '2': {
        name: '성장주 투자',
        totalValue: 8780500,
        cashValue: 87805,
        cashRatio: 1,
        returnValue: 1245000,
        returnRate: 12.45,
        stocks: [
            { name: '테슬라', code: 'TSLA', value: 5000000, changeRate: 15.2, currentRatio: 60, targetRatio: 50, deviation: 20, isOver: true }
        ],
        needRebalance: true,
        rebalanceMsg: '테슬라 비중 과다'
    }
};

let currentId = null;

/**
 * Initialize detail screen
 * @param {Object} params - Navigation parameters (e.g. { id: '1' })
 */
export function init(params) {
    console.log('[PortfolioDetail] Initializing with params:', params);

    currentId = params?.id || '1'; // Default to 1 if no id
    const data = PORTFOLIOS[currentId];

    if (!data) {
        console.error('[PortfolioDetail] Portfolio not found');
        return; // Handle error state
    }

    render(data);
    attachListeners();
}

function render(data) {
    // Header
    setText('detail-title', data.name);

    // Summary
    renderSummary(data);

    // Meta
    setText('detail-stock-count', `${data.stocks.length}종목`);
    const ratioSum = data.stocks.reduce((sum, s) => sum + s.currentRatio, 0);
    setText('detail-ratio-sum', `비율합계 ${ratioSum}%`);

    // Rebalance Insight
    const insightEl = document.getElementById('detail-rebalance-insight');
    if (insightEl) {
        insightEl.style.display = data.needRebalance ? 'flex' : 'none';
        setText('detail-insight-msg', data.rebalanceMsg);
    }

    // Stocks
    renderStocks(data.stocks);
}

function renderStocks(stocks) {
    const list = document.getElementById('detail-stock-list');
    if (!list) return;

    list.innerHTML = '';

    stocks.forEach(stock => {
        // Calculate Deviation Bar Width/Position
        let barHtml = '';
        let tagHtml = '';

        if (stock.isOver) {
            const width = Math.min(stock.deviation * 2, 50); // Scale factor 2
            barHtml = `<div class="deviation-fill over" style="width: ${width}%;"></div>`;
            tagHtml = `<div class="deviation-tag sell">+${stock.deviation}% 초과</div>`;
        } else if (stock.isUnder) {
            // 카카오 case: deviation -20 -> width 50% (visual requirement)
            // LG Energy case: deviation -20 -> width 40% (calculated)
            // User requested Kakao bar to be full left (50%). width = abs(deviation) * 2.5?
            // For now, let's keep logic simple but maximize for specific case or increase scale
            const width = Math.min(Math.abs(stock.deviation) * 2.5, 50);
            barHtml = `<div class="deviation-fill under" style="width: ${width}%;"></div>`;
            tagHtml = `<div class="deviation-tag buy">${stock.deviation}% 미달</div>`;
        } else {
            tagHtml = `<div class="deviation-tag ok">적정 범위 ✓</div>`;
        }

        const card = document.createElement('div');
        card.className = 'stock-card';
        card.innerHTML = `
            <div class="stock-card-header">
                <div class="stock-info">
                    <span class="stock-name">${stock.name}</span>
                    <span class="stock-code">${stock.code}</span>
                </div>
                <div class="stock-value-info">
                    <span class="value-main">₩${stock.value.toLocaleString()}</span>
                    <span class="value-change ${stock.changeRate >= 0 ? 'positive' : 'negative'}">${stock.changeRate >= 0 ? '+' : ''}${stock.changeRate}%</span>
                </div>
                <button class="delete-stock-btn">×</button>
            </div>
            <div class="stock-card-ratio">
                <div class="ratio-labels">
                    <span class="ratio-current-label">현재 ${stock.currentRatio}%</span>
                    <span class="ratio-target-label">목표 ${stock.targetRatio}%</span>
                </div>
                <div class="deviation-bar">
                    <div class="deviation-track">
                        <div class="deviation-center"></div>
                        ${barHtml}
                    </div>
                </div>
                ${tagHtml}
            </div>
        `;
        list.appendChild(card);

        // Click Event for Detail Navigation
        card.addEventListener('click', (e) => {
            if (e.target.closest('.delete-stock-btn')) return;
            navigateTo('stock-detail', { id: stock.code, stockData: stock });
        });
    });
}

function attachListeners() {
    // Replace cloneNode with direct onclick assignment for robustness

    // Back Button
    const backBtn = document.getElementById('detail-back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            console.log('[PortfolioDetail] Back button clicked');
            navigateTo('portfolio-list');
        };
    }

    // Hamburger Menu Button
    const menuBtn = document.getElementById('detail-menu-btn');
    const dropdownMenu = document.getElementById('detail-dropdown-menu');
    if (menuBtn && dropdownMenu) {
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            const screen = document.getElementById('screen-portfolio-detail');

            // If in edit mode, exit edit mode instead of showing dropdown
            if (screen && screen.classList.contains('edit-mode')) {
                toggleEditMode();
                return;
            }

            const isVisible = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isVisible ? 'none' : 'block';
        };
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdownMenu && !e.target.closest('#detail-menu-btn') && !e.target.closest('#detail-dropdown-menu')) {
            dropdownMenu.style.display = 'none';
        }
    });

    // Dropdown Menu Items
    const menuThreshold = document.getElementById('menu-threshold');
    const menuNotification = document.getElementById('menu-notification');
    const menuEdit = document.getElementById('menu-edit');

    if (menuThreshold) {
        menuThreshold.onclick = () => {
            dropdownMenu.style.display = 'none';
            showModal('threshold-modal');
        };
    }

    if (menuNotification) {
        menuNotification.onclick = () => {
            dropdownMenu.style.display = 'none';
            showModal('notification-modal');
        };
    }

    if (menuEdit) {
        menuEdit.onclick = () => {
            dropdownMenu.style.display = 'none';
            toggleEditMode();
        };
    }

    // Bottom Sheet Close Buttons
    const thresholdCloseBtn = document.getElementById('threshold-close-btn');
    const thresholdSaveBtn = document.getElementById('threshold-save-btn');
    const notificationCloseBtn = document.getElementById('notification-close-btn');
    const notificationSaveBtn = document.getElementById('notification-save-btn');

    if (thresholdCloseBtn) thresholdCloseBtn.onclick = () => hideModal('threshold-modal');
    if (thresholdSaveBtn) thresholdSaveBtn.onclick = () => {
        console.log('[PortfolioDetail] Threshold saved');
        hideModal('threshold-modal');
    };
    if (notificationCloseBtn) notificationCloseBtn.onclick = () => hideModal('notification-modal');
    if (notificationSaveBtn) notificationSaveBtn.onclick = () => {
        console.log('[PortfolioDetail] Notification settings saved');
        hideModal('notification-modal');
    };

    // Close modals on overlay click
    ['threshold-modal', 'notification-modal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) hideModal(modalId);
            };
        }
    });

    // Add Stock Button (Bottom Action)
    const addBtn = document.getElementById('detail-add-stock-btn');
    if (addBtn) {
        addBtn.onclick = () => navigateTo('stock-search');
    }

    // Add Stock Button (Empty State)
    const emptyAddBtn = document.getElementById('detail-add-stock-empty-btn');
    if (emptyAddBtn) {
        emptyAddBtn.onclick = () => navigateTo('stock-search');
    }

    // Rebalance Action Button (Bottom)
    const rebalanceBtn = document.getElementById('detail-rebalance-action-btn');
    if (rebalanceBtn) {
        rebalanceBtn.onclick = () => navigateTo('rebalancing-check');
    }

    // Insight Banner Button
    const insightBtn = document.getElementById('detail-rebalance-btn');
    if (insightBtn) {
        insightBtn.onclick = () => {
            console.log('[PortfolioDetail] Insight button clicked');
            navigateTo('rebalancing-check');
        };
    }
}

function toggleEditMode() {
    const screen = document.getElementById('screen-portfolio-detail');
    const menuBtn = document.getElementById('detail-menu-btn');

    screen.classList.toggle('edit-mode');

    // Toggle button text
    if (screen.classList.contains('edit-mode')) {
        if (menuBtn) menuBtn.textContent = '완료';
        console.log('[PortfolioDetail] Entered edit mode');
    } else {
        if (menuBtn) menuBtn.textContent = '☰';
        console.log('[PortfolioDetail] Exited edit mode');
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// =================================================================
// STATE MANAGEMENT & DEVELOPER TOOLS
// =================================================================

window.addEventListener('app-state-change', (e) => {
    if (e.detail.screenId === 'portfolio-detail') {
        renderState(e.detail.state);
    }
});

function renderState(stateId) {
    const screen = document.getElementById('screen-portfolio-detail');
    if (!screen) return;

    // Elements to toggle
    const stocksSection = screen.querySelector('.stocks-section');
    const actions = screen.querySelector('.detail-actions');

    // Clear existing overrides
    screen.querySelectorAll('.state-message-container').forEach(el => el.remove());
    if (stocksSection) stocksSection.style.display = 'block';

    // Reset Data
    const data = PORTFOLIOS[currentId];

    switch (stateId) {
        case 'loading':
            // Summary Loading State
            renderSummary(null, 'loading');

            if (stocksSection) {
                stocksSection.innerHTML = `
                    <div class="section-header">
                        <h3>불러오는 중...</h3>
                    </div>
                    ${Array(3).fill(0).map(() => `
                        <div class="stock-card skeleton-card" style="height: 100px; background: rgba(255,255,255,0.05); margin-bottom: 12px; border-radius: 16px;"></div>
                    `).join('')}
                `;
            }
            break;

        case 'empty':
            // Summary Empty State (Zero values)
            renderSummary(null, 'empty');

            if (stocksSection) stocksSection.style.display = 'none';
            injectStateMessage(screen, '📭', '보유한 종목이 없습니다.', '새 종목을 추가해보세요.');
            break;

        case 'error':
            // Summary Error State
            renderSummary(null, 'error');

            if (stocksSection) stocksSection.style.display = 'none';
            injectStateMessage(screen, '⚠️', '정보를 불러올 수 없습니다.', '네트워크 연결을 확인해주세요.');
            break;

        case 'edit-mode':
            toggleEditMode(); // Just toggle, don't replace content
            break;

        case 'default':
        default:
            // Restore Content
            if (data) {
                renderSummary(data);
                if (stocksSection) {
                    stocksSection.innerHTML = `
                       <div class="section-header">
                            <h3>보유 종목</h3>
                            <div class="stock-meta">
                                <span class="stock-count" id="detail-stock-count">${data.stocks.length}종목</span>
                                <span class="ratio-sum" id="detail-ratio-sum">비율합계 ${data.stocks.reduce((sum, s) => sum + s.currentRatio, 0)}%</span>
                            </div>
                        </div>
                        <div class="rebalance-insight" id="detail-rebalance-insight" style="display: ${data.needRebalance ? 'flex' : 'none'};">
                            <span class="insight-icon">⚠️</span>
                            <div class="insight-text">
                                <span class="insight-title">리밸런싱 필요</span>
                                <span class="insight-detail" id="detail-insight-msg">${data.rebalanceMsg}</span>
                            </div>
                            <button class="insight-btn" id="detail-rebalance-btn">분석 →</button>
                        </div>
                        <div class="stocks-cards" id="detail-stock-list"></div>
                    `;
                    renderStocks(data.stocks); // Re-render logic

                    // Re-attach listeners for dynamic content
                    const rebalanceBtn = document.getElementById('detail-rebalance-btn');
                    if (rebalanceBtn) {
                        rebalanceBtn.addEventListener('click', () => navigateTo('rebalancing-check'));
                    }
                }
            }
            break;
    }
}

function renderSummary(data, state = 'default') {
    if (state === 'loading') {
        const skeletonHtml = '<span class="skeleton-text" style="width: 80px;"></span>';
        const skeletonHtmlLarge = '<span class="skeleton-text" style="width: 120px; height: 1.5em;"></span>';

        // Use innerHTML for skeletons
        document.getElementById('detail-total-val').innerHTML = skeletonHtmlLarge;
        document.getElementById('detail-cash-val').innerHTML = skeletonHtml;
        document.getElementById('detail-cash-ratio').innerHTML = '<span class="skeleton-text" style="width: 20px;"></span>';
        document.getElementById('detail-return-val').innerHTML = skeletonHtml;
        document.getElementById('detail-return-rate').innerHTML = skeletonHtml;
        return;
    }

    if (state === 'empty') {
        setText('detail-total-val', '₩0');
        setText('detail-cash-val', '₩0');
        setText('detail-cash-ratio', '0');
        setText('detail-return-val', '₩0');
        setText('detail-return-rate', '0.00%');
        updateValueColor('detail-return-val', 0);
        updateValueColor('detail-return-rate', 0);
        return;
    }

    if (state === 'error') {
        setText('detail-total-val', '-');
        setText('detail-cash-val', '-');
        setText('detail-cash-ratio', '-');
        setText('detail-return-val', '-');
        setText('detail-return-rate', '-');
        return;
    }

    // Default: Render Data
    if (!data) return;

    setText('detail-total-val', `₩${data.totalValue.toLocaleString()}`);
    setText('detail-cash-val', `₩${data.cashValue.toLocaleString()}`);
    setText('detail-cash-ratio', data.cashRatio);
    setText('detail-return-val', `${data.returnValue > 0 ? '+' : ''}₩${data.returnValue.toLocaleString()}`);
    setText('detail-return-rate', `${data.returnRate > 0 ? '+' : ''}${data.returnRate}%`);

    updateValueColor('detail-return-val', data.returnValue);
    updateValueColor('detail-return-rate', data.returnRate);
}

function updateValueColor(elementId, value) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Remove old classes
    el.classList.remove('positive', 'negative');

    // Add new class based on value
    if (value > 0) el.classList.add('positive');
    else if (value < 0) el.classList.add('negative');
}

function injectStateMessage(screen, icon, title, subtitle) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'state-message-container';
    msgDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        text-align: center;
        color: var(--text-secondary);
    `;
    msgDiv.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">${icon}</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">${title}</div>
        <div style="font-size: 14px;">${subtitle}</div>
    `;

    // Insert after summary
    const summary = screen.querySelector('.detail-summary');
    if (summary) {
        summary.parentNode.insertBefore(msgDiv, summary.nextSibling);
    } else {
        screen.appendChild(msgDiv);
    }
}
