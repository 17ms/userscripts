// ==UserScript==
// @name        Expand all images - ylilauta.org
// @namespace   Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version     1.0
// ==/UserScript==

function toggle_images() {
  const media_jpg = document.querySelectorAll("a.jpg")
  const media_png = document.querySelectorAll("a.png")

  for (let i = 0; i < media_jpg.length; ++i) {
    media_jpg[i].click()
  }

  for (let i = 0; i < media_png.length; ++i) {
    media_png[i].click()
  }
}

const activate_link = document.createElement("button")
const parent_element = document.getElementById("navbar")
activate_link.innerText = "Toggle"
activate_link.style.fontSize = "9px"
activate_link.onclick = () => toggle_images()
parent_element.append(activate_link)
