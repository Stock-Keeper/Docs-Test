// =================================================================
// Stock-Keeper UI Prototype V3 - Utilities
// Toast notifications and helper functions
// =================================================================

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    let toast = document.getElementById('demo-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

/**
 * Show stock detail (placeholder)
 * @param {string} stockName - Name of the stock
 */
function showStockDetail(stockName) {
    showToast(`종목 상세: ${stockName}`);
    // TODO: Navigate to stock detail screen
}
