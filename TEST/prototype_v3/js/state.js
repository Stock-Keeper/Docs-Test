// =================================================================
// Stock-Keeper UI Prototype V3 - State Management
// Empty, Loading, Error state toggles for demo
// =================================================================

let emptyStates = { home: false, detail: false, search: false };
let loadingState = false;
let errorState = false;

// Onboarding slide state
let currentSlide = 0;
const totalSlides = 4;

// =================================================================
// ONBOARDING SLIDE NAVIGATION
// =================================================================

/**
 * Go to a specific slide
 * @param {number} index - Slide index (0-based)
 */
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    currentSlide = index;

    // Update slides
    document.querySelectorAll('.onboarding-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    // Update indicators
    document.querySelectorAll('.indicator').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Update navigation buttons
    const prevBtn = document.querySelector('.nav-prev');
    const skipBtn = document.querySelector('.nav-skip');

    if (prevBtn) {
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    }

    if (skipBtn) {
        // On last slide, change skip to start button
        if (index === totalSlides - 1) {
            skipBtn.textContent = '시작하기';
            skipBtn.classList.add('nav-start');
            skipBtn.classList.remove('nav-skip');
        } else {
            skipBtn.textContent = '건너뛰기 →';
            skipBtn.classList.remove('nav-start');
            skipBtn.classList.add('nav-skip');
        }
    }
}

/**
 * Go to previous slide
 */
function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

/**
 * Go to next slide
 */
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    } else {
        // Last slide, complete onboarding
        completeOnboarding();
    }
}

// Initialize indicator click handlers
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.indicator').forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide, 10);
            goToSlide(slideIndex);
        });
    });
});


/**
 * Helper to manage button state by title
 * @param {string} title - Button data-title attribute
 * @param {boolean} isActive - Active state
 */
function setButtonState(title, isActive) {
    const btn = document.querySelector(`.state-btn[data-title="${title}"]`);
    if (btn) {
        btn.classList.toggle('active', isActive);
    }
}

