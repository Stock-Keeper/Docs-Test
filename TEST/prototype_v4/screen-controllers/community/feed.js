import { navigateTo } from '../../core/navigation.js';
import AdConfig from '../../core/mock/ads.js';

let feedLoadTimer = null;

const MOCK_POSTS = [
    { id: 1, type: 'post', category: '국내주식', title: '삼성전자, 지금 사도 될까요?', preview: '안녕하세요. 최근 삼성전자 주가가 많이 올랐는데요. 지금 진입해도 괜찮을지 의견 부탁드립니다.', likes: 42, comments: 12, author: '투자왕김철수', time: '2시간 전', images: 2 },
    { id: 2, type: 'portfolio', name: '배당주 중심 포트폴리오', stocks: 8, author: '배당러버', likes: 156, copies: 23, time: '1일 전', totalChange: 3.5 },
    { id: 3, type: 'question', category: '질문/답변', title: '미국 주식 세금 관련 질문입니다', preview: '양도소득세랑 배당세 신고는 보통 언제, 어떻게 준비하시나요? 팁 좀 알려주세요.', likes: 12, comments: 8, author: '주식초보', time: '3시간 전', images: 0 },
    { id: 4, type: 'post', category: '해외주식', title: '테슬라 실적 발표 요약', preview: '어제 테슬라 실적 발표를 요약해 드립니다. 매출액은 시장 예상치를 상회했으며...', likes: 89, comments: 34, author: '미장마스터', time: '4시간 전', images: 1 },
    { id: 5, type: 'post', category: '국내주식', title: '네이버 주가 하락 원인 분석', preview: '최근 플랫폼 규제 이슈로 인해 네이버 주가가 약세를 보이고 있습니다.', likes: 25, comments: 5, author: '분석가조', time: '5시간 전', images: 0 },
    { id: 6, type: 'portfolio', name: '안정형 ETF 포트폴리오', stocks: 3, author: '안전제일', likes: 45, copies: 12, time: '6시간 전', totalChange: 1.2 },
    { id: 7, type: 'question', category: '증권사 비교', title: '수수료 싼 증권사 추천해주세요', preview: '주거래 증권사를 옮기려고 하는데 수수료 혜택 좋은 곳 추천 부탁드립니다.', likes: 18, comments: 15, author: '개미', time: '7시간 전', images: 0 },
    { id: 8, type: 'post', category: '거시경제', title: '금리 동결, 시장 영향은?', preview: '이번 달 금리 동결이 시장에 미칠 영향을 분석해 보았습니다.', likes: 56, comments: 22, author: '이코노미스트', time: '8시간 전', images: 3 },
    { id: 9, type: 'portfolio', name: '고수익 공격형 포트폴리오', stocks: 5, author: '불나방', likes: 210, copies: 45, time: '12시간 전', totalChange: 15.8 },
    { id: 10, type: 'post', category: '투자칼럼', title: '장기 투자의 중요성', preview: '워렌 버핏의 투자 철학을 바탕으로 장기 투자의 중요성을 설명합니다.', likes: 120, comments: 40, author: '존버정신', time: '하루 전', images: 0 },
    { id: 11, type: 'question', category: '기타', title: '주식 어플 사용법 문의', preview: '이 어플 알림 설정은 어디서 하나요?', likes: 2, comments: 1, author: '어플초보', time: '하루 전', images: 1 }
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

    posts.forEach((post, index) => {
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

        // [Phase 2] 인피드 네이티브 광고 삽입
        const currentPhase = document.body.getAttribute('data-current-phase');
        if (currentPhase === 'P2' || currentPhase === 'P3') {
            const adConfig = AdConfig.getConfigByPlacement('FEED_NATIVE');
            const interval = adConfig.feed_interval || 5;

            // 1부터 시작하는 순번 기준이므로 index + 1을 interval로 나눈 나머지가 0일 때 삽입
            if ((index + 1) % interval === 0) {
                const adCard = document.createElement('div');
                adCard.className = 'feed-card ad-native community-post-card';
                adCard.innerHTML = `
                    <div class="ad-label">Ad · 광고</div>
                    <div class="feed-card-header">
                        <span class="feed-card-category" style="background-color: var(--color-border); color: var(--color-text-secondary);">스폰서 콘텐츠</span>
                    </div>
                    <div class="feed-card-title">Stock-Keeper 추천 프리미엄 멤버십</div>
                    <div class="feed-card-preview">더 많은 포트폴리오를 제한 없이 구독할 수 있는 특별한 혜택을 만나보세요.</div>
                    <div class="ad-image-placeholder">광고 배너 이미지 영영</div>
                `;
                list.appendChild(adCard);
            }
        }
    });
}
