print = console.log;
flag = false;
mainstyle = `display: grid;
    grid-template-areas: 'b b b b'
                         'a a c c';
    grid-auto-rows: auto;
    position: absolute;
    -webkit-transition: opacity 600ms, visibility 600ms;
    transition:all 1s ease 0s;
        `

common = `
        border: solid #cbc3c3;
        border-radius: 4px;
        background: #e9e9e9;
        `
style1 = `${common}
        grid-area: 'a';
        width: 25px;
        `
style2 = `${common}
        grid-area: 'b';
        color: #5a4f4f;
        `
style3 = `${common}
        grid-area: 'c';
        position: inline;
        height: 34px;
        color: hwb(0deg 29% 25% / 99%);
        font-weight: 600;
        padding: 0px 6px 0px 10px;
        text-align: center;
        `


document.addEventListener('selectionchange', () => {
  if (window.getSelection().toString().length > 10)
    flag = true
})


function innerHtmlWrapper(node, offsetStart, offsetEnd, id) {
  var str = node.innerHTML.toString();
  var strPtr = 0, wrtPrt = 0;
  var trackback = []
  var buffer = ""
  var onlyString = ""
  var tag = 0, mtag = 0;
  var finalString = ""
  while (strPtr < str.length) {
    if (str[strPtr] == "<") {
      if (mtag && str[strPtr + 1] == "/") {
        finalString += `</span>`
        mtag = 0
      }
      tag = 1;
    }
    else if (str[strPtr] == ">" && tag) {
      tag = 0;
      wrtPrt -= 1;
    }
    else if (wrtPrt == offsetStart && !tag) {
      finalString += `<span id='COLOR-ANOTE-${id}' range="${offsetStart}|${str.length}">`
      mtag = 1
    }
    else if (wrtPrt == offsetEnd && !tag) {
      finalString += `</span>`
    }
    if (!tag)
      wrtPrt += 1;
    finalString += str[strPtr];
    strPtr += 1;
  }
  node.innerHTML = finalString
  return node;
}


function wrapNode(node, offsetStart, offsetEnd, id) {
  if (node.innerHTML) {
    node = innerHtmlWrapper(node, offsetStart, offsetEnd, id);
  } else {
    var str = node.textContent
    var t = document.createElement("span")
    if (offsetEnd < 0) offsetEnd = str.length
    if (offsetStart < 0) offsetEnd = str.length
    t.innerHTML = `${str.slice(0, offsetStart)}
          <span id='COLOR-ANOTE-${id}' range="${offsetStart}|${str.length}">
            ${str.slice(offsetStart, offsetEnd)}
            </span>
  ${str.slice(offsetEnd, str.length)}`
    node = t
    print("(innerText): ", offsetStart, offsetEnd)
  }
  return node;
}


function isSelectionBackwards() {
  var sel = window.getSelection();
  if (!sel.isCollapsed) {
    var range = document.createRange();
    range.setStart(sel.anchorNode, sel.anchorOffset);
    range.setEnd(sel.focusNode, sel.focusOffset);
    return range.collapsed;
  }
  return false;
}

function recuring(x, choice) {
  if (x.childNodes) {
    x.childNodes.forEach(y => {
      if (y.contains(choice)) return recuring(y, choice)
    }
    )
  }
  return x;
}

function wrapSelection() {
  var selection = window.getSelection();
  var range = selection.getRangeAt(0);
  var commonAncestor = range.commonAncestorContainer
  var start = range.startContainer
  var end = range.endContainer
  var anchorOffset = selection.anchorOffset, focusOffset = selection.focusOffset;
  if (isSelectionBackwards()) {
    [anchorOffset, focusOffset] = [focusOffset, anchorOffset]
  }
  let id = (document.body.getAttribute('ids') ?? '0')
    .match(/\d+/g)
    .map(x => Number(x)).sort((a, b) => (a - b))
  id = id[id.length - 1] + 1

  if (end === start && selection.toString().length > 10) {
    var t = document.createElement("span")
    t.style.color = "yellow"
    t.setAttribute("id", "anoted")
    range.surroundContents(t)
    selection.removeAllRanges();
  }
  else {
    var foundStart = 0, foundEnd = 0;
    var innerHTMLs = []
    for (var node of commonAncestor.childNodes) {
      if (node.contains(start)) { 
        node = wrapNode(node, anchorOffset, -1, id)
        foundStart = 1
      }
      else if (node.contains(end)) {
        node = wrapNode(node, 0, focusOffset, id)
        picker = document.createElement("span")
        picker.innerHTML = `<div style="${mainstyle}" id='COLOR-ANOTE-DIV-${id}' >
              <input type="color" id='PICKER-ANOTE-${id}' style="${style1}">
              <textarea type='text' id="COMMENT-ANOTE-${id}" style="${style2}"></textarea>
              <button id="BUTTON-ANOTE-${id}" style="${style3}">Remove</button>
              </div>`
        node.appendChild(picker)
        foundEnd = 1
      }
      else if (foundStart && !foundEnd) {
        node = wrapNode(node, 0, -1, id)
      }
      innerHTMLs.push(node)
    }
    range.commonAncestorContainer.innerHTML = ""
    innerHTMLs.forEach(x => range.commonAncestorContainer.appendChild(x))

  }

  document.querySelector(`#PICKER-ANOTE-${id}`).addEventListener('input', (e) => {
    {
      let spaned = document.querySelectorAll(`#COLOR-ANOTE-${id}`)
      spaned.forEach(x=>x.style.background = document.querySelector(`#PICKER-ANOTE-${id}`).value)
    }
  })
  allSelectionSpan = document.querySelectorAll(`#COLOR-ANOTE-${id}`)
  lastSelectionSpan = allSelectionSpan[allSelectionSpan.length-1]

  lastSelectionSpan.addEventListener("mouseover", () => {
    print("Mouse MoveOver")
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.opacity = "1"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.visibility = "visible"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.zIndex = "1"
  })
  lastSelectionSpan.addEventListener("mouseout", () => {
    print("Mouse MOveOut")
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.opacity = "0"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.visibility = "none"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.zIndex = "-1"
  })
  document.querySelector(`#COLOR-ANOTE-DIV-${id}`).addEventListener("mouseover", () => {
    print("Mouse MoveOver")
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.opacity = "1"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.visibility = "visible"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.zIndex = "1"
  })
  document.querySelector(`#COLOR-ANOTE-DIV-${id}`).addEventListener("mouseout", () => {
    print("Mouse MOveOut")
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.opacity = "0"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.visibility = "none"
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).style.zIndex = "-1"
  })
  document.body.setAttribute('ids', `${document.body.getAttribute('ids')??'0'},${id}`
  )
  document.querySelector(`#BUTTON-ANOTE-${id}`).addEventListener("click", () => {
    print("Mouse Clicked")
    // document.querySelector(`#COLOR-ANOTE-${id}`)
    //   .replaceWith(document.querySelector(`#COLOR-ANOTE-${id}`).innerText)
    document.querySelector(`#COLOR-ANOTE-DIV-${id}`).outerHTML = ""
    document.querySelectorAll(`#COLOR-ANOTE-${id}`).forEach(x=>x.outerHTML =x.innerHTML)
    ids = document.body.getAttribute('ids').split(',').filter((x) => x != `${id}`).join(',')
    ids = ids==null?"0,":ids
    if(ids==null){
      ids="0,"
    }
    document.body.setAttribute('ids', ids)
  })
  flag = false
}

document.addEventListener('mouseup', () => {
  if (flag)
    wrapSelection();
})