/**
 * Toggle empty state for a screen
 * @param {string} screen - Screen name (home, detail, search)
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleEmptyState(screen, btnElement) {
    emptyStates[screen] = !emptyStates[screen];
    const isOn = emptyStates[screen];

    // Toggle active class on button
    if (btnElement) {
        btnElement.classList.toggle('active', isOn);
    }

    if (screen === 'home') {
        const content = document.querySelector('#screen-home .portfolio-section');
        const summary = document.querySelector('#screen-home .home-summary');
        const emptyEl = document.getElementById('home-empty-state');
        const fab = document.querySelector('#screen-home .fab');

        if (content) content.style.display = isOn ? 'none' : '';
        if (summary) summary.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
        if (fab) fab.style.display = isOn ? 'none' : '';

        if (isOn) {
            loadingState = false;
            errorState = false;
            setButtonState('로딩 상태', false);
            setButtonState('에러 상태', false);

            document.getElementById('home-loading-state').style.display = 'none';
            document.getElementById('home-error-state').style.display = 'none';
        }
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

/**
 * Toggle loading state (home screen only)
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleLoadingState(btnElement) {
    loadingState = !loadingState;
    const isOn = loadingState;

    // Toggle active class on button
    if (btnElement) {
        btnElement.classList.toggle('active', isOn);
    }

    const homeContent = document.querySelector('#screen-home .portfolio-section');
    const homeSummary = document.querySelector('#screen-home .home-summary');
    const homeLoading = document.getElementById('home-loading-state');
    const fab = document.querySelector('#screen-home .fab');

    if (homeContent) homeContent.style.display = isOn ? 'none' : '';
    if (homeSummary) homeSummary.style.display = isOn ? 'none' : '';
    if (homeLoading) homeLoading.style.display = isOn ? 'block' : 'none';
    if (fab) fab.style.display = isOn ? 'none' : '';

    if (isOn) {
        emptyStates.home = false;
        errorState = false;
        setButtonState('홈 Empty State', false);
        setButtonState('에러 상태', false);

        const emptyEl = document.getElementById('home-empty-state');
        const errorEl = document.getElementById('home-error-state');
        if (emptyEl) emptyEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
    }

    showToast(`Loading: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Toggle error state (home screen only)
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleErrorState(btnElement) {
    errorState = !errorState;
    const isOn = errorState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const homeContent = document.querySelector('#screen-home .portfolio-section');
    const homeSummary = document.querySelector('#screen-home .home-summary');
    const homeError = document.getElementById('home-error-state');
    const fab = document.querySelector('#screen-home .fab');

    if (homeContent) homeContent.style.display = isOn ? 'none' : '';
    if (homeSummary) homeSummary.style.display = isOn ? 'none' : '';
    if (homeError) homeError.style.display = isOn ? 'flex' : 'none';
    if (fab) fab.style.display = isOn ? 'none' : '';

    if (isOn) {
        emptyStates.home = false;
        loadingState = false;

        // Sync visuals
        setButtonState('홈 Empty State', false);
        setButtonState('로딩 상태', false);

        const emptyEl = document.getElementById('home-empty-state');
        const loadingEl = document.getElementById('home-loading-state');
        if (emptyEl) emptyEl.style.display = 'none';
        if (loadingEl) loadingEl.style.display = 'none';
    }

    showToast(`Error: ${isOn ? 'ON' : 'OFF'}`);
}

// =================================================================
// LOGIN SCREEN STATES
// =================================================================

let loginLoadingState = false;
let loginErrorState = false;

/**
 * Toggle login loading overlay
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleLoginLoading(btnElement) {
    loginLoadingState = !loginLoadingState;
    const isOn = loginLoadingState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const overlay = document.getElementById('login-loading-overlay');
    if (overlay) overlay.style.display = isOn ? 'flex' : 'none';

    // Turn off error if loading is on
    if (isOn && loginErrorState) {
        loginErrorState = false;
        setButtonState('로그인 에러', false);
        const errorToast = document.getElementById('login-error-toast');
        if (errorToast) errorToast.style.display = 'none';
    }

    showToast(`로그인 로딩: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Toggle login error toast
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleLoginError(btnElement) {
    loginErrorState = !loginErrorState;
    const isOn = loginErrorState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const errorToast = document.getElementById('login-error-toast');
    if (errorToast) errorToast.style.display = isOn ? 'flex' : 'none';

    // Turn off loading if error is on
    if (isOn && loginLoadingState) {
        loginLoadingState = false;
        setButtonState('로그인 로딩', false);
        const overlay = document.getElementById('login-loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    showToast(`로그인 에러: ${isOn ? 'ON' : 'OFF'}`);
}

// =================================================================
// PROFILE SCREEN STATES
// =================================================================

let profileLoadingState = false;

/**
 * Toggle profile loading overlay
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleProfileLoading(btnElement) {
    profileLoadingState = !profileLoadingState;
    const isOn = profileLoadingState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const overlay = document.getElementById('profile-loading-overlay');
    if (overlay) overlay.style.display = isOn ? 'flex' : 'none';

    showToast(`프로필 로딩: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Validate nickname input (1-20 characters)
 * @param {HTMLInputElement} inputElement - The nickname input element
 */
function validateNickname(inputElement) {
    const value = inputElement.value.trim();
    const hint = document.getElementById('nickname-hint');
    const error = document.getElementById('nickname-error');

    if (value.length < 1 || value.length > 20) {
        // Invalid
        if (hint) hint.style.display = 'none';
        if (error) error.style.display = 'block';
        inputElement.style.borderColor = 'var(--error)';
    } else {
        // Valid
        if (hint) hint.style.display = 'block';
        if (error) error.style.display = 'none';
        inputElement.style.borderColor = '';
    }
}


// =================================================================
// DETAIL SCREEN INTERACTIONS
// =================================================================

/**
 * Toggle portfolio notification setting
 */
/**
 * Toggle Detail Menu Dropdown
 */
function toggleDetailMenu() {
    const dropdown = document.getElementById('detail-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');

        // Close when clicking outside
        if (dropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', closeDetailMenuOutside);
            }, 0);
        }
    }
}

function closeDetailMenuOutside(e) {
    const dropdown = document.getElementById('detail-menu-dropdown');
    const btn = document.querySelector('.menu-btn');

    if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeDetailMenuOutside);
    }
}

/**
 * Toggle Edit Mode
 */
