nav = (arr) => {
    let element = document.documentElement.childNodes
    arr.forEach(x => {
        element = element[x].childNodes
    })
    return element
}

mainstyle=`display: grid;
    visibility: hidden;
    opacity: 0;
    grid-template-columns: 22px 226px 104px;
    grid-auto-rows: auto;
    position: absolute;
    -webkit-transition: opacity 600ms, visibility 600ms;
    transition: opacity 600ms, visibility 600ms;
        `

common = `
        border: solid #cbc3c3;
        border-radius: 4px;
        background: #e9e9e9;
        `
style1=`${common}
        column: 1;
        width: 25px;
        height: 25px;
        `
style2=`${common}
        column: 2;
        color: #5a4f4f;
        `
style3=`${common}
        column:3;
        position: inline;
        height: 34px;
        color: hwb(0deg 29% 25% / 99%);
        font-weight: 600;
        padding: 0px 6px 0px 10px;
        text-align: center;
        `


mark = (element = '', id = '', color = '', text = '',offset='',length='') => {
    if (!element) return 1
    html = element.innerText
/* 
    Simple just to avoid some Xss injections Not Much then that
    id :-
            [+]are numbers so max 999 is suitable 
    color :-
            [+] is hex value so it ranges from #000000 to #ffffff and 2additional bits for transparency if used

*/
    if (id.length>3 || color.startsWith("#") || color.length >8 ) return
    element.innerHTML = html.slice(0,Number(offset))+`
    <span id='COLOR-ANOTE-${id}' style="background:${color}" range="${offset}|${length}">
    ${html.slice(Number(offset),Number(offset)+Number(length))}
    <div style="${mainstyle}" id='COLOR-ANOTE-DIV-${id}'>
    <input type="color" id="PICKER-ANOTE-${id}" 
    style="${style1}" value="${color}">
    <input type='text' id="COMMENT-ANOTE-${id}" style="${style2}">
    <button id="BUTTON-ANOTE-${id}" style="${style3}">Remove</button>
    </div></span>`+html.slice(Number(offset)+Number(length))

    document.querySelector(`#COMMENT-ANOTE-${id}`).setAttribute("placeholder", text);
    document.querySelector(`#COMMENT-ANOTE-${id}`).setAttribute("value", text);
    document.body.setAttribute('ids', `${id},` +
        (document.body.getAttribute('ids')??'0')
    )
    
    document.querySelector(`#PICKER-ANOTE-${id}`).addEventListener('input', (e) => {
        {
            let spaned = document.querySelector(`#COLOR-ANOTE-${id}`)
            spaned.style.background = document.querySelector(`#PICKER-ANOTE-${id}`).value
        }
    })

    document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseover", () => {
            document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.opacity = "1"
            document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.visibility = "visible"
        })
        document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseout", () => {
            document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.opacity = "0"
            document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.visibility = "none"
        })
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
    mark(element, x.id, x.color, x.comment,x.offset,x.length)
})