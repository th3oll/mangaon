// get chapter id and page number
(async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
  const substring1 = tab.url.substring(0, (tab.url.lastIndexOf("/")))
  const pageNum = tab.url.substring((tab.url.lastIndexOf("/")+1))
  const chapterId = substring1.substring((substring1.lastIndexOf("/")+1))

  const rootDiv = document.getElementById("root_div");
  // const elements = new Set();

  const chapterIdTextElement = document.createElement("p")
  chapterIdTextElement.innerText = "Chapter ID: " + chapterId


  const pageNumTextElement = document.createElement("p")
  pageNumTextElement.innerText = "Page: " + pageNum

  rootDiv.append(chapterIdTextElement)
  rootDiv.append(pageNumTextElement)
  

  // fetch('http://10.141.5.33:3000/getPlaylists/242e1c32-5a21-4de7-8816-892a8986153b')
  // .then(res => res.json())
  // .then(data => console.log(data))

})();

function createSoundHtml(){
  chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('audio.html'),
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'notification',
  });
}