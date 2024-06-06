
function applyGrayscaleFilter(tab) {
    let url;
    
    try {
        url = new URL(tab.url);
    } catch (e) {
        console.error('[applyGrayscaleFilter] Invalid URL:', tab.url);
        return;
    }
    
    const domain = url.hostname.replace('www.', ''); // Normalize domain by removing 'www.'
    console.log('[applyGrayscaleFilter] Checking domain:', domain);
    
    executeGrayscaleScript(tab.id, domain);
}

function executeGrayscaleScript(tabId, domain) {
    chrome.storage.sync.get(['websites'], (result) => {
        const websites = result.websites || [];
        console.log('[executeGrayscaleScript] Checking domain:', domain);
        
        if (websites.includes(domain)) {
            console.log('[executeGrayscaleScript] Applying grayscale to:', domain);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: setGrayscaleFilter
            }).catch((error) => {
                console.error('Error applying grayscale filter:', error);
            });
        }
    });
}

function setGrayscaleFilter() {
    console.log('[setGrayscaleFilter] Setting grayscale filter');
    document.documentElement.style.filter = 'grayscale(100%)';
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('[onUpdated] Tab updated:', tab.url);
        applyGrayscaleFilter(tab);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            console.log('[onActivated] Tab opened:', tab.url);
            applyGrayscaleFilter(tab);
        }
    });
});
