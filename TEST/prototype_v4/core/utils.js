// =================================================================
// Stock-Keeper UI Prototype V4 - Utilities
// =================================================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 2000)
 */
export function showToast(message, duration = 2000) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('show'));

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (KRW, USD)
 */
export function formatCurrency(amount, currency = 'KRW') {
    const symbol = currency === 'USD' ? '$' : '₩';
    return `${symbol}${amount.toLocaleString()}`;
}

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {boolean} showSign - Whether to show + for positive
 */
export function formatPercent(value, showSign = true) {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

// Expose to global for inline handlers
window.showToast = showToast;
