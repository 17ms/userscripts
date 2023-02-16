// ==UserScript==
// @name        General media expander
// @namespace   Violentmonkey Scripts
// @match       *://boards.4channel.org/*/thread/*
// @match       *://boards.4chan.org/*/thread/*
// @version     1.0
// ==/UserScript==

window.toggleImgs = () => {
  const data = document.getElementsByClassName("fileThumb")

  for (let i = 0; i < data.length; ++i) {
    let img_data = data[i].getElementsByTagName("img")
    if (img_data[0].className === "fileDeletedRes retina") {
      continue
    } else if (img_data.length === 1) {
      ImageExpansion.expand(img_data[0])
    } else {
      ImageExpansion.contract(img_data[1])
    }
  }
}

const parentElem = document.getElementsByClassName("navLinks desktop")[0]
parentElem.innerHTML += " [<a href='javascript:toggleImgs()'>Toggle</a>]"
