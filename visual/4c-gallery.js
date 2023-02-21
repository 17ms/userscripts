// ==UserScript==
// @name        Draggable gallery for media
// @namespace   Violentmonkey Scripts
// @author      17ms
// @match       *://boards.4chan*.org/*/thread/*
// @exclude     *://boards.4chan*.org/*/catalog
// @version     1.0
// ==/UserScript==

// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// Decrease frame size, increase frame size, previous image, next image, toggle frame visibility, go to the source hash
const keybindings = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Escape", "Tab"]
const excludeWebm = true

const dragElement = (elem) => {
  const handler = (e) => {
    e = e || window.event
    e.preventDefault()
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragger
    document.onmousemove = enableDragger
  }

  const enableDragger = (e) => {
    e = e || window.event
    e.preventDefault()
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    elem.style.top = (elem.offsetTop - pos2) + "px"
    elem.style.left = (elem.offsetLeft - pos1) + "px"
  }

  const closeDragger = () => {
    document.onmouseup = null
    document.onmousemove = null
  }

  let pos1, pos2, pos3, pos4

  if (document.getElementsByClassName("drDrag").length > 0) {
    document.getElementsByClassName("drDrag")[0].onmousedown = handler
  } else {
    elem.onmousedown = handler
  }
}

const prevImg = () => {
  if (i === 0) {
    i = sources.length - 1
  } else {
    i--
  }

  galleryElem.src = sources[i]
}

const nextImg = () => {
  if (i === sources.length - 1) {
    i = 0
  } else {
    i++
  }

  galleryElem.src = sources[i]
}

// could probably be improved with proper css
const sizeUp = () => {
  const e = document.getElementById("drGallery")
  const newW = e.clientWidth + 100
  const newH = e.clientHeight + 90

  if (newW > window.innerWidth || newH > window.innerHeight) {
    return
  }

  document.getElementById("drGallery").style.width = newW + "px"
  document.getElementById("drGallery").style.height = newH + "px"
}

const sizeDown = () => {
  const e = document.getElementById("drGallery")
  const newW = e.clientWidth - 100
  const newH = e.clientHeight - 90

  if (newW < 265 || newH < 240) {
    return
  }

  document.getElementById("drGallery").style.width = newW + "px"
  document.getElementById("drGallery").style.height = newH + "px"
}

const moveToHash = () => {
  const hash = parentHashes[i]
  const url = window.location.href.split("#")[0]

  window.location.href = url + hash
}

const keyDownEvent = async (e) => {
  if (!(e.ctrlKey && e.altKey)) {
    return
  }

  if (e.key === keybindings[0]) {
    sizeDown(document.getElementById("drGallery"))
  } else if (e.key === keybindings[1]) {
    sizeUp(document.getElementById("drGallery"))
  } else if (e.key === keybindings[2]) {
    prevImg()
  } else if (e.key === keybindings[3]) {
    nextImg()
  } else if (e.key === keybindings[4]) {
    document.getElementById("drGallery").toggleAttribute("hidden")
  } else if (e.key === keybindings[5]) {
    moveToHash()
  }
}

const createElements = () => {
  const limitElem = document.getElementsByClassName("boardBanner")[0]
  const newNode = document.createElement("div")
  newNode.innerHTML = `<div hidden id="drGallery">
  <div id="drHeader" class="drag drDrag">Gallery</div>
  <div id="drContainer"><img id="drImg" src="" alt="" /></div>
</div>`

  const stylesheet = document.createElement("style")
  stylesheet.innerText = `#drGallery {
  position: absolute;
  z-index: 9;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  width: 265px;
  height: 240px;
  min-width: 265px;
  min-height: 240px;
  max-width: 100%;
  max-height: 100%;
  margin: 0px;
}

#drHeader {
  z-index: 10;
  min-height: max-content;
  max-height: max-content;
  padding: 5px;
  cursor: move;
}

#drContainer {
  width: inherit;
  height: 85%;
  position: relative;
}

#drContainer img {
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}`

  document.head.appendChild(stylesheet)
  document.body.insertBefore(newNode, limitElem)
}

const collectSources = () => {
  let sources = []
  let parentHashes = []

  const fileDivs = document.getElementsByClassName("fileThumb")
  const hashPrefix = document.getElementsByClassName("postNum")[0].children[0].hash.slice(0, 3)

  for (let e of fileDivs) {
    const s = e.href.split(".")
    const filetype = s[s.length - 1]

    if (excludeWebm && filetype === "webm") {
      return
    }

    // div's id to post's hash (prefix x): fT12345678 => #px12345678
    parentHashes.push(hashPrefix + e.parentElement.id.slice(2))
    sources.push(e.href)
  }

  return [sources, parentHashes]
}

createElements()

let i = 0
const [sources, parentHashes] = collectSources()
const galleryElem = document.getElementById("drImg")
document.addEventListener("keyup", keyDownEvent, false)
dragElement(document.getElementById("drGallery"))
