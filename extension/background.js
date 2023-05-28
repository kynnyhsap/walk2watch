const TIME_CHUNCK = 5000;
const URI = "https://walk2watch.netlify.app";
const WATCH_TIME_URI = `${URI}/.netlify/functions/watch-time`;

let timeoutId;

function redirect() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { url: URI });
  });
}

async function sendPostRequest() {
  await fetch(WATCH_TIME_URI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ms: TIME_CHUNCK,
      datetime: new Date(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.watchtimeLeft === 0) {
        redirect();
      } else {
        timeoutId = setTimeout(sendPostRequest, TIME_CHUNCK);
      }
    })
    .catch((err) => console.log(err));
}

function sendGetRequest() {
  fetch(WATCH_TIME_URI)
    .then((response) => response.json())
    .then((data) => {
      if (data.watchtimeLeft === 0) {
        redirect();
      } else {
        sendPostRequest();
      }
    })
    .catch(console.error);
}

// chrome.runtime.onInstalled.addListener(sendGetRequest);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("youtube.com")) {
    if (!timeoutId) {
      sendGetRequest();
    }
  }
});
