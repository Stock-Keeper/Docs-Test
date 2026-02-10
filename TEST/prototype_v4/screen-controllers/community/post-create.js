/**
 * Post Create Screen Controller
 */
import { goBack as navGoBack, navigateTo } from '../../core/navigation.js';

// State
let selectedCategory = '전체';
let stockTags = [];
let hasUnsavedChanges = false;
let selectedPortfolio = null;

// Mock stock data for autocomplete
const MOCK_STOCKS = [
    { code: '005930', name: '삼성전자' },
    { code: '000660', name: 'SK하이닉스' },
    { code: '035420', name: 'NAVER' },
    { code: '035720', name: '카카오' },
    { code: '051910', name: 'LG화학' },
    { code: '006400', name: '삼성SDI' }
];

// Mock portfolio data
const MOCK_PORTFOLIOS = [
    {
        id: 1,
        name: '배당주 중심 포트폴리오',
        totalChange: 3.5,
        stocks: [
            { name: '삼성전자', ticker: '005930', targetRatio: 25 },
            { name: 'SK하이닉스', ticker: '000660', targetRatio: 20 },
            { name: 'NAVER', ticker: '035420', targetRatio: 15 },
            { name: '카카오', ticker: '035720', targetRatio: 10 },
            { name: 'LG에너지솔루션', ticker: '373220', targetRatio: 10 },
            { name: '현대차', ticker: '005380', targetRatio: 10 },
            { name: 'POSCO홀딩스', ticker: '005490', targetRatio: 5 },
            { name: 'KB금융', ticker: '105560', targetRatio: 5 }
        ]
    },
    {
        id: 2,
        name: '성장주 포트폴리오',
        totalChange: -1.2,
        stocks: [
            { name: '에코프로비엠', ticker: '247540', targetRatio: 30 },
            { name: '포스코퓨처엠', ticker: '003670', targetRatio: 25 },
            { name: '엘앤에프', ticker: '066970', targetRatio: 25 },
            { name: '삼성SDI', ticker: '006400', targetRatio: 20 }
        ]
    },
    {
        id: 3,
        name: 'ETF 모아가기',
        totalChange: 0.8,
        stocks: [
            { name: 'KODEX 200', ticker: '069500', targetRatio: 40 },
            { name: 'TIGER 미국S&P500', ticker: '360750', targetRatio: 35 },
            { name: 'KODEX 미국나스닥100', ticker: '379810', targetRatio: 25 }
        ]
    }
];

/**
 * Initialize
 */
export function init() {
    bindEvents();
}

/**
 * Start
 */
export function start() {
    bindEvents();
    validateForm();
}

function bindEvents() {
    const cancelBtn = document.getElementById('post-create-cancel-btn');
    if (cancelBtn) {
        cancelBtn.onclick = handleCancel;
    }

    const submitBtn = document.getElementById('post-create-submit-btn');
    if (submitBtn) {
        submitBtn.onclick = handleSubmit;
    }

    document.querySelectorAll('#screen-community-post-create .category-toggle-btn').forEach(btn => {
        btn.onclick = () => selectCategory(btn.dataset.category);
    });

    const titleInput = document.getElementById('post-title-input');
    const bodyInput = document.getElementById('post-body-input');

    [titleInput, bodyInput].forEach(input => {
        if (input) {
            input.oninput = () => {
                hasUnsavedChanges = true;
                validateForm();
                if (input === bodyInput) {
                    updateCharCount();
                    checkStockTags(bodyInput?.value || '');
                } else {
                    checkStockTags(bodyInput?.value || '');
                }
            };
        }
    });

    const photoBtn = document.getElementById('toolbar-photo-btn');
    if (photoBtn) {
        photoBtn.onclick = handleAddPhoto;
    }

    const stockBtn = document.getElementById('toolbar-stock-btn');
    if (stockBtn) {
        stockBtn.onclick = handleAddStockTag;
    }

    // Portfolio button
    const portfolioBtn = document.getElementById('toolbar-portfolio-btn');
    if (portfolioBtn) {
        portfolioBtn.onclick = handlePortfolioBtn;
    }

    // Portfolio bottom sheet overlay
    const overlay = document.getElementById('portfolio-select-overlay');
    if (overlay) {
        overlay.onclick = (e) => {
            if (e.target === overlay) closePortfolioSheet();
        };
    }

    // Portfolio sheet close button
    const sheetCloseBtn = document.getElementById('portfolio-sheet-close');
    if (sheetCloseBtn) {
        sheetCloseBtn.onclick = closePortfolioSheet;
    }

    const exitCancel = document.getElementById('exit-modal-cancel');
    const exitConfirm = document.getElementById('exit-modal-confirm');

    if (exitCancel) {
        exitCancel.onclick = hideExitModal;
    }
    if (exitConfirm) {
        exitConfirm.onclick = confirmExit;
    }
}

