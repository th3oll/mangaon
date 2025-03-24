// play a track through spotify api
async function play (trackId, offset) {
  // const token = localStorage.getItem("access_token")
  const result = await chrome.storage.local.get("access_token")
  console.log(result)
  token = result.access_token
  console.log(token)

  // Check if user has a active device
  const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const data = await res.json();
  const activeDevice = data.devices.find(device => device.is_active === true);
  if (!activeDevice) {
    // Try to grab the first computer device if no active device is found
    const firstComputerDevice = data.devices.find(device => device.type.toLowerCase() === 'computer');
    if (firstComputerDevice) {
      console.log("No active device found, using first computer device");
      await fetch(`https://api.spotify.com/v1/me/player`, {
        method: "PUT",
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device_ids: [firstComputerDevice.id] })
      });
      // Sleep for a second to allow the device to become active
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.error("No active device found");
      return;
    }
  }
  console.log(data)
      

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
    // const res = await fetch('http://192.168.0.240:3000/getPlaylists/242e1c32-5a21-4de7-8816-892a8986153b')

    // send a message to the background script to get the current playlist

      const response = await chrome.runtime.sendMessage({message: "chapterChange"});
      console.log(response);
      const playlist = response.playlist
      console.log(playlist)
      
      await chrome.storage.local.set({
        currentPlaylist: playlist
      })

    

    // find the first song in the playlist that starts before the current page
    let currentSongIndex = -1
    for (let i = 0; i < playlist.songs.length; i++) {
      if (playlist.songs[i].startPage > pageNum) {
        currentSongIndex = i - 1
        await chrome.storage.local.set({
          currentSongIndex: i - 1
        })
        break
      }
    }

    if(currentSongIndex > -1) {
      play(playlist.songs[currentSongIndex].id, 0)
    }

  }

  // if still in the same chapter, get the current playlist
  else {
    const result = await chrome.storage.local.get(["currentPlaylist"])
    const playlist = result.currentPlaylist
    console.log(playlist)

    // get the index of the current song in the playlist

    const result1 = await chrome.storage.local.get(["currentSongIndex"])
    console.log(result1)
    const currentSongIndex = result1.currentSongIndex
    console.log(currentSongIndex)

    // switch song if at a checkpoint
    if(currentSongIndex < playlist.songs.length - 1 && pageNum >= playlist.songs[currentSongIndex + 1].startPage) {
      console.log("switch song")
      play(playlist.songs[currentSongIndex + 1].id, 0)
      await chrome.storage.local.set({
        currentSongIndex: currentSongIndex + 1
      })
    }
  }
  
  // TODO: Set active device before calling play function
  // play("spotify:track:2vb6W84Ou6fYJACj5fXZPK", 0)



})();