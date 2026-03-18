// const delay = (ms: number) => new Promise(r => setTimeout(r, ms))


const autoLogin = async () => {
  console.log('auto login start 🚀')
}

// Listen to the message from the popup
console.log('content script ready 🚀')
console.log("🔥 content script injected")

chrome.runtime.onMessage.addListener((msg) => {
  console.log("📩 received:", msg)
  if (msg.type === "AUTO_LOGIN") {
    console.log("🔥 received event from popup")
    autoLogin()
  }
})