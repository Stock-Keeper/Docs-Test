import { navigateTo } from '../../core/navigation.js';

// Mock Data
const MOCK_POSTS = [
  { id: 1, type: 'post', category: '국내주식', title: '삼성전자 향후 전망 분석', 
    preview: '최근 반도체 시장의 동향을 보면 삼성전자의 주가가 어떻게 변할지 예측해볼 수 있습니다. 특히 메모리 반도체 가격 상승이...', 
    likes: 42, comments: 5, author: '투자왕', time: '2시간 전', images: 2 },
  { id: 2, type: 'portfolio', name: '고배당 안전지향 포트', 
    stocks: 8, author: '배당러버', likes: 156, copies: 23, time: '1일 전' },
  { id: 3, type: 'question', category: '질문', title: '미국 주식 세금 질문입니다', 
    preview: '해외 주식 양도소득세 신고 기준이 250만원 맞나요? 그리고 배당소득세는 따로 내야 하는 건가요?', 
    likes: 12, comments: 8, author: '주린이', time: '3시간 전', images: 0 }, 
  { id: 4, type: 'post', category: '자유', title: '오늘 장 진짜 힘드네요', 
    preview: '다들 파란불이신가요? 저만 그런거 아니죠? ㅠㅠ', 
    likes: 5, comments: 20, author: '한강뷰', time: '10분 전', images: 0 }
];

export function init() {
    console.log('[Community Feed] Init');
}

export function start() {
    console.log('[Community Feed] Start');
    
    // Bind Events
    bindEvents();
    
    // Render
    render(MOCK_POSTS);
}

export function reset() {
    console.log('[Community Feed] Reset');
}

export function setState(stateId) {
    console.log('[Community Feed] setState:', stateId);
    
    const content = document.querySelector('#screen-community-feed .content-container');
    const skeleton = document.getElementById('community-feed-skeleton');
    const emptyState = document.getElementById('community-feed-empty-state');
    
    // Reset visibility
    if (content) content.style.display = 'none';
    if (skeleton) skeleton.classList.remove('visible');
    if (skeleton) skeleton.style.display = 'none';
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
            alert('데이터 로드 중 오류가 발생했습니다.');
            break;
        default: // normal
            if (content) content.style.display = 'block';
            break;
    }
}

function bindEvents() {
    // Navigation Buttons
    const searchBtn = document.getElementById('feed-search-btn');
    if (searchBtn) {
        searchBtn.onclick = () => {
             // navigateTo('community-search'); // TBD
             console.log('Go to Search');
        };
    }

    const profileBtn = document.getElementById('feed-profile-btn');
    if (profileBtn) {
        profileBtn.onclick = () => {
             // navigateTo('community-profile'); // TBD
             console.log('Go to Profile');
        };
    }

    // FAB
    const fab = document.getElementById('feed-write-fab');
    if (fab) {
        fab.onclick = () => {
             // navigateTo('community-post-create'); 
             console.log('Go to Post Create');
        };
    }
    
    const emptyWriteBtn = document.getElementById('feed-empty-write-btn');
    if (emptyWriteBtn) {
        emptyWriteBtn.onclick = () => {
            // navigateTo('community-post-create');
            console.log('Go to Post Create from Empty State');
        }
    }

    // Tabs
    const tabs = document.querySelectorAll('.feed-tab');
    tabs.forEach(tab => {
        tab.onclick = (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const type = e.target.dataset.tab;
            console.log('Tab changed to:', type);
            // In real app, filter data here
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
        card.onclick = () => {
            console.log('Clicked post:', post.id);
            // navigateTo('community-post-detail', { id: post.id });
        };
        
        let cardContent = '';
        
        if (post.type === 'portfolio') {
            cardContent = `
                <div class="feed-card-header">
                    <span class="feed-card-category" style="background-color: var(--accent); color: white;">📊 포트폴리오</span>
                </div>
                <div class="feed-card-title">${post.name}</div>
                <div class="feed-card-preview">종목 ${post.stocks}개 포함</div>
                <div class="feed-card-meta">
                    <span>${post.author} · ${post.time}</span>
                    <div class="feed-card-stats">
                        <span>❤️ ${post.likes}</span>
                        <span>📋 ${post.copies}</span>
                    </div>
                </div>
            `;
        } else {
            cardContent = `
                <div class="feed-card-header">
                    <span class="feed-card-category">${post.category}</span>
                </div>
                <div class="feed-card-title">${post.title}</div>
                <div class="feed-card-preview">${post.preview}</div>
                <div class="feed-card-meta">
                    <span>${post.author} · ${post.time}</span>
                    <div class="feed-card-stats">
                        ${post.images > 0 ? `<span>🖼️ ${post.images}</span>` : ''}
                        <span>❤️ ${post.likes}</span>
                        <span>💬 ${post.comments}</span>
                    </div>
                </div>
            `;
        }
        
        card.innerHTML = cardContent;
        list.appendChild(card);
    });
}