function toggleEditMode() {
    const screen = document.getElementById('screen-detail');
    const textSpan = document.getElementById('edit-mode-text');
    const menuBtn = document.querySelector('.menu-btn');
    const doneBtn = document.getElementById('edit-done-btn');

    if (screen) {
        screen.classList.toggle('edit-mode');
        const isEditMode = screen.classList.contains('edit-mode');

        if (textSpan) {
            textSpan.textContent = isEditMode ? '편집 완료' : '편집';
        }

        // Switch between hamburger and done button
        if (menuBtn && doneBtn) {
            if (isEditMode) {
                menuBtn.style.display = 'none';
                doneBtn.style.display = 'block';
            } else {
                menuBtn.style.display = 'block';
                doneBtn.style.display = 'none';
            }
        }

        // Close menu after selection (if entering edit mode from menu)
        const dropdown = document.getElementById('detail-menu-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDetailMenuOutside);
        }

        showToast(`편집 모드: ${isEditMode ? 'ON' : 'OFF'}`);
    }
}

/**
 * Notification Modal Logic
 */
function openNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.style.display = 'flex';

        // Close menu
        const dropdown = document.getElementById('detail-menu-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDetailMenuOutside);
        }
    }
}

function closeNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active'); // Just in case
    }
}

function saveNotificationSettings() {
    const toggle = document.getElementById('notification-toggle');
    const isOn = toggle ? toggle.checked : false;

    showToast(`알림 설정이 저장되었습니다. (전체 알림: ${isOn ? 'ON' : 'OFF'})`);
    closeNotificationModal();
}

/**
 * Toggle Notification Switch Label (Optional)
 */
function toggleNotificationToggle(checkbox) {
    // Logic if needed when toggling inside modal immediately
}

/**
 * Simulate stock deletion
 * @param {Event} event - Click event
 * @param {string} stockName - Name of the stock to delete
 */
function deleteStock(event, stockName) {
    if (event) {
        event.stopPropagation(); // Prevent card click event
    }

    // In a real app, this would show a confirmation modal or delete API call
    // For prototype, we just remove the element visually or show toast
    const card = event.target.closest('.stock-card');
    if (card) {
        card.style.opacity = '0.5';
        setTimeout(() => {
            // card.remove(); // Optional: actually remove it
            card.style.opacity = '1'; // Restore for demo
        }, 1000);
    }
    showToast(`${stockName} 종목이 삭제되었습니다.`);
}

// =================================================================
// SEARCH SCREEN LOGIC
// =================================================================

// Mock Stock Data (for prototype)
const mockStockData = [
    { code: '005930', name: '삼성전자', price: 74500, change: 1.2, market: 'KOSPI' },
    { code: '000660', name: 'SK하이닉스', price: 132000, change: -0.5, market: 'KOSPI' },
    { code: '035420', name: 'NAVER', price: 215000, change: 2.1, market: 'KOSPI' },
    { code: '035720', name: '카카오', price: 52300, change: -1.8, market: 'KOSPI' },
    { code: '005380', name: '현대자동차', price: 186500, change: 1.24, market: 'KOSPI' },
    { code: '012330', name: '현대모비스', price: 252000, change: -0.79, market: 'KOSPI' },
    { code: '000720', name: '현대건설', price: 31450, change: 2.11, market: 'KOSPI' },
    { code: '373220', name: 'LG에너지솔루션', price: 385000, change: 0.8, market: 'KOSPI' },
    { code: '207940', name: '삼성바이오로직스', price: 780000, change: -0.2, market: 'KOSPI' },
    { code: '051910', name: 'LG화학', price: 420000, change: 1.5, market: 'KOSPI' }
];

// Simulated owned stocks (for duplicate check)
const ownedStockCodes = ['005930', '000660', '035420']; // Samsung, SK Hynix, Naver

// Current total ratio in portfolio
let currentPortfolioRatio = 95;
let selectedStock = null;

/**
 * Handle stock search input
 * @param {string} query - Search query
 */
function handleStockSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    const emptyState = document.getElementById('search-empty-state');
    const initialState = document.getElementById('search-initial-state');
    const clearBtn = document.querySelector('.clear-search-btn');

    // Show/hide clear button
    if (clearBtn) clearBtn.style.display = query.length > 0 ? 'block' : 'none';

    // If empty query, show initial state
    if (!query || query.trim().length === 0) {
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'none';
        if (initialState) initialState.style.display = 'flex';
        return;
    }

    // Hide initial state
    if (initialState) initialState.style.display = 'none';

    // Filter mock data
    const normalizedQuery = query.toLowerCase().trim();
    const results = mockStockData.filter(stock =>
        stock.name.toLowerCase().includes(normalizedQuery) ||
        stock.code.includes(normalizedQuery)
    );

    // Render results
    if (results.length === 0) {
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        renderSearchResults(results);
    }
}