/**
 * Reset
 */
export function reset() {
    selectedCategory = '전체';
    stockTags = [];
    hasUnsavedChanges = false;
    selectedPortfolio = null;

    const titleInput = document.getElementById('post-title-input');
    const bodyInput = document.getElementById('post-body-input');
    if (titleInput) titleInput.value = '';
    if (bodyInput) bodyInput.value = '';

    // Reset category
    document.querySelectorAll('.category-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === '전체');
    });

    // Clear previews
    const imagePreview = document.getElementById('image-preview-area');
    if (imagePreview) {
        imagePreview.innerHTML = '';
        imagePreview.classList.add('hidden');
    }

    const tagsPreview = document.getElementById('stock-tags-preview');
    if (tagsPreview) tagsPreview.innerHTML = '';

    // Clear portfolio preview
    const portfolioPreview = document.getElementById('portfolio-preview-area');
    if (portfolioPreview) {
        portfolioPreview.innerHTML = '';
        portfolioPreview.classList.add('hidden');
    }

    // Reset portfolio button state
    const portfolioBtn = document.getElementById('toolbar-portfolio-btn');
    if (portfolioBtn) portfolioBtn.classList.remove('active');

    hideAutocomplete();
    closePortfolioSheet();
    updateCharCount();
    validateForm();
}

/**
 * Update character count display
 */
function updateCharCount() {
    const bodyInput = document.getElementById('post-body-input');
    const charCurrent = document.getElementById('char-current');
    const charCount = document.getElementById('char-count');
    if (!bodyInput || !charCurrent || !charCount) return;

    const len = bodyInput.value.length;
    charCurrent.textContent = len.toLocaleString();

    charCount.classList.remove('near-limit', 'at-limit');
    if (len >= 3000) {
        charCount.classList.add('at-limit');
    } else if (len >= 2700) {
        charCount.classList.add('near-limit');
    }
}

/**
 * Select category
 */
function selectCategory(category) {
    selectedCategory = category;
    document.querySelectorAll('.category-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    hasUnsavedChanges = true;
}

/**
 * Validate form
 */
function validateForm() {
    const titleInput = document.getElementById('post-title-input');
    const bodyInput = document.getElementById('post-body-input');
    const submitBtn = document.getElementById('post-create-submit-btn');

    const title = titleInput?.value.trim() || '';
    const body = bodyInput?.value.trim() || '';

    const isValid = title.length >= 1 && body.length >= 1;

    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }
}

/**
 * Check for stock tags in text
 */
function checkStockTags(text) {
    const hashIndex = text.lastIndexOf('#');
    if (hashIndex === -1) {
        hideAutocomplete();
        return;
    }

    const afterHash = text.substring(hashIndex + 1);
    if (afterHash.includes(' ') || afterHash.length === 0) {
        hideAutocomplete();
        return;
    }

    // Show autocomplete
    const filtered = MOCK_STOCKS.filter(s =>
        s.name.toLowerCase().includes(afterHash.toLowerCase()) ||
        s.code.includes(afterHash)
    );

    showAutocomplete(filtered);
}

/**
 * Show stock autocomplete
 */
function showAutocomplete(stocks) {
    const container = document.getElementById('stock-autocomplete');
    const list = document.getElementById('autocomplete-list');

    if (!container || !list) return;

    if (stocks.length === 0) {
        container.classList.add('hidden');
        return;
    }

    list.innerHTML = stocks.map(stock => `
        <div class="autocomplete-item" data-code="${stock.code}" data-name="${stock.name}">
            <span class="autocomplete-item-name">${stock.name}</span>
            <span class="autocomplete-item-code">${stock.code}</span>
        </div>
    `).join('');

    list.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => selectStock(item.dataset.name));
    });

    container.classList.remove('hidden');
}

