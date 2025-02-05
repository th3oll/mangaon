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

  // await chrome.storage.local.get()

  const currentReading = {
    title: title,
    chapter: chapter,
    chapterId: chapterId,
    pageNum: pageNum
  }

  // get old reading info
  const result = await chrome.storage.local.get(["currentReading"])
  const lastCurrentReading = result.currentReading
  
  // store current reading info in local storage
  await chrome.storage.local.set({ currentReading: currentReading })

  // if new chapter started, get new playlist
  if(lastCurrentReading.chapterId !== currentReading.chapterId) {
    console.log("Chapter change")
    // fetch("")
    // .then(res => res.json())
    // .then(data => {
    //   console.log(data)
    // })
  }
  else {
    const result = await chrome.storage.local.get(["currentPlaylist"])
    const playlist = result.currentPlaylist
  }
  
  // switch song if at a checkpoint
  if(false) {
    console.log("switch song")
  }

})();