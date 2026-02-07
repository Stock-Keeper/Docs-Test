/**
 * Community Search Screen Controller
 */

import { navigateTo, goBack } from '../../core/navigation.js';
import { loadOtherProfile } from './profile.js';

// Mock Data (community search)
const MOCK_STOCKS = [
    { code: '005930', name: '\uC0BC\uC131\uC804\uC790', price: '70,000', change: '+2.5%', up: true },
    { code: '006400', name: '\uC0BC\uC131SDI', price: '450,000', change: '+1.2%', up: true },
    { code: '207940', name: '\uC0BC\uC131\uBC14\uC774\uC624\uB85C\uC9C1\uC2A4', price: '780,000', change: '-0.8%', up: false },
    { code: '000660', name: 'SK\uD558\uC774\uB2C9\uC2A4', price: '142,000', change: '-1.7%', up: false }
];

const MOCK_POSTS = [
    { id: 1, title: '\uC0BC\uC131\uC804\uC790 \uC2E4\uC801 \uBD84\uC11D', likes: 42 },
    { id: 2, title: '\uBC18\uB3C4\uCCB4 \uC5C5\uD669 \uC804\uB9DD', likes: 28 }
];

// User results are shown only when query exactly matches full name.
const MOCK_USERS = [
    { id: 'user-investking', name: '\uD22C\uC790\uC655\uAE40\uCCA0\uC218', avatar: '\uD83D\uDC64' }
];

let debounceTimer = null;

function getScreen() {
    return document.getElementById('screen-community-search');
}

function getEl(id) {
    return getScreen()?.querySelector(`#${id}`) || null;
}

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

    const input = getEl('community-search-input');
    if (input) {
        input.value = '';
        input.focus();
    }
    showInitial();
}

/**
 * Reset
 */
export function reset() {
    clearSearch();
}

function bindEvents() {
    const backBtn = getEl('community-search-back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            goBack({
                fallbackScreenId: 'community-feed',
                requirePrefix: 'community-'
            });
        };
    }

    const searchInput = getEl('community-search-input');
    const clearBtn = getEl('search-clear-btn');

    if (searchInput) {
        searchInput.oninput = handleSearchInput;
        searchInput.onfocus = () => searchInput.select();
    }

    if (clearBtn) {
        clearBtn.onclick = clearSearch;
    }
}

/**
 * Handle search input
 */
function handleSearchInput(e) {
    const query = e.target.value.trim();
    const clearBtn = getEl('search-clear-btn');

    if (clearBtn) {
        clearBtn.classList.toggle('hidden', query.length === 0);
    }

    if (debounceTimer) clearTimeout(debounceTimer);

    if (query.length === 0) {
        showInitial();
        return;
    }

    debounceTimer = setTimeout(() => {
        performSearch(query);
    }, 250);
}

/**
 * Clear search
 */
function clearSearch() {
    const input = getEl('community-search-input');
    const clearBtn = getEl('search-clear-btn');

    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');

    showInitial();
}

/**
 * Show initial state
 */
function showInitial() {
    getEl('search-initial')?.classList.remove('hidden');
    getEl('search-loading')?.classList.add('hidden');
    getEl('search-results')?.classList.add('hidden');
    getEl('search-empty')?.classList.add('hidden');
}

/**
 * Show loading state
 */
function showLoading() {
    getEl('search-initial')?.classList.add('hidden');
    getEl('search-loading')?.classList.remove('hidden');
    getEl('search-results')?.classList.add('hidden');
    getEl('search-empty')?.classList.add('hidden');
}

/**
 * Show results
 */
function showResults() {
    getEl('search-initial')?.classList.add('hidden');
    getEl('search-loading')?.classList.add('hidden');
    getEl('search-results')?.classList.remove('hidden');
    getEl('search-empty')?.classList.add('hidden');
}

/**
 * Show empty state
 */
function showEmpty() {
    getEl('search-initial')?.classList.add('hidden');
    getEl('search-loading')?.classList.add('hidden');
    getEl('search-results')?.classList.add('hidden');
    getEl('search-empty')?.classList.remove('hidden');
}

/**
 * Perform search
 */
function performSearch(query) {
    showLoading();

    const normalizedQuery = query.toLowerCase();

    setTimeout(() => {
        const stocks = MOCK_STOCKS.filter(stock =>
            stock.name.toLowerCase().includes(normalizedQuery) || stock.code.includes(query)
        );
        const posts = MOCK_POSTS.filter(post =>
            post.title.toLowerCase().includes(normalizedQuery)
        );
        const users = MOCK_USERS.filter(user => user.name === query);

        if (stocks.length === 0 && posts.length === 0 && users.length === 0) {
            showEmpty();
            return;
        }

        renderResults(stocks, posts, users);
        showResults();
    }, 200);
}

/**
 * Render results
 */
function renderResults(stocks, posts, users) {
    renderStockResults(stocks);
    renderPostResults(posts);
    renderUserResults(users);
}

function renderStockResults(stocks) {
    const stockSection = getEl('result-stocks');
    const stockList = getEl('stock-results-list');
    if (!stockList) return;

    if (stocks.length === 0) {
        stockSection?.classList.add('hidden');
        stockList.innerHTML = '';
        return;
    }

    stockSection?.classList.remove('hidden');
    stockList.innerHTML = stocks.map(stock => `
        <div class="result-item stock-result-item" data-code="${stock.code}">
            <div class="result-info">
                <span class="result-name">${stock.name}</span>
                <span class="result-code">${stock.code}</span>
            </div>
            <div class="result-price">
                <div class="price">${stock.price}</div>
                <div class="change ${stock.up ? 'up' : 'down'}">${stock.change}</div>
            </div>
        </div>
    `).join('');

    stockList.querySelectorAll('.stock-result-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo('stock-detail');
        });
    });
}

function renderPostResults(posts) {
    const postSection = getEl('result-posts');
    const postList = getEl('post-results-list');
    if (!postList) return;

    if (posts.length === 0) {
        postSection?.classList.add('hidden');
        postList.innerHTML = '';
        return;
    }

    postSection?.classList.remove('hidden');
    postList.innerHTML = posts.map(post => `
        <div class="result-item post-result-item" data-id="${post.id}">
            <span class="post-title">${post.title}</span>
            <span class="post-likes">좋아요 ${post.likes}</span>
        </div>
    `).join('');

    postList.querySelectorAll('.post-result-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo('community-post-detail');
        });
    });
}

function renderUserResults(users) {
    const userSection = getEl('result-users');
    const userList = getEl('user-results-list');
    if (!userList) return;

    if (users.length === 0) {
        userSection?.classList.add('hidden');
        userList.innerHTML = '';
        return;
    }

    userSection?.classList.remove('hidden');
    userList.innerHTML = users.map(user => `
        <div class="result-item user-result-item" data-id="${user.id}">
            <div class="result-info user-row">
                <span class="user-avatar-sm">${user.avatar}</span>
                <span class="result-name">${user.name}</span>
            </div>
        </div>
    `).join('');

    userList.querySelectorAll('.user-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const userId = item.getAttribute('data-id') || '';
            navigateTo('community-profile');
            loadOtherProfile(userId);
        });
    });
}