/**
 * Hide autocomplete
 */
function hideAutocomplete() {
    const container = document.getElementById('stock-autocomplete');
    if (container) container.classList.add('hidden');
}

/**
 * Select stock from autocomplete
 */
function selectStock(stockName) {
    const bodyInput = document.getElementById('post-body-input');
    if (!bodyInput) return;

    // Replace #partial with #stockName
    const text = bodyInput.value;
    const hashIndex = text.lastIndexOf('#');
    if (hashIndex !== -1) {
        bodyInput.value = text.substring(0, hashIndex) + '#' + stockName + ' ';
    }

    // Add to tags if not exists
    if (!stockTags.includes(stockName)) {
        stockTags.push(stockName);
        renderStockTags();
    }

    hideAutocomplete();
    bodyInput.focus();
}

/**
 * Render stock tags
 */
function renderStockTags() {
    const container = document.getElementById('stock-tags-preview');
    if (!container) return;

    container.innerHTML = stockTags.map(tag => `
        <div class="stock-tag-chip">
            <span>#${tag}</span>
            <button class="stock-tag-remove" data-tag="${tag}">×</button>
        </div>
    `).join('');

    container.querySelectorAll('.stock-tag-remove').forEach(btn => {
        btn.addEventListener('click', () => removeStockTag(btn.dataset.tag));
    });
}

/**
 * Remove stock tag
 */
function removeStockTag(tag) {
    stockTags = stockTags.filter(t => t !== tag);
    renderStockTags();
}

/**
 * Handle add photo
 */
function handleAddPhoto() {
    // Mock: add placeholder image
    const imagePreview = document.getElementById('image-preview-area');
    if (!imagePreview) return;

    imagePreview.classList.remove('hidden');
    const item = document.createElement('div');
    item.className = 'image-preview-item';
    item.innerHTML = `
        <div style="width:100%;height:100%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;">📷</div>
        <button class="image-remove-btn">×</button>
    `;

    item.querySelector('.image-remove-btn').addEventListener('click', () => {
        item.remove();
        if (imagePreview.children.length === 0) {
            imagePreview.classList.add('hidden');
        }
    });

    imagePreview.appendChild(item);
    hasUnsavedChanges = true;
}

/**
 * Handle add stock tag
 */
function handleAddStockTag() {
    const bodyInput = document.getElementById('post-body-input');
    if (bodyInput) {
        bodyInput.value += '#';
        bodyInput.focus();
        checkStockTags(bodyInput.value);
    }
}

// ===== Portfolio Functions =====

/**
 * Handle portfolio toolbar button click
 */
function handlePortfolioBtn() {
    if (selectedPortfolio) {
        // 이미 선택된 포트폴리오가 있으면 -> 바텀시트를 열어 교체 가능
        openPortfolioSheet();
    } else {
        openPortfolioSheet();
    }
}

/**
 * Open portfolio selection bottom sheet
 */
function openPortfolioSheet() {
    const overlay = document.getElementById('portfolio-select-overlay');
    if (!overlay) return;

    renderPortfolioList();
    overlay.classList.remove('hidden');
}

/**
 * Close portfolio selection bottom sheet
 */
function closePortfolioSheet() {
    const overlay = document.getElementById('portfolio-select-overlay');
    if (overlay) overlay.classList.add('hidden');
}

/**
 * Render portfolio list in bottom sheet
 */