/**
 * Render search results - opens bottom sheet modal instead of ratio modal
 * @param {Array} results - Filtered stock data
 */
function renderSearchResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;

    container.innerHTML = results.map(stock => {
        const isOwned = ownedStockCodes.includes(stock.code);
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeSign = stock.change >= 0 ? '+' : '';

        return `
            <div class="result-item ${isOwned ? 'owned' : ''}" 
                 onclick="${isOwned ? 'showToast(\'이미 보유중인 종목입니다.\')' : `openStockModal('${stock.code}')`}">
                <div class="result-info">
                    <span class="result-name">${stock.name}${isOwned ? '<span class="owned-badge">보유중</span>' : ''}</span>
                    <span class="result-code">${stock.code}</span>
                </div>
                <div class="result-price">
                    <span class="price">₩${stock.price.toLocaleString()}</span>
                    <span class="change ${changeClass}">${changeSign}${stock.change}%</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Clear search input
 */
function clearSearch() {
    const input = document.getElementById('search-input');
    if (input) {
        input.value = '';
        handleStockSearch('');
        input.focus();
    }
}

// Base ratio for existing portfolio
let basePortfolioRatio = 90;

/**
 * Open stock add bottom sheet modal
 * @param {string} code - Stock code
 */
function openStockModal(code) {
    const stock = mockStockData.find(s => s.code === code);
    if (!stock) return;

    selectedStock = stock;

    const modal = document.getElementById('stock-add-modal');
    const nameEl = document.getElementById('modal-stock-name');
    const priceEl = document.getElementById('modal-stock-price');
    const changeEl = document.getElementById('modal-stock-change');
    const codeEl = document.getElementById('modal-stock-code');
    const quantityEl = document.getElementById('stock-quantity');
    const ratioSlider = document.getElementById('ratio-slider');

    if (nameEl) nameEl.textContent = stock.name;
    if (priceEl) priceEl.textContent = `₩${stock.price.toLocaleString()}`;
    if (changeEl) {
        changeEl.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change}%`;
        changeEl.className = `price-change ${stock.change >= 0 ? 'positive' : 'negative'}`;
    }
    if (codeEl) codeEl.textContent = stock.code;
    if (quantityEl) quantityEl.value = 10;
    if (ratioSlider) ratioSlider.value = 10;

    updateEstimatedAmount();
    updateRatioDisplay();

    if (modal) modal.style.display = 'flex';
}

/**
 * Close stock modal
 * @param {Event} event - Optional click event
 */
function closeStockModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('stock-add-modal');
    if (modal) modal.style.display = 'none';
    selectedStock = null;
}

/**
 * Adjust stock quantity
 * @param {number} delta - Amount to add/subtract
 */
function adjustQuantity(delta) {
    const input = document.getElementById('stock-quantity');
    if (!input) return;

    let val = parseInt(input.value, 10) || 0;
    val = Math.max(1, val + delta);
    input.value = val;
    updateEstimatedAmount();
}

/**
 * Update estimated amount based on quantity
 */
function updateEstimatedAmount() {
    if (!selectedStock) return;

    const quantityEl = document.getElementById('stock-quantity');
    const estimatedEl = document.getElementById('estimated-amount');

    const quantity = parseInt(quantityEl?.value, 10) || 0;
    const amount = selectedStock.price * quantity;

    if (estimatedEl) {
        estimatedEl.textContent = `예상 금액: ₩${amount.toLocaleString()}`;
    }
}

/**
 * Update ratio display and sum info with exceeded state warning
 */
