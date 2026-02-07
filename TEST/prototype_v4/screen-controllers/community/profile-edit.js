/**
 * Community Profile Edit Controller
 * 
 * 커뮤니티 프로필 편집 화면 컨트롤러
 * - 닉네임 (20자, 90일 쿨타임)
 * - 자기소개 (200자)
 * - 프로필 이미지
 */

import { goBack as navigateBack } from '../../core/navigation.js';

// Mock 프로필 데이터
const MOCK_PROFILE = {
    nickname: '투자왕김철수',
    bio: '장기투자를 지향합니다.',
    avatarEmoji: '👤',
    nicknameChangedAt: '2025-12-01'
};

// 원본 데이터 (비교용)
let originalData = {};

/**
 * 컨트롤러 초기화
 */
export function init() {
    const screen = document.getElementById('screen-community-profile-edit');
    if (!screen) return;

    // 취소 버튼
    const cancelBtn = screen.querySelector('#community-profile-edit-cancel-btn');
    cancelBtn?.addEventListener('click', handleCancel);

    // 저장 버튼
    const saveBtn = screen.querySelector('#community-profile-edit-save-btn');
    saveBtn?.addEventListener('click', handleSave);

    // 사진 변경 버튼
    const photoBtn = screen.querySelector('#community-profile-photo-btn');
    photoBtn?.addEventListener('click', handlePhotoChange);

    // 닉네임 입력
    const nicknameInput = screen.querySelector('#community-nickname-input');
    nicknameInput?.addEventListener('input', () => {
        updateCharCount('nickname-char-count', nicknameInput.value.length);
        checkChanges();
    });

    // 자기소개 입력
    const bioInput = screen.querySelector('#community-bio-input');
    bioInput?.addEventListener('input', () => {
        updateCharCount('bio-char-count', bioInput.value.length);
        checkChanges();
    });

    // 모달 버튼
    const exitCancelBtn = screen.querySelector('#profile-edit-exit-cancel');
    exitCancelBtn?.addEventListener('click', hideExitModal);

    const exitConfirmBtn = screen.querySelector('#profile-edit-exit-confirm');
    exitConfirmBtn?.addEventListener('click', confirmExit);

    console.log('[CommunityProfileEdit] 초기화 완료');
}

/**
 * 화면 진입 시 호출
 */
export function start() {
    loadProfileData();
}

/**
 * 화면 이탈 시 호출
 */
export function reset() {
    const screen = document.getElementById('screen-community-profile-edit');
    if (!screen) return;

    // 폼 리셋
    const nicknameInput = screen.querySelector('#community-nickname-input');
    const bioInput = screen.querySelector('#community-bio-input');
    if (nicknameInput) nicknameInput.value = '';
    if (bioInput) bioInput.value = '';

    // 저장 버튼 비활성화
    const saveBtn = screen.querySelector('#community-profile-edit-save-btn');
    if (saveBtn) saveBtn.disabled = true;

    // 모달 숨김
    hideExitModal();
}

/**
 * 프로필 데이터 로드
 */
function loadProfileData() {
    const screen = document.getElementById('screen-community-profile-edit');
    if (!screen) return;

    // 원본 데이터 저장
    originalData = { ...MOCK_PROFILE };

    // 아바타
    const avatar = screen.querySelector('#community-profile-avatar');
    if (avatar) avatar.textContent = MOCK_PROFILE.avatarEmoji;

    // 닉네임
    const nicknameInput = screen.querySelector('#community-nickname-input');
    if (nicknameInput) {
        nicknameInput.value = MOCK_PROFILE.nickname;
        updateCharCount('nickname-char-count', MOCK_PROFILE.nickname.length);
    }

    // 마지막 변경일
    const lastChanged = screen.querySelector('#nickname-last-changed');
    if (lastChanged) {
        lastChanged.textContent = `마지막 변경: ${MOCK_PROFILE.nicknameChangedAt}`;
    }

    // 자기소개
    const bioInput = screen.querySelector('#community-bio-input');
    if (bioInput) {
        bioInput.value = MOCK_PROFILE.bio;
        updateCharCount('bio-char-count', MOCK_PROFILE.bio.length);
    }

    // 저장 버튼 비활성화
    const saveBtn = screen.querySelector('#community-profile-edit-save-btn');
    if (saveBtn) saveBtn.disabled = true;
}

/**
 * 글자수 카운터 업데이트
 */
function updateCharCount(elementId, count) {
    const counter = document.getElementById(elementId);
    if (counter) counter.textContent = count;
}

/**
 * 변경사항 확인
 */
function checkChanges() {
    const screen = document.getElementById('screen-community-profile-edit');
    if (!screen) return;

    const nicknameInput = screen.querySelector('#community-nickname-input');
    const bioInput = screen.querySelector('#community-bio-input');
    const saveBtn = screen.querySelector('#community-profile-edit-save-btn');

    const hasNicknameChange = nicknameInput?.value !== originalData.nickname;
    const hasBioChange = bioInput?.value !== originalData.bio;
    const hasChanges = hasNicknameChange || hasBioChange;

    if (saveBtn) saveBtn.disabled = !hasChanges;
}

/**
 * 변경사항 존재 여부 확인
 */
function hasUnsavedChanges() {
    const screen = document.getElementById('screen-community-profile-edit');
    if (!screen) return false;

    const nicknameInput = screen.querySelector('#community-nickname-input');
    const bioInput = screen.querySelector('#community-bio-input');

    return (nicknameInput?.value !== originalData.nickname) ||
        (bioInput?.value !== originalData.bio);
}

/**
 * 취소 버튼 핸들러
 */
function handleCancel() {
    if (hasUnsavedChanges()) {
        showExitModal();
    } else {
        goBack();
    }
}

/**
 * 저장 버튼 핸들러
 */
function handleSave() {
    const screen = document.getElementById('screen-community-profile-edit');
    if (!screen) return;

    const nicknameInput = screen.querySelector('#community-nickname-input');
    const bioInput = screen.querySelector('#community-bio-input');

    console.log('[CommunityProfileEdit] 저장:', {
        nickname: nicknameInput?.value,
        bio: bioInput?.value
    });

    // Mock 저장 성공 - 실제로는 API 호출
    alert('저장되었습니다.');
    goBack();
}

/**
 * 사진 변경 핸들러
 */
function handlePhotoChange() {
    console.log('[CommunityProfileEdit] 사진 변경 클릭');
    alert('사진 변경 기능은 프로토타입에서 지원하지 않습니다.');
}

/**
 * 나가기 모달 표시
 */
function showExitModal() {
    const modal = document.getElementById('community-profile-edit-exit-modal');
    if (modal) modal.classList.remove('hidden');
}

/**
 * 나가기 모달 숨김
 */
function hideExitModal() {
    const modal = document.getElementById('community-profile-edit-exit-modal');
    if (modal) modal.classList.add('hidden');
}

/**
 * 나가기 확인
 */
function confirmExit() {
    hideExitModal();
    goBack();
}

/**
 * 이전 화면으로
 */
function goBack() {
    navigateBack({
        fallbackScreenId: 'community-profile',
        requirePrefix: 'community-'
    });
}
