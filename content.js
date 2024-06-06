chrome.storage.sync.get(['websites'], (result) => {
    const websites = result.websites || [];
    let url;

    try {
        url = new URL(window.location.href);
    } catch (e) {
        console.error('[content.js] Invalid URL:', window.location.href);
        return;
    }

    const domain = url.hostname.replace('www.', ''); // Normalize domain by removing 'www.'
    console.log('[content.js] Checking domain:', domain);

    if (websites.includes(domain)) {
        console.log('[content.js] Applying grayscale to:', domain);
        applyGrayscaleFilter();

        // Set up a MutationObserver to reapply the grayscale filter if it gets removed
        const observer = new MutationObserver(() => {
            if (document.documentElement.style.filter !== 'grayscale(100%)') {
                applyGrayscaleFilter();
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
});

function applyGrayscaleFilter() {
    console.log('[applyGrayscaleFilter] Setting grayscale filter');
    document.documentElement.style.filter = 'grayscale(100%)';
}
