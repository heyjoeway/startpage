async function bgFetchText(url, sendResponse) {
    try {
        let response = await fetch(url);
        let text = await response.text();
        sendResponse({ text });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

async function bgFetchDataUrl(url, sendResponse) {
    try {
        let response = await fetch(url);
        let blob = await response.blob();
        let reader = new FileReader();
        reader.onload = () => {
            sendResponse({ dataUrl: reader.result });
        };
        reader.readAsDataURL(blob);
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'fetchText') {
        bgFetchText(message.url, sendResponse);
    } else if (message.type === 'fetchDataUrl') {
        bgFetchDataUrl(message.url, sendResponse);
    }
    return true;
});