function renderPortfolioList() {
    const list = document.getElementById('portfolio-select-list');
    if (!list) return;

    list.innerHTML = MOCK_PORTFOLIOS.map(portfolio => {
        const changeClass = portfolio.totalChange >= 0 ? 'change-positive' : 'change-negative';
        const changeSign = portfolio.totalChange >= 0 ? '+' : '';

        return `
            <div class="portfolio-select-item" data-id="${portfolio.id}">
                <span class="portfolio-select-icon">📊</span>
                <div class="portfolio-select-info">
                    <div class="portfolio-select-name">${portfolio.name}</div>
                    <div class="portfolio-select-meta">
                        종목 ${portfolio.stocks.length}개 · <span class="${changeClass}">${changeSign}${portfolio.totalChange}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    list.querySelectorAll('.portfolio-select-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            selectPortfolio(id);
        });
    });
}

/**
 * Select a portfolio
 */
function selectPortfolio(id) {
    const portfolio = MOCK_PORTFOLIOS.find(p => p.id === id);
    if (!portfolio) return;

    selectedPortfolio = portfolio;
    hasUnsavedChanges = true;

    renderPortfolioPreview();
    closePortfolioSheet();

    // Activate toolbar button
    const portfolioBtn = document.getElementById('toolbar-portfolio-btn');
    if (portfolioBtn) portfolioBtn.classList.add('active');

    console.log('[PostCreate] 포트폴리오 선택:', portfolio.name);
}

/**
 * Render portfolio preview card in editor
 */
function renderPortfolioPreview() {
    const container = document.getElementById('portfolio-preview-area');
    if (!container || !selectedPortfolio) return;

    const p = selectedPortfolio;
    const changeClass = p.totalChange >= 0 ? 'change-positive' : 'change-negative';
    const changeSign = p.totalChange >= 0 ? '+' : '';

    // 상위 3개 종목만 표시
    const MAX_PREVIEW_STOCKS = 3;
    const previewStocks = p.stocks.slice(0, MAX_PREVIEW_STOCKS);
    const remainingCount = p.stocks.length - MAX_PREVIEW_STOCKS;

    const stockChips = previewStocks.map(s =>
        `<span class="portfolio-preview-stock-chip">${s.name} ${s.targetRatio}%</span>`
    ).join('');

    const moreChip = remainingCount > 0
        ? `<span class="portfolio-preview-more">+${remainingCount}개 더</span>`
        : '';

    container.innerHTML = `
        <div class="portfolio-preview-card">
            <div class="portfolio-preview-header">
                <span class="portfolio-preview-name">📊 ${p.name}</span>
                <button class="portfolio-preview-remove" id="portfolio-preview-remove-btn">✕</button>
            </div>
            <div class="portfolio-preview-info">
                종목 ${p.stocks.length}개 · 총 변동 <span class="${changeClass}">${changeSign}${p.totalChange}%</span>
            </div>
            <div class="portfolio-preview-stocks">
                ${stockChips}
                ${moreChip}
            </div>
        </div>
    `;

    container.classList.remove('hidden');

    // Remove button event
    const removeBtn = document.getElementById('portfolio-preview-remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', removePortfolio);
    }
}

/**
 * Remove attached portfolio
 */
function removePortfolio() {
    selectedPortfolio = null;

    const container = document.getElementById('portfolio-preview-area');
    if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
    }

    // Deactivate toolbar button
    const portfolioBtn = document.getElementById('toolbar-portfolio-btn');
    if (portfolioBtn) portfolioBtn.classList.remove('active');

    console.log('[PostCreate] 포트폴리오 첨부 해제');
}

/**
 * Handle cancel
 */
function handleCancel() {
    if (hasUnsavedChanges) {
        showExitModal();
    } else {
        navigateBack();
    }
}

/**
 * Show exit modal
 */
function showExitModal() {
    const modal = document.getElementById('post-create-exit-modal');
    if (modal) modal.classList.remove('hidden');
}

/**
 * Hide exit modal
 */
function hideExitModal() {
    const modal = document.getElementById('post-create-exit-modal');
    if (modal) modal.classList.add('hidden');
}

/**
 * Confirm exit
 */
function confirmExit() {
    hasUnsavedChanges = false;
    hideExitModal();
    navigateTo('community-feed', false);
}

/**
 * Go back
 */
function navigateBack() {
    navGoBack({
        fallbackScreenId: 'community-feed',
        requirePrefix: 'community-'
    });
}

/**
 * Handle submit
 */
function handleSubmit() {
    const titleInput = document.getElementById('post-title-input');
    const bodyInput = document.getElementById('post-body-input');

    const post = {
        type: selectedPortfolio ? 'portfolio' : 'post',
        category: selectedPortfolio ? '포트폴리오' : selectedCategory,
        title: titleInput?.value.trim(),
        content: bodyInput?.value.trim(),
        stockTags: stockTags
    };

    // 포트폴리오 첨부 시 추가 데이터
    if (selectedPortfolio) {
        post.portfolioId = selectedPortfolio.id;
        post.portfolioName = selectedPortfolio.name;
        post.portfolioStocks = selectedPortfolio.stocks;
    }

    console.log('[PostCreate] 게시글 작성:', post);

    // Navigate to feed
    navigateTo('community-feed');
}
