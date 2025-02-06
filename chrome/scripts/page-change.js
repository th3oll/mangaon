// play a track through spotify api
async function play (trackId, offset) {
  // const token = localStorage.getItem("access_token")
  const result = await chrome.storage.local.get("access_token")
  console.log(result)
  token = result.access_token
  console.log(token)

  fetch('https://api.spotify.com/v1/me/player/play',{
    method:"PUT",
    body:JSON.stringify({
      uris: [trackId],
      position_ms: offset
    }),
    headers:{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => console.log(data))
}

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
    const res = await fetch('http://localhost:3000/getPlaylists/242e1c32-5a21-4de7-8816-892a8986153b')
    const data = await res.json()
    console.log(data)
    const playlist = data[0]
    await chrome.storage.local.set({
      currentPlaylist: playlist
    })
  }
  else {
    const result = await chrome.storage.local.get(["currentPlaylist"])
    const playlist = result.currentPlaylist
    console.log(playlist)
  }
  
  // TODO: Set active device before calling play function
  play("spotify:track:2vb6W84Ou6fYJACj5fXZPK", 0)

  // switch song if at a checkpoint
  if(false) {
    console.log("switch song")
  }

})();