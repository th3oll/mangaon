// function that injects code to a specific tab
function injectScript(tabId) {

  chrome.scripting.executeScript(
      {
          target: {tabId: tabId},
          files: ['scripts/page-change.js'],
      }
  );

}

// adds a listener to tab change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  // check for a URL in the changeInfo parameter (url is only added when it is changed)
  try{  // ignore when url can't be read (i.e. only run on pages with host permission)
    if (changeInfo.url) {
      // calls the inject function
      injectScript(tabId);
    }
  }catch(e) {}
  
});