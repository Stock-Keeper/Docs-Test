/**
 * Post Detail Screen Controller
 */

// Mock Data
const MOCK_POST = {
    id: 1,
    category: '국내주식',
    title: '삼성전자, 지금 사도 될까요?',
    content: '안녕하세요. 최근 삼성전자 주가가 많이 올랐는데요. 지금 진입해도 괜찮을지 의견 부탁드립니다.\n\n현재 PER은 12배 수준이고, 반도체 업황이 회복세라는 분석이 많습니다.',
    author: {
        id: 'user1',
        name: '투자왕김철수',
        followers: '3K',
        isFollowing: false
    },
    date: '1월 15일',
    isEdited: false,
    likes: 42,
    comments: 12,
    reposts: 5,
    isLiked: false,
    stockTags: ['삼성전자']
};

const MOCK_COMMENTS = [
    { id: 1, author: '배당러버', time: '5분 전', text: '좋은 분석이네요! 저도 비슷한 생각입니다.', likes: 3 },
    { id: 2, author: '가치투자자', time: '10분 전', text: 'PER 기준으로는 아직 매력적인 구간 같아요', likes: 1 },
    { id: 3, author: '장기투자', time: '30분 전', text: '반도체 사이클 고려하면 좀 더 기다려도 될 것 같습니다', likes: 5 }
];

let currentPost = MOCK_POST;
let comments = [...MOCK_COMMENTS];

/**
 * Initialize
 */
export function init() {
    // Back button
    const backBtn = document.getElementById('post-detail-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            import('../../core/navigation.js').then(nav => nav.goBack({
                fallbackScreenId: 'community-feed',
                requirePrefix: 'community-'
            }));
        });
    }

    // Follow button
    const followBtn = document.getElementById('post-follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', toggleFollow);
    }

    // Like button
    const likeBtn = document.getElementById('post-like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', toggleLike);
    }

    // Share button
    const shareBtn = document.getElementById('post-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    // Comment input
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('comment-submit-btn');
    if (commentInput && submitBtn) {
        submitBtn.addEventListener('click', () => submitComment(commentInput.value));
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitComment(commentInput.value);
        });
    }

    // Comment sort
    const sortSelect = document.getElementById('comment-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => sortComments(e.target.value));
    }

    // Author avatar/name click -> profile
    const avatar = document.getElementById('post-author-avatar');
    const authorName = document.querySelector('.author-name');
    [avatar, authorName].forEach(el => {
        if (el) {
            el.addEventListener('click', () => {
                import('../../core/navigation.js').then(nav => {
                    nav.navigateTo('community-profile');
                });
            });
        }
    });

    // Reply buttons
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', handleReply);
    });
}

/**
 * Start - called when screen becomes active
 */
export function start() {
    renderPost();
    renderComments();
}

/**
 * Reset
 */
export function reset() {
    const commentInput = document.getElementById('comment-input');
    if (commentInput) commentInput.value = '';
}

/**
 * Render post data
 */
function renderPost() {
    const post = currentPost;

    document.getElementById('post-detail-category').textContent = post.category;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-text').textContent = post.content;
    document.getElementById('post-author-name').textContent = post.author.name;
    document.getElementById('post-date').textContent = post.date;
    document.getElementById('post-follower-count').textContent = post.author.followers;
    document.getElementById('post-like-count').textContent = post.likes;
    document.getElementById('post-comment-count').textContent = post.comments;
    document.getElementById('post-repost-count').textContent = post.reposts;

    // Edited badge
    const editedBadge = document.getElementById('post-edited');
    if (editedBadge) {
        editedBadge.classList.toggle('hidden', !post.isEdited);
    }

    // Follow button state
    updateFollowButton(post.author.isFollowing);

    // Like button state
    updateLikeButton(post.isLiked);

    // Stock tags
    const tagsContainer = document.getElementById('stock-tags');
    if (tagsContainer && post.stockTags) {
        tagsContainer.innerHTML = post.stockTags
            .map(tag => `<span class="stock-tag">$${tag}</span>`)
            .join('');
    }
}

/**
 * Render comments
 */
function renderComments() {
    const list = document.getElementById('comments-list');
    if (!list) return;

    list.innerHTML = comments.map(comment => `
        <div class="comment-item" data-id="${comment.id}">
            <div class="comment-avatar">👤</div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="comment-action-btn comment-like-btn">
                        <span>❤️</span>
                        <span class="comment-like-count">${comment.likes}</span>
                    </button>
                    <button class="comment-action-btn reply-btn">↩️</button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-bind event listeners
    list.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', handleReply);
    });

    list.querySelectorAll('.comment-like-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleCommentLike(btn));
    });
}

/**
 * Toggle follow
 */
function toggleFollow() {
    currentPost.author.isFollowing = !currentPost.author.isFollowing;
    updateFollowButton(currentPost.author.isFollowing);
}

/**
 * Update follow button UI
 */
function updateFollowButton(isFollowing) {
    const btn = document.getElementById('post-follow-btn');
    if (!btn) return;

    btn.textContent = isFollowing ? '팔로잉' : '팔로우';
    btn.classList.toggle('following', isFollowing);
}

/**
 * Toggle like
 */
function toggleLike() {
    currentPost.isLiked = !currentPost.isLiked;
    currentPost.likes += currentPost.isLiked ? 1 : -1;
    updateLikeButton(currentPost.isLiked);
    document.getElementById('post-like-count').textContent = currentPost.likes;
}

/**
 * Update like button UI
 */
function updateLikeButton(isLiked) {
    const btn = document.getElementById('post-like-btn');
    if (btn) btn.classList.toggle('liked', isLiked);
}

/**
 * Toggle comment like
 */
function toggleCommentLike(btn) {
    const countEl = btn.querySelector('.comment-like-count');
    if (countEl) {
        let count = parseInt(countEl.textContent);
        const isLiked = btn.classList.toggle('liked');
        countEl.textContent = isLiked ? count + 1 : count - 1;
    }
}

/**
 * Handle share
 */
function handleShare() {
    // Mock share sheet
    alert('공유 기능은 실제 앱에서 동작합니다.');
}

/**
 * Submit comment
 */
function submitComment(text) {
    if (!text.trim()) return;

    const newComment = {
        id: Date.now(),
        author: '나',
        time: '방금',
        text: text.trim(),
        likes: 0
    };

    comments.unshift(newComment);
    renderComments();

    const input = document.getElementById('comment-input');
    if (input) input.value = '';

    // Update count
    currentPost.comments++;
    document.getElementById('post-comment-count').textContent = currentPost.comments;
}

/**
 * Sort comments
 */
function sortComments(order) {
    switch (order) {
        case 'popular':
            comments.sort((a, b) => b.likes - a.likes);
            break;
        case 'oldest':
            comments.sort((a, b) => a.id - b.id);
            break;
        case 'latest':
        default:
            comments.sort((a, b) => b.id - a.id);
    }
    renderComments();
}

/**
 * Handle reply
 */
function handleReply(e) {
    const item = e.target.closest('.comment-item');
    const author = item?.querySelector('.comment-author')?.textContent;
    const input = document.getElementById('comment-input');
    if (input && author) {
        input.value = `@${author} `;
        input.focus();
    }
}
