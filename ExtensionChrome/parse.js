nav = (arr) => {
    let element = document.documentElement.childNodes
    arr.forEach(x => {
        element = element[x].childNodes
    })
    return element
}

//url=https://developer.chrome.com/docs/extensions/reference/action/#W3sicGF0aCI6WzEsMCw1LDEsMSwwLDMsMjZdLCJjb21tZW50IjoiYW5vdGhlciB3cm9uZyIsImNvbG9yIjoiI2QwMjUyNSJ9LHsicGF0aCI6WzEsMCw1LDEsMSwwLDMsMjVdLCJjb21tZW50IjoiUG9wdXBEZWZpbmF0aW9uaXMgV3JvbmciLCJjb2xvciI6IiNlZTNmM2YifSx7InBhdGgiOlsxLDAsNSwxLDEsMCwzLDldLCJjb21tZW50IjoiIiwiY29sb3IiOiIjY2YzYTNhIn1d



mark = (element = '', id = '', color = '', text = '') => {
    if (element == '') return 1
    html = element.innerHTML
    element.innerHTML = `<span id='COLOR-ANOTE-${id}' style="background:${color}" ><input type="color" id='PICKER-ANOTE-${id}' style="display:hidden;"><input type='text' id="COMMENT-ANOTE-${id}" style="display:hidden;" placeholder="${text}"><button id="BUTTON-ANOTE-${id}" style="display:hidden;">Remove</button>${html}</span>`
    document.querySelector(`#PICKER-ANOTE-${id}`).addEventListener('input', (e) => {
        {
            let spaned = document.querySelector(`#COLOR-ANOTE-${id}`)
            spaned.style.background = document.querySelector(`#PICKER-ANOTE-${id}`).value
        }
    })
    document.querySelector(`#COMMENT-ANOTE-${id}`).value = text

    document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseover", function() {
        document.querySelector(`#PICKER-ANOTE-${id}`).style.display = "block"
        document.querySelector(`#BUTTON-ANOTE-${id}`).style.display = "block"
        document.querySelector(`#COMMENT-ANOTE-${id}`).style.display = "block"
    })
    document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseout", function() {
        document.querySelector(`#PICKER-ANOTE-${id}`).style.display = "none"
        document.querySelector(`#BUTTON-ANOTE-${id}`).style.display = "none"
        document.querySelector(`#COMMENT-ANOTE-${id}`).style.display = "none"
    })
    document.body.setAttribute('ids', `${id},` +
        document.body.getAttribute('ids')
    )
    document.querySelector(`#BUTTON-ANOTE-${id}`).addEventListener("click", function() {
        document.querySelector(`#COLOR-ANOTE-${id}`).replaceWith(document.querySelector(`#COLOR-ANOTE-${id}`).innerText)
        ids = document.body.getAttribute('ids').split(',').filter((x) => x != `${id}`).join(',')
        document.body.setAttribute('ids', ids)
    })

}

pieces = document.location.toString().split('#')
encodedPart = pieces[pieces.length - 1]
datas = JSON.parse(window.atob(encodedPart))
datas.forEach(x => {
    elementList = nav(x.path)
    element = elementList[0].parentElement
    mark(element, x.id, x.color, x.comment)

})