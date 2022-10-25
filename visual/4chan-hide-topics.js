// ==UserScript==
// @name        Hide topics from catalog - 4chan.org
// @namespace   Violentmonkey Scripts
// @match       *://boards.4channel.org/*/catalog
// @version     1.0
// ==/UserScript==


window.addEventListener("load", function () {
    const topics = [] // e.g. ["sdg", "dmp"]
    const data = document.getElementsByClassName("teaser")

    for (let i = 0; i < data.length; ++i) {
        let inner_txt = data[i].innerText
        for (let j = 0; j < topics.length; ++j) {
            let topic_str = "/" + topics[j] + "/"
            if (inner_txt.includes(topic_str)) {
                data[i].offsetParent.style.display = "none"
            }
        }
    }
})

