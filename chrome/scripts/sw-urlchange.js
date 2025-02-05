console.log("sw-urlchange")
// handle reading info update when url is changed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // only when url is changed on a chapter page
  if (changeInfo.url) { 
    if(changeInfo.url.match("mangadex.org/chapter")){

      // inject page-change content script to tab 
      chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ['scripts/page-change.js'],
        }
      );
    }
  }
});