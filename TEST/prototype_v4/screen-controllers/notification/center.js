/**
 * Notification Center Controller
 */
import { navigateTo, goBack } from '../../core/navigation.js';

// Original Mock Data (for reset)
const ORIGINAL_NOTIFICATIONS = [
    {
        id: 1,
        type: 'portfolio',
        title: '[내 포트폴리오] 39% 달성 🔥',
        message: '축하합니다! 목표 수익률을 달성했습니다.',
        time: '방금 전',
        unread: true
    },
    {
        id: 2,
        type: 'warning',
        title: '[안전형] 리밸런싱 필요',
        message: '채권 비중이 목표보다 5% 낮아졌습니다.',
        time: '2시간 전',
        unread: true
    },
    {
        id: 3,
        type: 'system',
        title: '배당금 입금 알림 💰',
        message: '삼성전자 배당금 $12.45가 입금되었습니다.',
        time: '어제',
        unread: false
    },
    {
        id: 4,
        type: 'info',
        title: '새로운 기능 알림',
        message: '다크모드 차트가 더 선명해졌습니다.',
        time: '3일 전',
        unread: false
    },
    {
        id: 5,
        type: 'portfolio',
        title: '[성장주] 정기 점검',
        message: '매월 1일은 리밸런싱하는 날입니다.',
        time: '1주 전',
        unread: false
    }
];

// Working copy of notifications
let notifications = JSON.parse(JSON.stringify(ORIGINAL_NOTIFICATIONS));

// Called when controller is loaded
export function init() {
    console.log('[Notification Center] Init called');
}

// Called when screen becomes active
export function start() {
    console.log('[Notification Center] Start called');

    // Reset notifications to original state each time screen opens
    notifications = JSON.parse(JSON.stringify(ORIGINAL_NOTIFICATIONS));

    const backBtn = document.getElementById('noti-center-back-btn');
    const readAllBtn = document.getElementById('noti-read-all-btn');

    // Back Button - Use goBack from navigation
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Notification Center] Back button clicked');
            goBack();
        };
    }

    // Read All Button
    if (readAllBtn) {
        readAllBtn.onclick = () => markAllAsRead();
    }

    // Render List
    renderNotifications();
}

// Reset function - called when navigating away
export function reset() {
    console.log('[Notification Center] Reset called');
    notifications = JSON.parse(JSON.stringify(ORIGINAL_NOTIFICATIONS));
}

// State control for control panel
export function setState(stateId) {
    console.log('[Notification Center] setState:', stateId);

    const listEl = document.getElementById('notification-list');
    const emptyState = document.getElementById('noti-empty-state');
    const skeleton = document.getElementById('noti-skeleton');

    console.log('[Notification Center] Elements found:', { listEl: !!listEl, emptyState: !!emptyState, skeleton: !!skeleton });

    // Reset All
    if (listEl) listEl.style.display = 'none';
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }
    if (skeleton) skeleton.classList.remove('visible');

    switch (stateId) {
        case 'loading':
            console.log('[Notification Center] Showing loading state');
            if (skeleton) skeleton.classList.add('visible');
            break;

        case 'empty':
            console.log('[Notification Center] Showing empty state');
            if (emptyState) {
                emptyState.classList.remove('hidden');
                emptyState.style.display = 'flex';
            }
            break;

        case 'error':
            alert('데이터 로드 실패 예시');
            break;

        default: // 'normal' or 'default'
            console.log('[Notification Center] Showing normal state');
            if (listEl) listEl.style.display = 'block';
            renderNotifications();
            break;
    }
}

function renderNotifications() {
    const listEl = document.getElementById('notification-list');
    const emptyState = document.getElementById('noti-empty-state');
    const skeleton = document.getElementById('noti-skeleton');

    if (!listEl) {
        console.error('notification-list element not found');
        return;
    }

    // Hide skeleton and empty
    if (skeleton) skeleton.classList.remove('visible');
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }

    // Show list
    listEl.style.display = 'block';

    if (!notifications || notifications.length === 0) {
        listEl.style.display = 'none';
        if (emptyState) {
            emptyState.classList.remove('hidden');
            emptyState.style.display = 'flex';
        }
        return;
    }

    listEl.innerHTML = notifications.map(noti => `
        <li class="notification-item ${noti.unread ? 'unread' : ''}" data-id="${noti.id}">
            <div class="noti-icon-box">${getIconByType(noti.type)}</div>
            <div class="noti-content">
                <div class="noti-header">
                    <span class="noti-title">${noti.title}</span>
                    <span class="noti-dot"></span>
                </div>
                <p class="noti-message">${noti.message}</p>
                <span class="noti-time">${noti.time}</span>
            </div>
            <button class="noti-delete-btn" data-delete="${noti.id}">🗑️</button>
        </li>
    `).join('');

    // Add event listeners
    listEl.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('noti-delete-btn')) {
                const id = parseInt(item.dataset.id);
                onNotificationClick(id);
            }
        });
    });

    listEl.querySelectorAll('.noti-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.delete);
            deleteNotification(id);
        });
    });
}

function getIconByType(type) {
    switch (type) {
        case 'portfolio': return '📊';
        case 'warning': return '⚠️';
        case 'system': return '🔔';
        case 'info': return 'ℹ️';
        default: return '📩';
    }
}

function onNotificationClick(id) {
    const noti = notifications.find(n => n.id === id);
    if (noti && noti.unread) {
        noti.unread = false;
        renderNotifications();
    }
    alert(`'${noti.title}' 상세 화면으로 이동합니다.`);
}

function deleteNotification(id) {
    if (confirm('알림을 삭제하시겠습니까?')) {
        notifications = notifications.filter(n => n.id !== id);
        renderNotifications();
    }
}

function markAllAsRead() {
    let unreadCount = notifications.filter(n => n.unread).length;
    if (unreadCount === 0) {
        alert('모든 알림을 이미 읽었습니다.');
        return;
    }

    notifications.forEach(n => n.unread = false);
    renderNotifications();
}
