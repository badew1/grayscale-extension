document.addEventListener('DOMContentLoaded', () => {
    const websiteInput = document.getElementById('websiteInput');
    const addButton = document.getElementById('addButton');
    const websitesList = document.getElementById('websites');

    addButton.addEventListener('click', () => {
        const website = websiteInput.value.trim().replace('www.', '');
        if (website) {
            chrome.storage.sync.get(['websites'], (result) => {
                const websites = result.websites || [];
                if (!websites.includes(website)) {
                    websites.push(website);
                    chrome.storage.sync.set({ websites }, updateWebsitesList);
                    websiteInput.value = '';
                }
            });
        }
    });

    function updateWebsitesList() {
        websitesList.innerHTML = '';
        chrome.storage.sync.get(['websites'], (result) => {
            const websites = result.websites || [];
            websites.forEach((website) => {
                const li = document.createElement('li');
                li.textContent = website;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => {
                    const index = websites.indexOf(website);
                    if (index > -1) {
                        websites.splice(index, 1);
                        chrome.storage.sync.set({ websites }, updateWebsitesList);
                    }
                });
                li.appendChild(removeButton);
                websitesList.appendChild(li);

                // ANIMATION
                li.classList.add('added');
                setTimeout(() => {
                    li.classList.remove('added');
                }, 300);
            });
        });
    }

    updateWebsitesList();
});
