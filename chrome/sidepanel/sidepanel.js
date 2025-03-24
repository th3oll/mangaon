
(async () => {
  const rootDiv = document.getElementById("root_div");

  // get current reading info from storage
  const result = await chrome.storage.local.get(["currentReading"])
  console.log(result)
  const currentReading = result.currentReading
  console.log(currentReading)

  const mangaNameTextElement = document.createElement("h2")
  mangaNameTextElement.innerText = currentReading.title

  const chapterTextElement = document.createElement("p")
  chapterTextElement.innerText = `${currentReading.chapter} / P. ${currentReading.pageNum}`

  rootDiv.append(mangaNameTextElement)
  rootDiv.append(chapterTextElement)

  // layout for creating a playlist
  const createPlaylistButton = document.createElement("button")
  createPlaylistButton.innerText = "Create Playlist"
  rootDiv.append(createPlaylistButton)

  // layout for adding a song to the playlist
  // browse a song from spotify
  const addSongButton = document.createElement("button")
  addSongButton.innerText = "Add Song"
  rootDiv.append(addSongButton)
  

})();