/**
 * Profile Screen Controller
 */

// State
let isOwnProfile = true;
let isFollowing = false;

// Mock Data
const MY_PROFILE = {
    name: '투자왕김철수',
    handle: '@investking',
    bio: '장기투자를 지향합니다.',
    avatar: '👤',
    stats: { posts: 12, followers: 156, following: 23 }
};

const OTHER_PROFILE = {
    name: '김철수',
    handle: '@dividend_lover',
    bio: '주식 투자에 대한 정보를 공유합니다.',
    avatar: '👤',
    stats: { posts: 48, followers: 1200, following: 89 }
};

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

    // Default: show own profile
    setProfileMode(true);
    renderProfile(MY_PROFILE);
}

/**
 * Reset
 */
export function reset() {
    isOwnProfile = true;
    isFollowing = false;
    switchTab('activity');
}

function bindEvents() {
    const backBtn = document.getElementById('community-profile-back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            import('../../core/navigation.js').then(nav => nav.goBack({
                fallbackScreenId: 'community-feed',
                requirePrefix: 'community-'
            }));
        };
    }

    const settingsBtn = document.getElementById('profile-settings-btn');
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            import('../../core/navigation.js').then(nav => nav.navigateTo('community-settings'));
        };
    }

    const blockBtn = document.getElementById('profile-block-btn');
    if (blockBtn) {
        blockBtn.onclick = handleBlock;
    }

    const editBtn = document.getElementById('profile-edit-btn');
    if (editBtn) {
        editBtn.onclick = handleEdit;
    }

    const followBtn = document.getElementById('profile-follow-btn');
    if (followBtn) {
        followBtn.onclick = toggleFollow;
    }

    document.querySelectorAll('#screen-community-profile .profile-tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });
}

/**
 * Set profile mode (own vs other)
 */
function setProfileMode(ownProfile) {
    isOwnProfile = ownProfile;

    const settingsBtn = document.getElementById('profile-settings-btn');
    const blockBtn = document.getElementById('profile-block-btn');
    const editBtn = document.getElementById('profile-edit-btn');
    const followBtn = document.getElementById('profile-follow-btn');

    if (ownProfile) {
        settingsBtn?.classList.remove('hidden');
        blockBtn?.classList.add('hidden');
        editBtn?.classList.remove('hidden');
        followBtn?.classList.add('hidden');
    } else {
        settingsBtn?.classList.add('hidden');
        blockBtn?.classList.remove('hidden');
        editBtn?.classList.add('hidden');
        followBtn?.classList.remove('hidden');
    }
}

/**
 * Render profile data
 */
function renderProfile(profile) {
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-handle').textContent = profile.handle;

    const bioEl = document.getElementById('profile-bio');
    if (bioEl) {
        if (profile.bio) {
            bioEl.textContent = profile.bio;
            bioEl.classList.remove('hidden');
        } else {
            bioEl.classList.add('hidden');
        }
    }

    document.getElementById('stat-posts').textContent = formatNumber(profile.stats.posts);
    document.getElementById('stat-followers').textContent = formatNumber(profile.stats.followers);
    document.getElementById('stat-following').textContent = formatNumber(profile.stats.following);

    updateFollowButton();
}

/**
 * Format number (1200 -> 1.2K)
 */
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

/**
 * Toggle follow
 */
function toggleFollow() {
    isFollowing = !isFollowing;
    updateFollowButton();
}

/**
 * Update follow button
 */
function updateFollowButton() {
    const btn = document.getElementById('profile-follow-btn');
    if (!btn) return;

    btn.textContent = isFollowing ? '팔로잉' : '팔로우';
    btn.classList.toggle('following', isFollowing);
}

/**
 * Handle block
 */
function handleBlock() {
    alert('차단 기능은 아직 구현되지 않았습니다.');
}

/**
 * Handle edit
 */
function handleEdit() {
    import('../../core/navigation.js').then(nav => nav.navigateTo('community-profile-edit'));
}

/**
 * Switch tab
 */
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update tab panes
    document.getElementById('tab-activity')?.classList.toggle('hidden', tabId !== 'activity');
    document.getElementById('tab-portfolio')?.classList.toggle('hidden', tabId !== 'portfolio');
    document.getElementById('tab-trade')?.classList.toggle('hidden', tabId !== 'trade');
}

/**
 * Load other user's profile
 */
export function loadOtherProfile(userId) {
    setProfileMode(false);
    renderProfile(OTHER_PROFILE);
}

