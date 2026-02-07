/**
 * Post Create Screen Controller
 */

// State
let selectedCategory = '전체';
let stockTags = [];
let hasUnsavedChanges = false;

// Mock stock data for autocomplete
const MOCK_STOCKS = [
    { code: '005930', name: '삼성전자' },
    { code: '000660', name: 'SK하이닉스' },
    { code: '035420', name: 'NAVER' },
    { code: '035720', name: '카카오' },
    { code: '051910', name: 'LG화학' },
    { code: '006400', name: '삼성SDI' }
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
                checkStockTags(bodyInput?.value || '');
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

    hideAutocomplete();
    validateForm();
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

/**
 * Handle cancel
 */
function handleCancel() {
    if (hasUnsavedChanges) {
        showExitModal();
    } else {
        goBack();
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
    hideExitModal();
    goBack();
}

/**
 * Go back
 */
function goBack() {
    import('../../core/navigation.js').then(nav => nav.goBack({
        fallbackScreenId: 'community-feed',
        requirePrefix: 'community-'
    }));
}

/**
 * Handle submit
 */
function handleSubmit() {
    const titleInput = document.getElementById('post-title-input');
    const bodyInput = document.getElementById('post-body-input');

    const post = {
        category: selectedCategory,
        title: titleInput?.value.trim(),
        content: bodyInput?.value.trim(),
        stockTags: stockTags
    };

    console.log('[PostCreate] 게시글 작성:', post);

    // Navigate to feed
    import('../../core/navigation.js').then(nav => nav.navigateTo('community-feed'));
}
