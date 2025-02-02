chrome.storage.local.get('spotify_signed_in', (data) => {
  if (data.signed_in) {
    chrome.action.setPopup({popup: 'popup/popup.html'});
  } else {
    chrome.action.setPopup({popup: 'popup/popup_login.html'});
  }
});