const SECRET = ""; // only I know this =)
const TIME_CHUNCK = 5000;
const URI = "https://walk2watch.netlify.app";
const WATCH_TIME_URI = `${URI}/.netlify/functions/watch-time`;
const YOUTUBE_WATCH_URI = "https://www.youtube.com/watch";
let intervalId;

function redirect() {
  console.log("Redirecting to", URI);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { url: URI });
  });
}

function stopWatching() {
  console.log("Stop watching");

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

async function startWatching() {
  console.log("Start watching");

  if (intervalId) return;

  const { watchtimeLeft } = await fetch(WATCH_TIME_URI).then((res) =>
    res.json()
  );

  console.log("Watchtime left", watchtimeLeft);

  if (watchtimeLeft === 0) {
    redirect();
  }

  intervalId = setInterval(async () => {
    const { watchtimeLeft } = await fetch(WATCH_TIME_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Secret": SECRET,
      },
      body: JSON.stringify({
        ms: TIME_CHUNCK,
        datetime: new Date(),
      }),
    }).then((res) => res.json());

    console.log("Watchtime left", watchtimeLeft);

    if (watchtimeLeft === 0) {
      stopWatching();
      redirect();
    }
  }, TIME_CHUNCK);
}

const isYouTubeTab = (tab) => tab.url.includes(YOUTUBE_WATCH_URI);

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  if (isYouTubeTab(tab)) {
    startWatching();
  } else {
    stopWatching();
  }
});
