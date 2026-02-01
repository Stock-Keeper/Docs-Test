/**
 * Notification Settings Controller
 */
import { navigateTo, goBack } from '../../core/navigation.js';

// Mock Data
let settings = {
    globalEnabled: true,
    frequency: 'weekly',
    time: '16:00',
    portfolios: [
        { id: 1, name: '내 포트폴리오', threshold: 5, enabled: true },
        { id: 2, name: '배당주 포트폴리오', threshold: 10, enabled: false },
        { id: 3, name: '성장주 전략', threshold: 5, enabled: true }
    ]
};

export function init() {
    console.log('[Notification Settings] Init called');
}

export function start() {
    console.log('[Notification Settings] Start called');

    const backBtn = document.getElementById('noti-settings-back-btn');
    const globalToggle = document.getElementById('global-noti-toggle');
    const timeRow = document.getElementById('noti-time-row');

    // Back Button - explicit handler
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Notification Settings] Back button clicked');
            goBack();
        };
    }

    // Global Toggle
    if (globalToggle) {
        globalToggle.checked = settings.globalEnabled;
        updateDetailSettingsVisibility(settings.globalEnabled);

        globalToggle.onchange = (e) => {
            settings.globalEnabled = e.target.checked;
            updateDetailSettingsVisibility(settings.globalEnabled);
        };
    }

    // Frequency Radios
    const radios = document.getElementsByName('noti-frequency');
    radios.forEach(radio => {
        if (radio.value === settings.frequency) radio.checked = true;
        radio.onchange = (e) => {
            if (e.target.checked) settings.frequency = e.target.value;
        };
    });

    // Time Picker
    if (timeRow) {
        const timeValue = document.getElementById('noti-time-value');
        if (timeValue) timeValue.textContent = `${settings.time} ▼`;

        timeRow.onclick = () => {
            const newTime = prompt('알림 시간을 입력하세요 (예: 09:00)', settings.time);
            if (newTime) {
                settings.time = newTime;
                if (timeValue) timeValue.textContent = `${settings.time} ▼`;
            }
        };
    }

    // Portfolio Settings
    renderPortfolioSettings();

    // Modal
    setupThresholdModal();
}

function updateDetailSettingsVisibility(enabled) {
    const detailContainer = document.getElementById('noti-detail-settings');
    if (!detailContainer) return;

    detailContainer.style.opacity = enabled ? '1' : '0.3';
    detailContainer.style.pointerEvents = enabled ? 'auto' : 'none';
}

function renderPortfolioSettings() {
    const listEl = document.getElementById('portfolio-settings-list');
    if (!listEl) return;

    listEl.innerHTML = settings.portfolios.map(pf => `
        <div class="settings-item">
            <div class="pf-info">
                <span class="pf-name">${pf.name}</span>
                <button class="pf-threshold-btn" data-pf-id="${pf.id}">변동 ${pf.threshold}%</button>
            </div>
            <label class="toggle-switch small">
                <input type="checkbox" ${pf.enabled ? 'checked' : ''} data-pf-toggle="${pf.id}">
                <span class="toggle-slider"></span>
            </label>
        </div>
    `).join('');

    // Attach listeners
    listEl.querySelectorAll('.pf-threshold-btn').forEach(btn => {
        btn.onclick = () => openThresholdModal(parseInt(btn.dataset.pfId));
    });

    listEl.querySelectorAll('[data-pf-toggle]').forEach(checkbox => {
        checkbox.onchange = () => {
            const pf = settings.portfolios.find(p => p.id === parseInt(checkbox.dataset.pfToggle));
            if (pf) pf.enabled = checkbox.checked;
        };
    });
}

let currentEditPfId = null;

function openThresholdModal(id) {
    currentEditPfId = id;
    const pf = settings.portfolios.find(p => p.id === id);
    if (!pf) return;

    const modal = document.getElementById('threshold-modal');
    const slider = document.getElementById('threshold-slider');
    const display = document.getElementById('threshold-value-display');

    if (slider) slider.value = pf.threshold;
    if (display) display.textContent = `${pf.threshold}%`;
    if (modal) modal.style.display = 'flex';
}

function setupThresholdModal() {
    const modal = document.getElementById('threshold-modal');
    const closeBtn = document.getElementById('threshold-close-btn');
    const saveBtn = document.getElementById('threshold-save-btn');
    const slider = document.getElementById('threshold-slider');
    const display = document.getElementById('threshold-value-display');

    if (slider) {
        slider.oninput = (e) => {
            if (display) display.textContent = `${e.target.value}%`;
        };
    }

    const closeModal = () => {
        if (modal) modal.style.display = 'none';
        currentEditPfId = null;
    };

    if (closeBtn) closeBtn.onclick = closeModal;

    if (saveBtn) {
        saveBtn.onclick = () => {
            if (currentEditPfId !== null && slider) {
                const pf = settings.portfolios.find(p => p.id === currentEditPfId);
                if (pf) {
                    pf.threshold = parseInt(slider.value);
                    renderPortfolioSettings();
                }
            }
            closeModal();
        };
    }
}
