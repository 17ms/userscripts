// ==UserScript==
// @name        Draggable gallery for media
// @namespace   Violentmonkey Scripts
// @author      17ms
// @match       *://boards.4chan*.org/*/thread/*
// @exclude     *://boards.4chan*.org/*/catalog
// @version     1.0
// ==/UserScript==

// TODO: buttons: dl & source, kb shortcuts, improved resizing, webm exclusion

const dragElement = (elem) => {
  const dragMouseDown = (e) => {
    e = e || window.event
    e.preventDefault()
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }

  const elementDrag = (e) => {
    e = e || window.event
    e.preventDefault()
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    elem.style.top = (elem.offsetTop - pos2) + "px"
    elem.style.left = (elem.offsetLeft - pos1) + "px"
  }

  const closeDragElement = () => {
    document.onmouseup = null
    document.onmousemove = null
  }

  let pos1, pos2, pos3, pos4

  if (document.getElementsByClassName("drDrag").length > 0) {
    document.getElementsByClassName("drDrag")[0].onmousedown = dragMouseDown
  } else {
    elem.onmousedown = dragMouseDown
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

const limiter = document.getElementsByClassName("boardBanner")[0]
const newNode = document.createElement("div")
newNode.innerHTML = `<div id="drGallery" class="extPanel reply">
  <div id="drHeader" class="drag drDrag">Gallery</div>
  <div id="drContainer">
    <img id="drImg" src="" alt="" />
  </div>
  <div id="drHeader">
    <button id="drPrev">\<</button>
    <button id="drNext">\></button>
  </div>
</div>`

const styleSheet = document.createElement("style")
styleSheet.innerText = `#drGallery {
  position: absolute;
  z-index: 9;
  text-align: center;
}

#drHeader {
  font-weight: bold;
  text-align: center;
  height: 20px;
  padding: 5px;
}

#drContainer {
  resize: both;
  overflow: auto;
  min-width: 100px;
  min-height: 100px;
  max-width: 100%;
  max-height: 100%;
}

#drContainer img {
  max-width: 100%;
  max-height: 100%;
}

#drButton {
  padding: 5px;
}`

document.head.appendChild(styleSheet)
document.body.insertBefore(newNode, limiter)

let i = 0
let sources = []
const elems = document.getElementsByClassName("fileThumb")

for (let e of elems) {
  sources.push(e.href)
}

const galleryElem = document.getElementById("drImg")

document.getElementById("drPrev").onclick = () => prevImg()
document.getElementById("drNext").onclick = () => nextImg()
dragElement(document.getElementById("drGallery"))