function updateRatioDisplay() {
    const slider = document.getElementById('ratio-slider');
    const displayEl = document.getElementById('ratio-display');
    const currentAddEl = document.getElementById('current-add-ratio');
    const totalEl = document.getElementById('total-ratio');
    const sumInfoEl = document.getElementById('ratio-sum-info');
    const confirmBtn = document.getElementById('confirm-add-btn');
    const warningIcon = document.getElementById('ratio-warning-icon');
    const warningMessage = document.getElementById('ratio-warning-message');

    const ratioValue = parseInt(slider?.value, 10) || 0;
    const totalRatio = basePortfolioRatio + ratioValue;
    const isExceeded = totalRatio > 100;

    // Update display values
    if (displayEl) displayEl.textContent = `${ratioValue}%`;
    if (currentAddEl) currentAddEl.textContent = `${ratioValue}%`;
    if (totalEl) totalEl.textContent = `${totalRatio}%`;

    // Toggle warning classes based on exceeded state
    if (sumInfoEl) sumInfoEl.classList.toggle('warning', isExceeded);
    if (slider) slider.classList.toggle('warning', isExceeded);
    if (displayEl) displayEl.classList.toggle('warning', isExceeded);
    if (warningIcon) warningIcon.classList.toggle('show', isExceeded);
    if (warningMessage) warningMessage.classList.toggle('show', isExceeded);
    if (confirmBtn) {
        confirmBtn.classList.toggle('warning', isExceeded);
        confirmBtn.disabled = ratioValue < 1;
    }
}

/**
 * Confirm adding stock to portfolio
 */
function confirmAddStock() {
    if (!selectedStock) return;

    const quantityEl = document.getElementById('stock-quantity');
    const ratioSlider = document.getElementById('ratio-slider');

    const quantity = parseInt(quantityEl?.value, 10) || 0;
    const ratio = parseInt(ratioSlider?.value, 10) || 0;

    if (quantity < 1 || ratio < 1) {
        showToast('수량과 비중을 입력해주세요.');
        return;
    }

    // Add to owned stocks
    ownedStockCodes.push(selectedStock.code);
    basePortfolioRatio += ratio;

    // Update header ratio sum
    const sumEl = document.getElementById('current-ratio-sum');
    if (sumEl) {
        sumEl.textContent = `${basePortfolioRatio}%`;
        if (basePortfolioRatio > 100) {
            sumEl.classList.add('error');
        }
    }

    showToast(`${selectedStock.name} ${quantity}주 (${ratio}%) 추가 완료!`);
    closeStockModal();

    // Re-render search results
    const inputSearch = document.getElementById('search-input');
    if (inputSearch && inputSearch.value) {
        handleStockSearch(inputSearch.value);
    }
}

// =================================================================
// REBALANCING SCREEN LOGIC
// =================================================================

/**
 * Copy rebalancing result to clipboard
 */
function copyRebalanceResult() {
    // Build text summary from the current suggestions
    const resultText = `📊 리밸런싱 분석 결과

[매도]
• 삼성전자: -8주 (₩596,000)

[매수]
• 카카오: +20주 (₩974,000)
• LG에너지솔루션: +2주 (₩648,500)

💰 순 필요 자금: ₩1,026,500

※ 임계값 ±5% 기준`;

    // Copy to clipboard using modern API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(resultText).then(() => {
            showToast('결과가 클립보드에 복사되었습니다!');
        }).catch(err => {
            console.error('Copy failed:', err);
            fallbackCopy(resultText);
        });
    } else {
        fallbackCopy(resultText);
    }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('결과가 클립보드에 복사되었습니다!');
    } catch (err) {
        showToast('복사에 실패했습니다. 직접 복사해주세요.');
    }
    document.body.removeChild(textarea);
}

// =================================================================
// SETTINGS SCREEN LOGIC
// =================================================================

/**
 * Open profile edit modal
 */
function openProfileEdit() {
    const modal = document.getElementById('profile-edit-modal');
    const input = document.getElementById('edit-nickname');
    const displayName = document.getElementById('display-nickname');

    if (input && displayName) {
        input.value = displayName.textContent;
    }
    if (modal) modal.style.display = 'flex';
}

/**
 * Close profile edit modal
 * @param {Event} event - Optional click event
 */
function closeProfileEdit(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('profile-edit-modal');
    if (modal) modal.style.display = 'none';
}

/**
 * Save profile changes
 */
function saveProfile() {
    const input = document.getElementById('edit-nickname');
    const displayName = document.getElementById('display-nickname');
    const avatar = document.querySelector('.settings-avatar');

    if (input && displayName) {
        const newName = input.value.trim();
        if (newName.length >= 1 && newName.length <= 20) {
            displayName.textContent = newName;
            if (avatar) avatar.textContent = newName.charAt(0);
            showToast('프로필이 저장되었습니다.');
            closeProfileEdit();
        } else {
            showToast('닉네임은 1~20자 이내로 입력해주세요.');
        }
    }
}

/**
 * Open logout confirmation modal
 */
