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
            { name: '카카오', code: '035720', value: 3894000, changeRate: -4.3, currentRatio: 12, targetRatio: 15, deviation: -20, isUnder: true }
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
    setText('detail-total-val', `₩${data.totalValue.toLocaleString()}`);
    setText('detail-cash-val', `₩${data.cashValue.toLocaleString()}`);
    setText('detail-cash-ratio', data.cashRatio);
    setText('detail-return-val', `${data.returnValue > 0 ? '+' : ''}₩${data.returnValue.toLocaleString()}`);
    setText('detail-return-rate', `${data.returnRate > 0 ? '+' : ''}${data.returnRate}%`);

    const returnValEl = document.getElementById('detail-return-val');
    if (returnValEl) {
        returnValEl.className = `item-value ${data.returnValue >= 0 ? 'positive' : 'negative'}`; // Using base.css utilities if available? No, detail.css defines colors? No, uses vars.
        // Actually detail.css uses .positive class in summary-change but summary-item uses inheritance?
        // Wait, v3 detail.css .item-value.positive definitions are missing in the ported CSS?
        // Let's check detail.css content I wrote.
        // I copied v3 detail.css... 
        // v3 detail.css defines .item-value.positive? 
        // Checking... No, it uses .summary-change.positive in home.css, but detail.css items?
        // Line 34 in v3 detail.html has class "item-value positive". 
        // But in v3 detail.css I only saw .item-value, .item-value.large. 
        // Maybe 'positive' class comes from components.css or base.css?
        // Yes, components.css defines .positive { color: var(--success); }
        // So just adding 'positive' class works.
    }
    const returnRateEl = document.getElementById('detail-return-rate');
    if (returnRateEl) returnRateEl.className = `item-value ${data.returnRate >= 0 ? 'positive' : 'negative'}`;

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
        // range: 0 ~ 100? No, usually -20% ~ +20% deviation.
        // v3 implementation logic:
        // .deviation-fill.over { left: 50%; width: X% }
        // .deviation-fill.under { right: 50%; width: X% }
        // simple mapping: deviation 20 -> width 40% (scale factor 2)

        let barHtml = '';
        let tagHtml = '';

        if (stock.isOver) {
            const width = Math.min(stock.deviation * 2, 50); // Scale factor 2
            barHtml = `<div class="deviation-fill over" style="width: ${width}%;"></div>`;
            tagHtml = `<div class="deviation-tag sell">+${stock.deviation}% 초과</div>`;
        } else if (stock.isUnder) {
            const width = Math.min(Math.abs(stock.deviation) * 2, 50);
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
            // Prevent navigation if delete button or other controls are clicked
            if (e.target.closest('.delete-stock-btn')) return;

            // Navigate to stock detail
            // Pass stock info (mocking ID based on code or index)
            navigateTo('stock-detail', { id: stock.code, stockData: stock });
        });
    });
}

function attachListeners() {
    const backBtn = document.getElementById('detail-back-btn');
    if (backBtn) {
        // Clone to ensure clean listeners
        const newBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBtn, backBtn);
        newBtn.addEventListener('click', () => {
            navigateTo('portfolio-list');
        });
    }

    const editBtn = document.getElementById('detail-edit-btn');
    if (editBtn) {
        const newBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(newBtn, editBtn);
        newBtn.addEventListener('click', toggleEditMode);
    }

    // Add Stock Button (Bottom Action)
    const addBtn = document.getElementById('detail-add-stock-btn');
    if (addBtn) {
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        newBtn.addEventListener('click', () => navigateTo('stock-search'));
    }

    // Add Stock Button (Empty State)
    const emptyAddBtn = document.getElementById('detail-add-stock-empty-btn');
    if (emptyAddBtn) {
        const newBtn = emptyAddBtn.cloneNode(true);
        emptyAddBtn.parentNode.replaceChild(newBtn, emptyAddBtn);
        newBtn.addEventListener('click', () => navigateTo('stock-search'));
    }

    // Rebalance Action Button
    const rebalanceBtn = document.getElementById('detail-rebalance-action-btn');
    if (rebalanceBtn) {
        const newBtn = rebalanceBtn.cloneNode(true);
        rebalanceBtn.parentNode.replaceChild(newBtn, rebalanceBtn);
        newBtn.addEventListener('click', () => navigateTo('rebalancing-check'));
    }

    // Insight Banner Button
    const insightBtn = document.getElementById('detail-rebalance-btn');
    if (insightBtn) {
        const newBtn = insightBtn.cloneNode(true);
        insightBtn.parentNode.replaceChild(newBtn, insightBtn);
        newBtn.addEventListener('click', () => navigateTo('rebalancing-check'));
    }
}

function toggleEditMode() {
    const screen = document.getElementById('screen-portfolio-detail');
    screen.classList.toggle('edit-mode');
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
            if (stocksSection) stocksSection.style.display = 'none';
            injectStateMessage(screen, '📭', '보유한 종목이 없습니다.', '새 종목을 추가해보세요.');
            break;

        case 'error':
            if (stocksSection) stocksSection.style.display = 'none';
            injectStateMessage(screen, '⚠️', '정보를 불러올 수 없습니다.', '네트워크 연결을 확인해주세요.');
            break;

        case 'edit-mode':
            toggleEditMode(); // Just toggle, don't replace content
            break;

        case 'default':
        default:
            // Restore Content
            if (stocksSection && data) {
                stocksSection.innerHTML = `
                   <div class="section-header">
                        <h3>보유 종목</h3>
                        <span class="stock-count" id="detail-stock-count">${data.stocks.length}종목</span>
                    </div>
                    <div class="rebalance-insight" id="detail-rebalance-insight">
                        <span class="insight-icon">⚠️</span>
                        <div class="insight-content">
                            <span class="insight-title">리밸런싱 필요</span>
                            <span class="insight-detail" id="detail-insight-msg">${data.rebalanceMsg}</span>
                        </div>
                        <button class="insight-action-btn">분석 →</button>
                    </div>
                    <div id="detail-stock-list"></div> 
                `;
                renderStocks(data.stocks); // Re-render logic
            }
            break;
    }
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
