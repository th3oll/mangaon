(async () => {

  const rootDiv = document.getElementById("root_div");
  // const elements = new Set();

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