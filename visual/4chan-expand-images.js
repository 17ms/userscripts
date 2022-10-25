// ==UserScript==
// @name        Expand all images - 4chan.org
// @namespace   Violentmonkey Scripts
// @match       *://boards.4channel.org/*
// @match       *://boards.4chan.org/*
// @version     1.0
// ==/UserScript==


window.toggle_images = function () {
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


const parent_element = document.getElementsByClassName("navLinks desktop")[0]
parent_element.innerHTML += " [<a href='javascript:toggle_images()'>Toggle</a>]"

