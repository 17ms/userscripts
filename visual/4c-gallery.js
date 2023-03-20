// ==UserScript==
// @name        4c-gallery
// @description Draggable image viewer
// @author      17ms
// @license     MIT License
// @namespace   Violentmonkey Scripts
// @match       *://boards.4chan*.org/*/thread/*
// @exclude     *://boards.4chan*.org/*/catalog
// @version     1.3.1
// ==/UserScript==

// Shortcuts: decrease size, increase size, previous image, next image, jump to the source hash (i.e. post)
const keys = ["-", "+", "j", "k", "i"]
const excludeWebm = true // not tested with webms enabled

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
    i = imgs.length - 1
  } else {
    i--
  }

  imgElem.src = imgs[i].src
}

const nextImg = () => {
  if (i === imgs.length - 1) {
    i = 0
  } else {
    i++
  }

  imgElem.src = imgs[i].src
}

const sizeUp = () => {
  const newW = baseElem.clientWidth + 200
  const newH = Math.round(newW * ratioMultiplier)

  if (newW > window.innerWidth) {
    return
  }

  baseElem.style.width = newW + "px"
  baseElem.style.height = newH + "px"
}

const sizeDown = () => {
  const newW = baseElem.clientWidth - 200
  const newH = Math.round(newW * ratioMultiplier)

  if (newW < 265 || newH < 240) {
    return
  }

  baseElem.style.width = newW + "px"
  baseElem.style.height = newH + "px"
}

const moveToHash = () => {
  const hash = sources[i][1]
  const url = window.location.href.split("#")[0]

  window.location.href = url + hash
}

const preloadImgs = async () => {
  for (let s of sources) {
    let img = new Image()
    img.src = s[0]
    await img.decode()
    imgs.push(img)
  }
}

const keyUpEvent = async (e) => {
  if (["input", "textarea"].includes(e.target.tagName.toLowerCase())) {
    return
  }

  if (e.key === keys[0]) {
    sizeDown()
  } else if (e.key === keys[1]) {
    sizeUp()
  } else if (e.key === keys[2]) {
    prevImg()
  } else if (e.key === keys[3]) {
    nextImg()
  } else if (e.key === keys[4]) {
    moveToHash()
  }
}

const createElements = () => {
  const limitElem = document.getElementsByClassName("boardBanner")[0]
  const newNode = document.createElement("div")
  newNode.innerHTML = `<div id="drGallery" class="reply drDrag drag">
  <div id="drHeader">Gallery</div>
  <div id="drContainer"><img id="drImg" src="" alt="" /></div>
</div>`

  const initW = "265px"
  const initH = Math.round(265 * ratioMultiplier) + "px"

  const stylesheet = document.createElement("style")
  stylesheet.innerText = `#drGallery {
  position: absolute;
  z-index: 9;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  width: ${initW};
  height: ${initH};
  min-width: ${initW};
  min-height: ${initH};
  display: none;
  flex-direction: column;
}

#drHeader {
  min-height: max-content;
  padding: 5px;
}

#drContainer {
  width: inherit;
  height: 100%;
  position: relative;
}

#drContainer img {
  max-width: 100%;
  max-height: 98%;
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
  document.getElementsByClassName("navLinks desktop")[0].innerHTML += " [<a href='javascript:toggleGalleryVisibility()'>Gallery</a>]"
}

const collectSources = () => {
  let sources = []

  const fileDivs = document.getElementsByClassName("fileThumb")
  const hashPrefix = document.getElementsByClassName("postNum")[0].children[0].hash.slice(0, 3)

  for (let e of fileDivs) {
    const s = e.href.split(".")
    const filetype = s[s.length - 1]

    if (excludeWebm && filetype === "webm") {
      continue
    }

    // div's id to post's hash (prefix x): fT12345678 => #px12345678
    sources.push([e.href, hashPrefix + e.parentElement.id.slice(2)])
  }

  return sources
}

window.toggleGalleryVisibility = () => {
  if (baseElem.style.display === "flex") {
    baseElem.style.display = "none"
    document.removeEventListener("keyup", keyUpEvent, false)
  } else {
    baseElem.style.display = "flex"
    document.addEventListener("keyup", keyUpEvent, false)
  }
}

const ratioMultiplier = window.innerHeight / window.innerWidth
createElements()

let i = 0
let imgs = []
const sources = collectSources()
preloadImgs().then(() => console.log("4c-gallery: All images loaded"))


const baseElem = document.getElementById("drGallery")
const imgElem = document.getElementById("drImg")
dragElement(baseElem)
