function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function extractDomain(url) {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
}

function injectContentScript(tabId) {
    chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error injecting content script:', chrome.runtime.lastError.message);
        } else {
            console.log('[background.js] Content script injected into tab:', tabId);
        }
    });
}

function checkAndInject(tabId, url) {
    if (!isValidUrl(url)) {
        console.error('[background.js] Invalid URL:', url);
        return;
    }

    const domain = extractDomain(url);
    console.log('[background.js] Checking domain:', domain);

    chrome.storage.sync.get(['websites'], (result) => {
        const websites = result.websites || [];
        if (websites.includes(domain)) {
            console.log('[background.js] Domain is blacklisted:', domain);
            injectContentScript(tabId);
        } else {
            console.log('[background.js] Domain is not blacklisted:', domain);
        }
    });
}

//tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('[background.js] Tab updated:', tab.url);
        checkAndInject(tabId, tab.url);
    }
});

//tab activations
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            console.log('[background.js] Tab activated:', tab.url);
            checkAndInject(tab.id, tab.url);
        }
    });
});
