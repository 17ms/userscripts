// ==UserScript==
// @name        Hide threads with certain keywords from catalog - 4chan.org
// @namespace   Violentmonkey Scripts
// @match       *://boards.4channel.org/*/catalog
// @match       *://boards.4chan.org/*/catalog
// @version     1.0
// ==/UserScript==

window.addEventListener("load", function () {
  const keywords = [] // e.g. ["/sdg/", "luke smith"]
  const data = document.getElementsByClassName("teaser")

  for (let i = 0; i < data.length; ++i) {
    let inner_txt = data[i].innerText
    for (let j = 0; j < keywords.length; ++j) {
      if (inner_txt.includes(keywords[j]) && data[i].offsetParent !== null) {
        data[i].offsetParent.style.display = "none"
      }
    }
  }
})
