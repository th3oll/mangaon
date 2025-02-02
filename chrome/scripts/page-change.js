// get chapter id and page number
// (content script)
(async () => {
  // get chapter id and page number from the url (for api fetch)
  console.log("Page changed!")
  url = document.URL
  const substring1 = url.substring(0, (url.lastIndexOf("/")))
  const pageNum = url.substring((url.lastIndexOf("/")+1))
  const chapterId = substring1.substring((substring1.lastIndexOf("/")+1))

  console.log(`Chapter: ${chapterId}; Page: ${pageNum}`)

  // get manga name and chapter number (for popup display) from the DOM
  const title = document.querySelector('.reader--header-manga').innerHTML
  const chapter = document.querySelector('.reader--header-title').innerHTML

  const currentReading = {
    title: title,
    chapter: chapter,
    chapterId: chapterId,
    pageNum: pageNum
  }

  // send current reading info to service worker
  // const response = await chrome.runtime.sendMessage(currentReading);
  // console.log(response);

  // store current reading info in local storage
  await chrome.storage.local.set({ currentReading: currentReading })
  
  // fetch('http://10.141.5.33:3000/getPlaylists/242e1c32-5a21-4de7-8816-892a8986153b')
  // .then(res => res.json())
  // .then(data => console.log(data))

})();