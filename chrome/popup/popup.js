const currentToken = {
  get access_token() { return localStorage.getItem('access_token') || null; },
  get refresh_token() { return localStorage.getItem('refresh_token') || null; },
  get expires_in() { return localStorage.getItem('refresh_in') || null },
  get expires() { return localStorage.getItem('expires') || null },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    localStorage.setItem('expires', expiry);
  }
};


async function getUserData() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  });

  return await response.json();
}

// Button clicks
async function logoutClick() {
  localStorage.clear();
  chrome.action.setPopup({popup: 'popup/popup_login.html'});
  window.close();
}

document.getElementById('logout_button').addEventListener('click', logoutClick);

async function sidepanelClick() {
  console.log("sidepanelClick")
  // get the current tab
  let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
  chrome.sidePanel.open(
    { tabId: tab.id }
  )
}

document.getElementById('sidebar_button').addEventListener('click', sidepanelClick);

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

  const data = await getUserData();

  console.log(data)

  const userDiv = document.getElementById("user_div")

  const userTextElement = document.createElement("h3")
  userTextElement.innerText = `Logged in as ${data.display_name}`
  userDiv.prepend(userTextElement)

  const userImageElement = document.createElement("img")
  userImageElement.src = data.images[0].url
  userImageElement.width = 100
  userImageElement.height = 100
  userDiv.prepend(userImageElement)
})();