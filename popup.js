document.getElementById('capture').addEventListener('click', async () => {
  console.log('Capture button clicked');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('Active tab:', tab);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      chrome.runtime.sendMessage({ action: 'capture' });
    }
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Script executed', results);
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'capture') {
    console.log('capture message received');
    chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
      console.log('Screenshot data URL:', dataUrl);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'screenshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});
