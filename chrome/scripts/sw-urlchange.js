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

// fetch new playlist when chapter is changed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "chapterChange") {
    console.log("Chapter change")
    fetch('http://192.168.0.240:3000/getPlaylists/242e1c32-5a21-4de7-8816-892a8986153b')
      .then(response => response.json())
      .then(data => {
        sendResponse({playlist: data[0]});
      });
    return true; // Will respond asynchronously
  }
}
);
