// =================================================================
// Stock-Keeper UI Prototype V4 - Rebalancing Check Controller
// Rebalancing Domain
// =================================================================

import { navigateTo, goBack } from '../../core/navigation.js';

// Dummy Data
const REBALANCE_DATA = {
    totalBuy: 1622500,
    totalSell: 596000,
    netAmount: 1026500, // + means need more money
    suggestions: [
        { type: 'sell', name: '삼성전자', current: 35, target: 30, qty: -8, amount: 596000 },
        { type: 'buy', name: '카카오', current: 12, target: 15, qty: 20, amount: 974000 },
        { type: 'buy', name: 'LG에너지솔루션', current: 8, target: 10, qty: 2, amount: 648500 }
        // ... more items if needed
    ],
    isBalanced: false
};

export function init() {
    console.log('[RebalancingCheck] Initializing...');
    render(REBALANCE_DATA);
    attachListeners();
}

function render(data) {
    if (data.isBalanced) {
        document.getElementById('rebalance-suggestions').style.display = 'none';
        document.getElementById('rebalance-ok-state').style.display = 'block';
    } else {
        document.getElementById('rebalance-suggestions').style.display = 'block';
        document.getElementById('rebalance-ok-state').style.display = 'none';

        // Summary
        setText('total-buy-amount', `₩${data.totalBuy.toLocaleString()}`);
        setText('total-sell-amount', `₩${data.totalSell.toLocaleString()}`);
        setText('net-amount', `₩${Math.abs(data.netAmount).toLocaleString()}`);

        // Render Suggestion Cards
        renderSuggestions(data.suggestions);
    }
}

function renderSuggestions(suggestions) {
    const container = document.getElementById('suggestion-list');
    if (!container) return;

    container.innerHTML = suggestions.map(item => `
        <div class="suggestion-card ${item.type}">
            <div class="suggestion-header">
                <span class="suggestion-type">${item.type === 'buy' ? '매수' : '매도'}</span>
                <span class="suggestion-stock">${item.name}</span>
            </div>
            <div class="suggestion-detail">
                <div class="detail-row">
                    <span class="detail-label">현재 비율</span>
                    <span class="detail-value">${item.current}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">목표 비율</span>
                    <span class="detail-value">${item.target}%</span>
                </div>
                <div class="detail-row highlight">
                    <span class="detail-label">권장 수량</span>
                    <span class="detail-value">${item.qty > 0 ? '+' : ''}${item.qty}주</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">예상 금액</span>
                    <span class="detail-value">₩${item.amount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function attachListeners() {
    document.getElementById('rebalance-back-btn')?.addEventListener('click', () => goBack());

    document.getElementById('rebalance-setting-btn')?.addEventListener('click', () => {
        alert('임계값 설정 모달 (추후 구현)');
    });

    document.getElementById('copy-result-btn')?.addEventListener('click', copyResult);

    // 임계값 선택 버튼
    const thresholdBtns = document.querySelectorAll('.threshold-btn');
    thresholdBtns.forEach(btn => {
        btn.addEventListener('click', () => handleThresholdChange(btn));
    });
}

function handleThresholdChange(btn) {
    const value = parseInt(btn.dataset.value);
    console.log(`[RebalancingCheck] 임계값 변경: ${value}%`);

    // 선택 상태 업데이트
    document.querySelectorAll('.threshold-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    // 균형 상태 메시지 업데이트
    const okStateDesc = document.querySelector('#rebalance-ok-state .empty-sub');
    if (okStateDesc) {
        okStateDesc.textContent = `임계값: ±${value}%`;
    }

    // TODO: 실제 앱에서는 여기서 재계산 API 호출
    // recalculateRebalancing(value);
}

function copyResult() {
    // Mock copy
    const btn = document.getElementById('copy-result-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span class="copy-icon">✅</span> 복사 완료!';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 2000);

    console.log('Results copied to clipboard');
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
