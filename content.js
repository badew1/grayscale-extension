function applyGrayscaleFilter() {
    console.log('[content.js] Applying grayscale filter');
    document.documentElement.style.filter = 'grayscale(100%)';
}

applyGrayscaleFilter();


const observer = new MutationObserver(() => {
    if (document.documentElement.style.filter !== 'grayscale(100%)') {
        applyGrayscaleFilter();
    }
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style']
});