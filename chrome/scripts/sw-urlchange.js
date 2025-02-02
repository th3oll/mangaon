console.log("sw-urlchange")

// inject page-change content script to tab when url is changed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // only when url is changed on a chapter page
  if (changeInfo.url) { 
    if(changeInfo.url.match("mangadex.org/chapter")){
      chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ['scripts/page-change.js'],
        }
      );
    }
  }
});

// get manga name and chapter from content script
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     // console.log(sender.tab ?
//     //             "from a content script:" + sender.tab.url :
//     //             "from the extension")
//     sendResponse({accepted: "sw-urlchange"})

//     // store current reading info in local storage
//     chrome.storage.local.set({ currentReading: request })
//     .then(console.log("storage set!"))
//   }
  
// );