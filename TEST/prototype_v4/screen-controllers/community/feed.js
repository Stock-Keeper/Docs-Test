import { navigateTo } from '../../core/navigation.js';
let feedLoadTimer = null;

const MOCK_POSTS = [
    {
        id: 1,
        type: 'post',
        category: '국내주식',
        title: '삼성전자, 지금 사도 될까요?',
        preview: '안녕하세요. 최근 삼성전자 주가가 많이 올랐는데요. 지금 진입해도 괜찮을지 의견 부탁드립니다.',
        likes: 42,
        comments: 12,
        author: '투자왕김철수',
        time: '2시간 전',
        images: 2
    },
    {
        id: 2,
        type: 'portfolio',
        name: '배당주 중심 포트폴리오',
        stocks: 8,
        author: '배당러버',
        likes: 156,
        copies: 23,
        time: '1일 전',
        totalChange: 3.5
    },
    {
        id: 3,
        type: 'question',
        category: '질문/답변',
        title: '미국 주식 세금 관련 질문입니다',
        preview: '양도소득세랑 배당세 신고는 보통 언제, 어떻게 준비하시나요? 팁 좀 알려주세요.',
        likes: 12,
        comments: 8,
        author: '주식초보',
        time: '3시간 전',
        images: 0
    }
];

export function init() {
    console.log('[Community Feed] Init');
}

export function start() {
    bindEvents();
    setState('loading');

    if (feedLoadTimer) clearTimeout(feedLoadTimer);
    feedLoadTimer = setTimeout(() => {
        render(MOCK_POSTS);
        setState('default');
        feedLoadTimer = null;
    }, 180);
}

export function reset() {
    if (feedLoadTimer) {
        clearTimeout(feedLoadTimer);
        feedLoadTimer = null;
    }
}

export function setState(stateId) {
    const content = document.querySelector('#screen-community-feed .content-container');
    const skeleton = document.getElementById('community-feed-skeleton');
    const emptyState = document.getElementById('community-feed-empty-state');

    if (content) content.style.display = 'none';
    if (skeleton) {
        skeleton.classList.remove('visible');
        skeleton.style.display = 'none';
    }
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }

    switch (stateId) {
        case 'loading':
            if (skeleton) {
                skeleton.style.display = 'block';
                skeleton.classList.add('visible');
            }
            break;
        case 'empty':
            if (emptyState) {
                emptyState.classList.remove('hidden');
                emptyState.style.display = 'flex';
            }
            break;
        case 'error':
            alert('Failed to load feed data.');
            break;
        default:
            if (content) content.style.display = 'block';
            break;
    }
}

function bindEvents() {
    const searchBtn = document.getElementById('feed-search-btn');
    if (searchBtn) {
        searchBtn.onclick = () => navigateTo('community-search');
    }

    const profileBtn = document.getElementById('feed-profile-btn');
    if (profileBtn) {
        profileBtn.onclick = () => navigateTo('community-profile');
    }

    const fab = document.getElementById('feed-write-fab');
    if (fab) {
        fab.onclick = () => navigateTo('community-post-create');
    }

    const emptyWriteBtn = document.getElementById('feed-empty-write-btn');
    if (emptyWriteBtn) {
        emptyWriteBtn.onclick = () => navigateTo('community-post-create');
    }

    const tabs = document.querySelectorAll('#screen-community-feed .feed-tab');
    tabs.forEach(tab => {
        tab.onclick = event => {
            tabs.forEach(item => item.classList.remove('active'));
            event.currentTarget.classList.add('active');
        };
    });
}

function render(posts) {
    const list = document.getElementById('feed-list');
    if (!list) return;

    list.innerHTML = '';

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = `feed-card ${post.type === 'portfolio' ? 'portfolio-type' : ''}`;
        card.onclick = () => navigateTo('community-post-detail');

        if (post.type === 'portfolio') {
            const changeClass = post.totalChange >= 0 ? 'positive' : 'negative';
            const changeSign = post.totalChange >= 0 ? '+' : '';
            card.innerHTML = `
                <div class="feed-card-header">
                    <span class="feed-card-category" style="background-color: var(--primary); color: white;">포트폴리오</span>
                    <span class="feed-card-change ${changeClass}">${changeSign}${post.totalChange}%</span>
                </div>
                <div class="feed-card-title">${post.name}</div>
                <div class="feed-card-preview">${post.stocks}개 종목 포함</div>
                <div class="feed-card-meta">
                    <span>${post.author} · ${post.time}</span>
                    <div class="feed-card-stats">
                        <span>좋아요 ${post.likes}</span>
                        <span>복사 ${post.copies}</span>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="feed-card-header">
                    <span class="feed-card-category">${post.category}</span>
                </div>
                <div class="feed-card-title">${post.title}</div>
                <div class="feed-card-preview">${post.preview}</div>
                <div class="feed-card-meta">
                    <span>${post.author} · ${post.time}</span>
                    <div class="feed-card-stats">
                        ${post.images > 0 ? `<span>이미지 ${post.images}</span>` : ''}
                        <span>좋아요 ${post.likes}</span>
                        <span>댓글 ${post.comments}</span>
                    </div>
                </div>
            `;
        }

        list.appendChild(card);
    });
}