function openLogoutConfirm() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) modal.style.display = 'flex';
}

/**
 * Close logout confirmation modal
 * @param {Event} event - Optional click event
 */
function closeLogoutConfirm(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) modal.style.display = 'none';
}

/**
 * Perform logout action
 */
function performLogout() {
    closeLogoutConfirm();
    showToast('로그아웃 되었습니다.');
    // Navigate to login screen
    setTimeout(() => {
        navigateTo('screen-login');
    }, 500);
}

/**
 * Open delete account confirmation modal
 */
function openDeleteConfirm() {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.style.display = 'flex';
}

/**
 * Close delete confirmation modal
 * @param {Event} event - Optional click event
 */
function closeDeleteConfirm(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.style.display = 'none';
}

/**
 * Perform delete account action
 */
function performDeleteAccount() {
    closeDeleteConfirm();
    showToast('계정이 삭제되었습니다. 이용해주셔서 감사합니다.');
    // Navigate to login screen
    setTimeout(() => {
        navigateTo('screen-login');
    }, 1000);
}

// =================================================================
// PROFILE EDIT PAGE LOGIC
// =================================================================

/**
 * Update profile preview (avatar and character count)
 */
function updateProfilePreview() {
    const input = document.getElementById('profile-nickname');
    const avatar = document.getElementById('edit-avatar');
    const countEl = document.getElementById('nickname-count');
    const saveBtn = document.getElementById('save-profile-btn');

    if (!input) return;

    const value = input.value.trim();
    const length = value.length;

    // Update avatar
    if (avatar) {
        avatar.textContent = value.charAt(0) || '?';
    }

    // Update character count
    if (countEl) {
        countEl.textContent = `${length}/20`;
    }

    // Validate and enable/disable save button
    if (saveBtn) {
        saveBtn.disabled = length < 1 || length > 20;
    }

    // Update input validation state
    if (length < 1 || length > 20) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

/**
 * Save profile edit
 */
function saveProfileEdit() {
    const input = document.getElementById('profile-nickname');
    const settingsName = document.getElementById('display-nickname');
    const settingsAvatar = document.querySelector('.settings-avatar');

    if (!input) return;

    const newName = input.value.trim();

    if (newName.length < 1 || newName.length > 20) {
        showToast('닉네임은 1~20자 이내로 입력해주세요.');
        return;
    }

    // Update settings screen display
    if (settingsName) settingsName.textContent = newName;
    if (settingsAvatar) settingsAvatar.textContent = newName.charAt(0);

    showToast('프로필이 저장되었습니다.');
    navigateTo('screen-settings');
}

// =================================================================
// STOCK DETAIL PAGE LOGIC
// =================================================================

/**
 * Navigate to stock detail page
 * @param {string} code - Stock code
 * @param {string} name - Stock name
 */
function openStockDetail(code, name) {
    // Update stock detail page with mock data
    const nameEl = document.getElementById('stock-detail-name');
    const codeEl = document.getElementById('stock-detail-code');

    if (nameEl) nameEl.textContent = name || '삼성전자';
    if (codeEl) codeEl.textContent = code || '005930';

    navigateTo('screen-stock-detail');
}

/**
 * Open stock edit modal (bottom sheet)
 */
function openStockEditModal() {
    const modal = document.getElementById('stock-edit-modal');
    const nameEl = document.getElementById('stock-detail-name');
    const codeEl = document.getElementById('stock-detail-code');
    const quantityEl = document.getElementById('detail-quantity');

    // Sync modal with current stock info
    const editName = document.getElementById('edit-stock-name');
    const editCode = document.getElementById('edit-stock-code');
    const editQty = document.getElementById('edit-quantity-input');

    if (editName && nameEl) editName.textContent = nameEl.textContent;
    if (editCode && codeEl) editCode.textContent = codeEl.textContent;
    if (editQty && quantityEl) {
        const qty = parseInt(quantityEl.textContent) || 150;
        editQty.value = qty;
    }

    if (modal) modal.style.display = 'flex';
}

/**
 * Close stock edit modal
 * @param {Event} event - Click event (optional)
 */
function closeStockEditModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('stock-edit-modal');
    if (modal) modal.style.display = 'none';
}

/**
 * Adjust quantity in edit modal
 * @param {number} delta - Amount to add/subtract
 */
