// get chapter id and page number
(async () => {
  console.log("Page changed!")
  url = document.URL
  const substring1 = url.substring(0, (url.lastIndexOf("/")))
  const pageNum = url.substring((url.lastIndexOf("/")+1))
  const chapterId = substring1.substring((substring1.lastIndexOf("/")+1))

  console.log(`Chapter: ${chapterId}; Page: ${pageNum}`)
  
  // fetch('http://10.141.5.33:3000/getPlaylists/242e1c32-5a21-4de7-8816-892a8986153b')
  // .then(res => res.json())
  // .then(data => console.log(data))

})();