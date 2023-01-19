nav = (arr) => {
    let element = document.documentElement.childNodes
    arr.forEach(x => {
        element = element[x].childNodes
    })
    return element
}
 
mainstyle=`display: grid;
    grid-template-columns: 22px 226px 104px;
    grid-auto-rows: auto;
    position: absolute;
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


mark = (element = '', id = '', color = '', text = '') => {
    if (!element) return 1
    html = element.innerHTML
/* 
    Simple just to avoid some Xss injections Not Much then that
    id :-
            [+]are numbers so max 999 is suitable 
    color :-
            [+] is hex value so it ranges from #000000 to #ffffff and 2additional bits for transparency if used
            [+] it must include # ; didn't checked if it was prefix or not just for fun you can change it to
                `color.startsWith('#')` for more secure if you need
    Making more secure:-
        1) id.replace(/\d+/,'').length>1 
        2) color.startsWith('#')
        3) color.replace(/[#0-9a-f]{3,9}/,'').length>1
    Didn't implemented it for fun to see some one try Xss

*/
    if (id.length>3 || !color.includes('#') || color.length >8 ) return 1
    /*element.innerHTML = `
    <span id='COLOR-ANOTE-${id}' style="background:${color}" >
    <div>
    <input type="color" id="PICKER-ANOTE-${id}" 
    style="${style1}" value="${color}">
    <input type='text' id="COMMENT-ANOTE-${id}" style="${style2}">
    <button id="BUTTON-ANOTE-${id}" style="${style3}">Remove</button>
    <div>${html}</span>`*/
    element.innerHTML = `
    <span id='COLOR-ANOTE-${id}' style="background:${color}" >
    <div style="${mainstyle}" id='COLOR-ANOTE-DIV-${id}'>
    <input type="color" id="PICKER-ANOTE-${id}" 
    style="${style1}" value="${color}">
    <input type='text' id="COMMENT-ANOTE-${id}" style="${style2}">
    <button id="BUTTON-ANOTE-${id}" style="${style3}">Remove</button>
    </div>${html}</span>`

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

    document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseover", function() {
        document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.display = "grid"
    })
    document.querySelector(`#COLOR-ANOTE-${id}`).addEventListener("mouseout", function() {
        document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.display = "none"
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
    mark(element, x.id, x.color, x.comment)
})