// Screen Navigation
function navigateTo(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  
  // Hide any open modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

// Modal Control
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// Chip Selection
document.querySelectorAll('.chip-group .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });
});

// Color Picker Selection
document.querySelectorAll('.color-picker .color-option').forEach(color => {
  color.addEventListener('click', () => {
    color.parentElement.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
    color.classList.add('selected');
  });
});

// Radio Option Selection
document.querySelectorAll('.radio-option').forEach(option => {
  option.addEventListener('click', () => {
    option.parentElement.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    option.querySelector('input[type="radio"]').checked = true;
  });
});

// Number Input Controls
document.querySelectorAll('.number-input').forEach(container => {
  const input = container.querySelector('input[type="number"]');
  const minusBtn = container.querySelector('.num-btn:first-child');
  const plusBtn = container.querySelector('.num-btn:last-child');
  
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value) || 0;
      if (currentValue > 0) {
        input.value = currentValue - 1;
        updateEstimatedAmount(input);
      }
    });
  }
  
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value) || 0;
      input.value = currentValue + 1;
      updateEstimatedAmount(input);
    });
  }
});

// Update estimated amount when quantity changes
function updateEstimatedAmount(input) {
  const container = input.closest('.modal-body');
  if (container) {
    const quantity = parseInt(input.value) || 0;
    const price = 186500; // 예시 가격
    const estimated = container.querySelector('.estimated');
    if (estimated) {
      estimated.textContent = `예상 금액: ₩${(quantity * price).toLocaleString()}`;
    }
  }
}

// Range Slider Value Display
document.querySelectorAll('.ratio-slider').forEach(slider => {
  const valueDisplay = slider.parentElement.querySelector('.slider-value');
  slider.addEventListener('input', () => {
    if (valueDisplay) {
      valueDisplay.textContent = slider.value + '%';
    }
  });
});

// Stock Detail (for future expansion)
function showStockDetail(stockName) {
  console.log('Stock selected:', stockName);
  // Could open a detail modal here
}

// Haptic Feedback Simulation (visual feedback)
document.querySelectorAll('button, .portfolio-card, .stock-row, .result-item').forEach(element => {
  element.addEventListener('mousedown', () => {
    element.style.transform = element.style.transform ? 
      element.style.transform.replace('scale(0.98)', 'scale(0.96)') : 
      'scale(0.98)';
  });
  
  element.addEventListener('mouseup', () => {
    setTimeout(() => {
      element.style.transform = '';
    }, 100);
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = '';
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('UI Prototype loaded');
  console.log('Available screens: login, profile, home, detail, search, rebalance, settings');
});