function adjustEditQuantity(delta) {
    const input = document.getElementById('edit-quantity-input');
    if (!input) return;

    let value = parseInt(input.value) || 0;
    value = Math.max(1, value + delta);
    input.value = value;
}

/**
 * Update ratio display in edit modal with sum calculation
 */
function updateEditRatioDisplay() {
    const slider = document.getElementById('edit-ratio-slider');
    const valueEl = document.getElementById('edit-ratio-value');
    const currentRatioEl = document.getElementById('edit-current-ratio');
    const totalRatioEl = document.getElementById('edit-total-ratio');
    const sumInfoEl = document.getElementById('edit-ratio-sum-info');
    const warningIcon = document.getElementById('edit-ratio-warning-icon');
    const warningMessage = document.getElementById('edit-ratio-warning-message');
    const confirmBtn = document.querySelector('#stock-edit-modal .confirm-btn');

    if (!slider) return;

    const currentRatio = parseInt(slider.value);
    const baseRatio = 70; // Mock: 기존 종목 비중 (실제로는 동적 계산 필요)
    const total = baseRatio + currentRatio;
    const isExceeded = total > 100;

    if (valueEl) valueEl.textContent = currentRatio + '%';
    if (currentRatioEl) currentRatioEl.textContent = currentRatio + '%';
    if (totalRatioEl) totalRatioEl.textContent = total + '%';

    // Toggle warning classes on all elements (Same as search page)
    if (sumInfoEl) sumInfoEl.classList.toggle('exceeded', isExceeded);
    if (warningIcon) warningIcon.classList.toggle('show', isExceeded);
    if (warningMessage) warningMessage.classList.toggle('show', isExceeded);
    if (slider) slider.classList.toggle('warning', isExceeded);
    if (valueEl) valueEl.classList.toggle('warning', isExceeded);
    if (confirmBtn) confirmBtn.classList.toggle('warning', isExceeded);
}

/**
 * Save stock edit changes
 */
function saveStockEdit() {
    const quantityEl = document.getElementById('edit-quantity-input');
    const ratioEl = document.getElementById('edit-ratio-slider');
    const displayQty = document.getElementById('detail-quantity');

    const quantity = parseInt(quantityEl?.value) || 0;
    const ratio = parseInt(ratioEl?.value) || 0;

    if (quantity < 1) {
        showToast('보유 수량은 1주 이상이어야 합니다.');
        return;
    }

    // Update display
    if (displayQty) displayQty.textContent = `${quantity}주`;

    closeStockEditModal();
    showToast('종목 정보가 저장되었습니다.');
}

/**
 * Confirm delete stock
 */
function confirmDeleteStock() {
    if (confirm('이 종목을 삭제하시겠습니까?')) {
        showToast('종목이 삭제되었습니다.');
        navigateTo('screen-detail');
    }
}

/**
 * Show stock detail page (called from portfolio detail)
 * @param {string} stockName - Stock name
 */
function showStockDetail(stockName) {
    // Mock stock data based on name
    const stockData = {
        '삼성전자': { code: '005930', price: 74500, change: '+1.6%', quantity: 150 },
        'SK하이닉스': { code: '000660', price: 162500, change: '+2.1%', quantity: 50 },
        'NAVER': { code: '035420', price: 324500, change: '+0.8%', quantity: 20 },
        '카카오': { code: '035720', price: 48700, change: '-1.2%', quantity: 80 },
        'LG에너지솔루션': { code: '373220', price: 324250, change: '+3.5%', quantity: 8 }
    };

    const stock = stockData[stockName] || { code: '000000', price: 0, change: '0%', quantity: 0 };

    // Update stock detail page elements
    const nameEl = document.getElementById('stock-detail-name');
    const codeEl = document.getElementById('stock-detail-code');
    const priceEl = document.getElementById('detail-current-price');
    const changeEl = document.getElementById('detail-price-change');
    const quantityEl = document.getElementById('detail-quantity');

    if (nameEl) nameEl.textContent = stockName;
    if (codeEl) codeEl.textContent = stock.code;
    if (priceEl) priceEl.textContent = `₩${stock.price.toLocaleString()}`;
    if (changeEl) {
        changeEl.textContent = stock.change;
        changeEl.className = 'price-change ' + (stock.change.startsWith('+') ? 'positive' : 'negative');
    }
    if (quantityEl) quantityEl.textContent = `${stock.quantity}주`;

    navigateTo('screen-stock-detail');
}

