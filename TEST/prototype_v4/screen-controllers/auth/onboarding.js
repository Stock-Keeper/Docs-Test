// =================================================================
// Screen Controller: Onboarding (온보딩)
// =================================================================

import { navigateTo } from '../../core/navigation.js';

let currentSlide = 0;
const totalSlides = 4;
let startX = 0;
let isDragging = false;

// =================================================================
// INITIALIZATION
// =================================================================

export async function init() {
    console.log('🚀 Onboarding Controller Initialized');

    // Reset state
    currentSlide = 0;
    updateSlideDisplay();

    // Add Event Listeners
    attachEventListeners();
}

function attachEventListeners() {
    // Navigation Buttons
    const prevBtn = document.querySelector('.nav-prev');
    const skipBtn = document.querySelector('.nav-skip');

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (skipBtn) skipBtn.addEventListener('click', handleSkipOrStart);

    // Indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(ind => {
        ind.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            goToSlide(slideIndex);
        });
    });

    // Swipe Support (Touch & Mouse)
    const container = document.querySelector('.slides-wrapper');
    if (container) {
        // Touch events
        container.addEventListener('touchstart', (e) => handleTouchStart(e));
        container.addEventListener('touchend', (e) => handleTouchEnd(e));

        // Mouse events (for desktop testing)
        container.addEventListener('mousedown', (e) => handleMouseDown(e));
        container.addEventListener('mouseup', (e) => handleMouseUp(e));
    }
}

// =================================================================
// SLIDE LOGIC
// =================================================================

function updateSlideDisplay() {
    // 1. Update Slides
    const slides = document.querySelectorAll('.onboarding-slide');
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
            slide.style.opacity = '1';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        }
    });

    // 2. Update Indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((ind, index) => {
        if (index === currentSlide) {
            ind.classList.add('active');
        } else {
            ind.classList.remove('active');
        }
    });

    // 3. Update Navigation Buttons
    const prevBtn = document.querySelector('.nav-prev');
    const skipBtn = document.querySelector('.nav-skip');

    // Prev Button Visibility
    if (prevBtn) {
        prevBtn.style.visibility = currentSlide === 0 ? 'hidden' : 'visible';
    }

    // Skip/Start Button Style
    if (skipBtn) {
        if (currentSlide === totalSlides - 1) {
            skipBtn.textContent = '시작하기';
            skipBtn.classList.add('nav-start');
            skipBtn.classList.remove('nav-skip');
        } else {
            skipBtn.textContent = '건너뛰기 →';
            skipBtn.classList.add('nav-skip');
            skipBtn.classList.remove('nav-start');
        }
    }
}

function goToSlide(n) {
    if (n >= 0 && n < totalSlides) {
        currentSlide = n;
        updateSlideDisplay();
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function handleSkipOrStart() {
    // Mark tutorial as complete
    completeOnboarding();
}

// =================================================================
// SWIPE HANDLERS
// =================================================================

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(startX, endX);
}

function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX;
}

function handleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.clientX;
    handleSwipe(startX, endX);
}

function handleSwipe(start, end) {
    const threshold = 50; // Minimum distance to trigger swipe
    const diff = start - end;

    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swiped Left -> Next
            nextSlide();
        } else {
            // Swiped Right -> Prev
            prevSlide();
        }
    }
}

// =================================================================
// NAVIGATION
// =================================================================

function completeOnboarding() {
    // Save state
    localStorage.setItem('isFirstVisit', 'false');

    // Navigate to Login
    navigateTo('login');
}
