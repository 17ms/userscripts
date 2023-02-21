// ==UserScript==
// @name        y-image-expander
// @description General media expander
// @namespace   Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version     1.0
// ==/UserScript==

const toggleImages = () => {
  const mediaJpg = document.querySelectorAll("a.jpg")
  const mediaPng = document.querySelectorAll("a.png")

  for (let i = 0; i < mediaJpg.length; ++i) {
    mediaJpg[i].click()
  }

  for (let i = 0; i < mediaPng.length; ++i) {
    mediaPng[i].click()
  }
}

const activateLink = document.createElement("button")
const parentElem = document.getElementById("navbar")
activateLink.innerText = "Toggle"
activateLink.style.fontSize = "9px"
activateLink.onclick = () => toggleImages()
parentElem.append(activateLink)
