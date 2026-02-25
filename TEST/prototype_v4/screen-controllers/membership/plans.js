// =================================================================
// Stock-Keeper UI Prototype V4 - Membership Plans Controller
// Domain: Membership
// =================================================================

import { goBack } from '../../core/navigation.js';

// --- Mock Data ---
const CURRENT_PLAN_ID = 'free';

const MEMBERSHIP_PLANS = [
    {
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0, // 0*10
        icon: '🆓',
        features: [
            { text: '프리미엄 기능 미포함', included: false },
            { text: '광고 포함', included: false }
        ]
    },
    {
        id: 'basic',
        name: 'Basic',
        priceMonthly: 4900,
        priceYearly: 49000,
        icon: '⭐',
        features: [
            { text: '백테스팅 3회/월', included: true },
            { text: '토큰 10개 포함', included: true },
            { text: '광고 포함', included: false }
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        priceMonthly: 9900,
        priceYearly: 99000,
        icon: '💎',
        badge: 'BEST',
        features: [
            { text: '백테스팅 15회/월', included: true },
            { text: '상세 열람 20건/월', included: true },
            { text: '토큰 30개 + 광고 제거', included: true }
        ]
    },
    {
        id: 'premium',
        name: 'Premium',
        priceMonthly: 19900,
        priceYearly: 199000,
        icon: '👑',
        badge: 'VIP',
        features: [
            { text: '모든 기능 무제한', included: true },
            { text: '포트폴리오 구독 (무제한)', included: true },
            { text: '토큰 50개 + 우선 지원', included: true }
        ]
    }
];

const TOKEN_PACKAGES = [
    { tokens: 10, price: 1900 },
    { tokens: 30, price: 4900 },
    { tokens: 60, price: 8900, badge: '인기' },
    { tokens: 120, price: 14900 }
];

// --- State ---
let currentPeriod = 'monthly'; // 'monthly' | 'yearly'

// --- Lifecycle ---
export function init() {
    console.log('[MembershipPlans] Initializing...');
    
    // Initial Render
    renderPlanCards();
    renderTokenPackages();
    
    // Listeners
    attachListeners();
}

export function cleanup() {
    console.log('[MembershipPlans] Cleaning up...');
    const confirmModal = document.getElementById('plan-confirm-modal');
    if (confirmModal) {
        confirmModal.style.display = 'none';
        confirmModal.classList.remove('active');
    }
}

// --- Render Functions ---
function renderPlanCards() {
    const container = document.getElementById('plan-cards-container');
    if (!container) return;
    
    container.innerHTML = MEMBERSHIP_PLANS.map(plan => {
        const isCurrent = plan.id === CURRENT_PLAN_ID;
        const isPro = plan.id === 'pro';
        const price = currentPeriod === 'monthly' ? plan.priceMonthly : plan.priceYearly;
        const formattedPrice = price === 0 ? '₩0' : `₩${price.toLocaleString()}`;
        const periodText = currentPeriod === 'monthly' ? '/ 월' : '/ 연 (16% 할인)';
        
        let badgeHtml = '';
        if (plan.badge) {
            const badgeClass = plan.id === 'premium' ? 'plan-badge vip' : 'plan-badge';
            badgeHtml = `<div class="${badgeClass}">${plan.badge}</div>`;
        }
        
        const featuresHtml = plan.features.map(f => `
            <li>
                <span class="feature-icon ${f.included ? 'yes' : 'no'}">${f.included ? '✓' : '✗'}</span>
                <span>${f.text}</span>
            </li>
        `).join('');

        let btnClass = 'cta-outline';
        let btnText = '구독하기';
        
        if (isCurrent) {
            btnClass = 'cta-ghost';
            btnText = '현재 플랜';
        } else if (plan.id === 'pro') {
            btnClass = 'cta-gradient';
        } else if (plan.id === 'premium') {
            btnClass = 'cta-gold';
        }

        return `
            <div class="plan-card ${isPro ? 'highlight-pro' : ''}" data-plan-id="${plan.id}">
                ${badgeHtml}
                <div class="plan-header-info">
                    <span class="plan-icon">${plan.icon}</span>
                    <span class="plan-name">${plan.name}</span>
                </div>
                <div class="plan-price-block">
                    <div class="plan-price">${formattedPrice} <span class="plan-period">${periodText}</span></div>
                </div>
                <ul class="plan-features">
                    ${featuresHtml}
                </ul>
                <button class="plan-cta ${btnClass}" data-is-current="${isCurrent}">
                    ${btnText}
                </button>
            </div>
        `;
    }).join('');

    // Attach CTA listeners specifically to dynamically rendered buttons
    container.querySelectorAll('.plan-cta').forEach(btn => {
        btn.onclick = (e) => {
            const isCurrent = e.target.getAttribute('data-is-current') === 'true';
            if (isCurrent) return; // Do nothing for current plan

            const card = e.target.closest('.plan-card');
            const planId = card.getAttribute('data-plan-id');
            const plan = MEMBERSHIP_PLANS.find(p => p.id === planId);
            if(plan) showConfirmModal(`[${plan.name}] 플랜 구독`, `결제 금액: ₩${(currentPeriod === 'monthly' ? plan.priceMonthly : plan.priceYearly).toLocaleString()}`);
        };
    });
}

function renderTokenPackages() {
    const container = document.getElementById('token-packages-container');
    if (!container) return;
    
    container.innerHTML = TOKEN_PACKAGES.map(pkg => {
        let badgeHtml = pkg.badge ? `<div class="token-card-badge">${pkg.badge}</div>` : '';
        return `
            <div class="token-card clickable-token" data-tokens="${pkg.tokens}" data-price="${pkg.price}">
                ${badgeHtml}
                <div class="token-icon">🪙</div>
                <div class="token-amount">${pkg.tokens}개</div>
                <div class="token-price">₩${pkg.price.toLocaleString()}</div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.clickable-token').forEach(card => {
        card.onclick = (e) => {
            const tokens = e.currentTarget.getAttribute('data-tokens');
            const price = e.currentTarget.getAttribute('data-price');
            showConfirmModal(`토큰 ${tokens}개 충전`, `결제 금액: ₩${Number(price).toLocaleString()}`);
        };
    });
}

// --- Actions ---
function handleTogglePeriod(period) {
    if (currentPeriod === period) return;
    
    currentPeriod = period;
    
    // Update button states
    document.querySelectorAll('.billing-toggle-control .toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-period') === currentPeriod);
    });

    // Re-render prices only
    renderPlanCards();
}

function toggleComparison() {
    const content = document.getElementById('comparison-content');
    const btn = document.getElementById('comparison-toggle-btn');
    if (!content || !btn) return;

    if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.querySelector('span').textContent = '▲ 전체 기능 닫기';
    } else {
        content.style.display = 'none';
        btn.querySelector('span').textContent = '▼ 전체 기능 비교';
    }
}

function showConfirmModal(title, priceStr) {
    const modal = document.getElementById('plan-confirm-modal');
    if (!modal) return;
    
    document.getElementById('modal-plan-title').textContent = title;
    document.getElementById('modal-plan-price').textContent = priceStr;
    
    modal.style.display = 'flex';
    // tiny delay for transition
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeConfirmModal() {
    const modal = document.getElementById('plan-confirm-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300); // match transition duration
}

// --- Listeners ---
function attachListeners() {
    // Back navigation
    const backBtn = document.getElementById('plans-back-btn');
    if (backBtn) backBtn.onclick = () => goBack();

    // Billing toggle
    document.querySelectorAll('.billing-toggle-control .toggle-btn').forEach(btn => {
        btn.onclick = (e) => handleTogglePeriod(e.target.getAttribute('data-period'));
    });

    // Comparison accordion toggle
    const compToggleBtn = document.getElementById('comparison-toggle-btn');
    if (compToggleBtn) compToggleBtn.onclick = toggleComparison;

    // Modal close handlers
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    if (cancelBtn) cancelBtn.onclick = closeConfirmModal;
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            console.log('[MembershipPlans] Purchase confirmed!');
            // To-Do: Mock loading and success toast
            closeConfirmModal();
        };
    }

    // Modal background click to close
    const modalOverlay = document.getElementById('plan-confirm-modal');
    if (modalOverlay) {
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) closeConfirmModal();
        };
    }
}
