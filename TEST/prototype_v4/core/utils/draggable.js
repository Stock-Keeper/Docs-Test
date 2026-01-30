/**
 * Make an element draggable
 * @param {HTMLElement} element - The element to move
 * @param {HTMLElement} handle - The element that triggers the drag
 * @param {string} [persistenceKey] - Optional localStorage key to save position
 */
export function makeDraggable(element, handle, persistenceKey = null) {
    if (!element || !handle) return;

    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    // Restore position if key provided
    if (persistenceKey) {
        restorePosition(element, persistenceKey);
    }

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // Prepare element for movement
        element.style.transition = 'none';
        element.style.transform = 'none';
        element.style.margin = '0';
        element.style.position = 'fixed'; // Ensure it's fixed/absolute

        // Prevent jumping
        element.style.left = `${initialLeft}px`;
        element.style.top = `${initialTop}px`;
        element.style.bottom = 'auto';
        element.style.right = 'auto';

        document.body.style.userSelect = 'none';
        handle.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;

        document.body.style.userSelect = '';
        handle.style.cursor = 'grab';

        if (persistenceKey) {
            savePosition(element, persistenceKey);
        }
    });

    // Handle Cursor
    handle.style.cursor = 'grab';
}

function savePosition(element, key) {
    const position = {
        left: element.style.left,
        top: element.style.top
    };
    localStorage.setItem(key, JSON.stringify(position));
}

function restorePosition(element, key) {
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            const pos = JSON.parse(saved);
            element.style.position = 'fixed';
            element.style.transform = 'none';
            element.style.margin = '0';
            element.style.left = pos.left;
            element.style.top = pos.top;
        } catch (e) {
            console.warn(`Failed to restore position for ${key}`);
        }
    }
}
