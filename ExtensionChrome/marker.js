let counter = 0
let flag = true
let c = ''
var selection = ''
if (document.body.getAttribute('ids') == null)
    document.body.setAttribute('ids', '')

document.addEventListener('selectionchange', () => {
    if (window.getSelection().toString().length > 10)
        flag = false
})


document.addEventListener('mouseup', () => {
    if (flag === false) {
        let id = counter
        selection = window.getSelection()
        range = selection.getRangeAt(0)
        c = range.cloneContents()
        range.deleteContents()
        range.insertNode(c)
        let html = range.commonAncestorContainer.innerHTML
        if (selection.toString().length < 10) return
        html = html.replace(/(<[^>]+>)/, '').split(selection.toString()).join(`<span id='COLOR-ANOTE-${id}'><input type="color" id='PICKER-ANOTE-${id}' style="display:hidden;"><input type='text' id="COMMENT-ANOTE-${id}" style="display:hidden;"><button id="BUTTON-ANOTE-${id}" style="display:hidden;">Remove</button>${selection.toString()}</span>`)
        range.commonAncestorContainer.innerHTML = html
        document.querySelector(`#PICKER-ANOTE-${id}`).addEventListener('input', (e) => {
            {
                let spaned = document.querySelector(`#COLOR-ANOTE-${id}`)
                spaned.style.background = document.querySelector(`#PICKER-ANOTE-${id}`).value
            }
        })
        document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseover", function() {
            document.querySelector(`#PICKER-ANOTE-${id}`).style.display = "block";
            document.querySelector(`#BUTTON-ANOTE-${id}`).style.display = "block";
            document.querySelector(`#COMMENT-ANOTE-${id}`).style.display = "block";
        })
        document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseout", function() {
            document.querySelector(`#PICKER-ANOTE-${id}`).style.display = "none";
            document.querySelector(`#BUTTON-ANOTE-${id}`).style.display = "none";
            document.querySelector(`#COMMENT-ANOTE-${id}`).style.display = "none";
        })
        document.body.setAttribute('ids', `${id},` +
            document.body.getAttribute('ids')
        )
        document.querySelector(`#BUTTON-ANOTE-${id}`).addEventListener("click", function() {
            document.querySelector(`#COLOR-ANOTE-${id}`).replaceWith(document.querySelector(`#COLOR-ANOTE-${id}`).innerText)
            ids = document.body.getAttribute('ids').split(',').filter((x) => x != `${id}`).join(',')
            document.body.setAttribute('ids', ids)
        })
        counter++
        flag = true
    }
})