// =================================================================
// Stock-Keeper UI Prototype V3 - Main App
// Modular structure with dynamic screen loading
// =================================================================

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllScreens();
    await loadModals();
    initTheme();
    initNavigation();
    console.log('✅ Stock-Keeper V3 initialized');
});
