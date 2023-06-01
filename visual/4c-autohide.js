// ==UserScript==
// @name        4c-autohide
// @description Keyword based thread hider
// @author      17ms
// @license     MIT License
// @namespace   Violentmonkey Scripts
// @match       *://boards.4chan*.org/*/catalog
// @version     1.0
// ==/UserScript==

window.addEventListener("load", () => {
    const keywords = [] // e.g. ["/sdg/", "luke smith"]
    const data = document.getElementsByClassName("teaser")

    for (let i = 0; i < data.length; ++i) {
        let innerText = data[i].innerText
        for (let j = 0; j < keywords.length; ++j) {
            if (innerText.includes(keywords[j]) && data[i].offsetParent !== null) {
                data[i].offsetParent.style.display = "none"
            }
        }
    }
})
