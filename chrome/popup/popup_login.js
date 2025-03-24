const loginButton = document.querySelector('.button-login')
loginButton.onclick = spotifyLogin

/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code with PKCE oAuth2 flow to authenticate 
 * against the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

const clientId = 'd55c5232e8314566b049513880278f25'; // your clientId
// const redirectUrl = 'chrome-extension://pkidmepdbeebekgibehcihcifjjmejjd/popup/popup_login.htmlx';        // your redirect URL - must be localhost URL and/or HTTPS
const redirectUrl = chrome.identity.getRedirectURL()
console.log(redirectUrl)
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email streaming app-remote-control user-read-playback-state user-modify-playback-state';

// Data structure that manages the current active token, caching it in localStorage
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
    chrome.storage.local.set({
      access_token: access_token
    })

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    localStorage.setItem('expires', expiry);
  }
};


async function getAuthURL () {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  window.localStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint)
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString()
}

// Soptify API Calls
async function getToken(code) {
  const code_verifier = localStorage.getItem('code_verifier');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier,
    }),
  });

  return await response.json();
}

async function refreshToken() {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token
    }),
  });

  return await response.json();
}

/**
 * Function called by the login button
 */
async function spotifyLogin() {
  console.log("login")
  loginWithChromeIdentity()
}


// use chrome.identity
async function loginWithChromeIdentity() {
  const authURL = await getAuthURL()
  return chrome.identity.launchWebAuthFlow(
    {
      interactive: true,
      url: authURL,
    },
    responseURL => resolve(responseURL)
  );
}

// retrieve auth tokens from response URL
async function resolve(responseURL) {
  // On page load, try to fetch auth code from responseUrl string
  const uu = new URL(responseURL);
  const code = uu.searchParams.get("code");
  console.log(code)

  // If we find a code, we're in a callback, do a token exchange
  const token = await getToken(code);
  currentToken.save(token);
  console.log(token)

  // Remove code from URL so we can refresh correctly.
  const url = new URL(responseURL);
  url.searchParams.delete("code");

  await chrome.storage.local.set({
    spotify_signed_in: true
  })

  chrome.action.setPopup({popup: 'popup/popup.html'});
  window.close()
}