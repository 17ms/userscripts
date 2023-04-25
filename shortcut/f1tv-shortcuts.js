// ==UserScript==
// @name        f1tv-shortcuts
// @description Additional keyboard shortcuts for F1TV
// @author      17ms
// @license     MIT License
// @namespace   Violentmonkey Scripts
// @match       *://f1tv.formula1.com/detail/*
// @version     1.0
// ==/UserScript==

/*
Default bindings:
  "k" play/pause
  "j" 10s rewind
  "l" 10s forward
  "m" mute
  "f" toggle fullscreen
*/

const keys = ["k", "j", "l", "m", "f"]

const wrapperQuery = ".bmpui-container-wrapper"
const playQuery = ".bmpui-ui-playbacktogglebutton"
const muteQuery = ".bmpui-ui-volumetogglebutton"
const rewindQuery = ".bmpui-ui-rewindbutton"
const forwardQuery = ".bmpui-ui-forwardbutton"
const volumeQuery = ".bmpui-ui-volumetogglebutton"
const fullscreenQuery = ".bmpui-ui-fullscreentogglebutton"

const waitInit = (query) => {
  return new Promise((resolve) => {
    if (document.querySelector(query)) {
      return resolve(document.querySelector(query))
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(query)) {
        resolve(document.querySelector(query))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

let play, mute, forward, rewind, volume, fullscreen
waitInit(wrapperQuery).then((w) => {
  console.log("f1tv-shortcuts: Wrapper loaded")
  play = w.querySelector(playQuery)
  mute = w.querySelector(muteQuery)
  rewind = w.querySelector(rewindQuery)
  forward = w.querySelector(forwardQuery)
  volume = w.querySelector(volumeQuery)
  fullscreen = w.querySelector(fullscreenQuery)
})

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case keys[0]:
      play.click()
      break
    case keys[1]:
      rewind.click()
      break
    case keys[2]:
      forward.click()
      break
    case keys[3]:
      volume.click()
      break
    case keys[4]:
      fullscreen.click()
      break
  }
})
