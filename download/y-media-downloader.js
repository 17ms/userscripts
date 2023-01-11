// ==UserScript==
// @name        General media downloader
// @namespace   Violentmonkey Scripts
// @match       *://ylilauta.org/*
// @version     1.0
// ==/UserScript==

function download(url) {
  fetch(url, {
    mode: "no-cors"
  })
    .then((response) => response.blob())
    .then((blob) => {
      let blob_url = window.URL.createObjectURL(blob)
      let a = document.createElement("a")
      a.download = url.split("/")[5]
      a.href = blob_url
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
}

function init() {
  const links = Array.from(document.getElementsByClassName("jpg")).concat(
    Array.from(document.getElementsByClassName("png"))
  )

  for (let i = 0; i < links.length; ++i) {
    let url = links[i].href
    download(url)
  }
}

const activate_link = document.createElement("button")
const parent_element = document.getElementById("navbar")
activate_link.innerText = "⮶"
activate_link.style.fontSize = "30px"
activate_link.onclick = () => init()
parent_element.append(activate_link)
