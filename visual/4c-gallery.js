// ==UserScript==
// @name        Draggable gallery for media
// @namespace   Violentmonkey Scripts
// @author      17ms
// @match       *://boards.4chan*.org/*/thread/*
// @exclude     *://boards.4chan*.org/*/catalog
// @version     1.0
// ==/UserScript==

/* 
Keybindings:
  - Changing images: Ctrl + Alt + Left/Right
  - Resizing the frame: Ctrl + Alt + Up/Down
*/

// TODO: dl & source buttons, webm exclusion, frame toggling, maybe better styling

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

// couldn't work resizing out in css so decided to use this ugly js solution
const sizeUp = () => {
  const e = document.getElementById("drGallery")
  const newW = e.clientWidth + 100
  const newH = e.clientHeight + 90

  if (newW > window.innerWidth || newH > window.innerHeight) {
    return;
  }

  document.getElementById("drGallery").style.width = newW + "px"
  document.getElementById("drGallery").style.height = newH + "px"
}

const sizeDown = () => {
  const e = document.getElementById("drGallery")
  const newW = e.clientWidth - 100
  const newH = e.clientHeight - 90

  if (newW < 265 || newH < 240) {
    return;
  }

  document.getElementById("drGallery").style.width = newW + "px"
  document.getElementById("drGallery").style.height = newH + "px"
}

// TODO: implement downloader
//const dlImage = () => { }

const keyDownEvent = (e) => {
  if (!(e.ctrlKey && e.altKey)) {
    return;
  }

  if (e.key === "ArrowDown") {
    sizeDown(document.getElementById("drGallery"))
  } else if (e.key === "ArrowUp") {
    sizeUp(document.getElementById("drGallery"))
  } else if (e.key === "ArrowLeft") {
    prevImg()
  } else if (e.key === "ArrowRight") {
    nextImg()
  }
}

const limitElem = document.getElementsByClassName("boardBanner")[0]
const newNode = document.createElement("div")
newNode.innerHTML = `<div id="drGallery">
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

let i = 0
let sources = []
const elems = document.getElementsByClassName("fileThumb")

for (let e of elems) {
  sources.push(e.href)
}

const galleryElem = document.getElementById("drImg")
document.addEventListener("keydown", keyDownEvent, false)
dragElement(document.getElementById("drGallery"))
