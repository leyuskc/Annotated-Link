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
flag = true
//setting Ids to manage the total anotations
document.body.setAttribute('ids', (
        document.body.getAttribute('ids') ?? '0')
    .match(/\d+/g)
    .map(x => Number(x))
    .sort((a, b) => (a - b))
    .join()
)


HighEnd = (html,selection)=>{
    offset = html.innerText.indexOf(selection)
    console.log("offsets",offset)
    /*
    iterate thrugh every words in innerHTML and selection
    i=innerHTML.toString().split(' ')
    j=selection.split(' ')
    go through i one by one until the first word in matched in j[0]
    ans=[]
    tempo={}
    indexes=0
    streak=1
    for items of i
    if items.match(/<[^]+>/) ans.push(item)continue
    if items.includes(j[0]){ //doing this to preserve the selection as selection may start from middle of word
    tempo[index]=j.pop(0)       // holding the found elemts temporarly as it may be false positive
    streak=1 //toggle streak
    ans.push('span'+j[0])

    }
    else{
    streak=0

    } // at last append /span when selection ends
    will implement later
    */
    return html
}

//OnSelectionChange Events tiggers on every character addition and subtraction from th selection
//which leads buggy selection so just toggle th flag on selection 
document.addEventListener('selectionchange', () => {
    if (window.getSelection().toString().length > 10)
        flag = false
})

//now with the above flag check for mouse relize of mouse up and only tigger the marker 
document.addEventListener('mouseup', () => {
    if (flag === false) {
        let id = (document.body.getAttribute('ids') ?? '0')
        .match(/\d+/g)
        .map(x => Number(x)).sort((a,b)=>(a-b))
        id = id[id.length-1]+1
        let selection = window.getSelection()
        let range = selection.getRangeAt(0)
        let c = range.cloneContents()
        range.deleteContents()
        range.insertNode(c)
        let html = range.commonAncestorContainer
        if (selection.toString().length < 10) return
        //HighEnd Marker Can Cost high cpu usage unlock on risk
        //htmly = HighEnd(html,selection)
        html = html.innerText
        .split(selection.toString())
        .join(`<span id='COLOR-ANOTE-${id}'>
            <div style="${mainstyle}" id='COLOR-ANOTE-DIV-${id}'>
            <input type="color" id='PICKER-ANOTE-${id}' style="${style1}">
            <input type='text' id="COMMENT-ANOTE-${id}" style="${style2}">
            <button id="BUTTON-ANOTE-${id}" style="${style3}">Remove</button>
            </div>
            ${selection.toString()}</span>`)
        range.commonAncestorContainer.innerHTML = html
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
        document.body.setAttribute('ids', `${id},` +
            document.body.getAttribute('ids')
        )
        document.querySelector(`#BUTTON-ANOTE-${id}`).addEventListener("click", ()=> {
            document.querySelector(`#COLOR-ANOTE-${id}`)
            .replaceWith(document.querySelector(`#COLOR-ANOTE-${id}`).innerText)
            ids = document.body.getAttribute('ids').split(',').filter((x) => x != `${id}`).join(',')
            document.body.setAttribute('ids', ids)
        })
        flag = true
    }
})