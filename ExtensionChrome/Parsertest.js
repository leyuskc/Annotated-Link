print = console.log;
flag = false;

document.addEventListener('selectionchange', () => {
  if (window.getSelection().toString().length > 10)
    flag = true
})


function innerHtmlWrapper(node, offsetStart, offsetEnd) {
  var str = node.innerHTML.toString();
  var strPtr = 0,wrtPrt=0;
  var trackback = []
  var buffer = ""
  var onlyString = ""
  var tag=0,mtag = 0
  var finalString = ""
  while(strPtr<str.length){
    if(str[strPtr]=="<"){
      if(mtag && str[strPtr+1]=="/"){
        finalString+="</span>"
        mtag=0
      }
      tag=1;
    }
    else if(str[strPtr]==">" && tag){
      tag=0;
      wrtPrt-=1;
    }
    else if(wrtPrt==offsetStart && !tag){
      finalString+="<span style='background:#5443ec5c'>"
      mtag=1
    }
    else if(wrtPrt==offsetEnd  && !tag){
      finalString+="</span>"
    }
    if(!tag)
      wrtPrt+=1;
    finalString+=str[strPtr];
    strPtr+=1;
  }
  node.innerHTML = finalString
  return node;
}

function wrapNode(node, offsetStart, offsetEnd) {

  if (node.innerHTML) {
    node = innerHtmlWrapper(node, offsetStart, offsetEnd);
  } else {
    var str = node.textContent
    var t = document.createElement("span")
    if (offsetEnd < 0) offsetEnd = str.length
    if (offsetStart < 0) offsetEnd = str.length
    t.innerHTML = `${str.slice(0, offsetStart)}<span id="anoted" style="color:yellow">${str.slice(offsetStart, offsetEnd)}</span>${str.slice(offsetEnd, str.length)}`
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
  print("recuring...")
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
  print(range)
  let clone = range.cloneContents()
  var commonAncestor = range.commonAncestorContainer
  var start = range.startContainer
  var end = range.endContainer
  var anchorOffset = selection.anchorOffset, focusOffset = selection.focusOffset;
  if (isSelectionBackwards()) {
    [anchorOffset, focusOffset] = [focusOffset, anchorOffset]
  }

  if (end === start && selection.toString().length > 10) {
    var t = document.createElement("span")
    t.style.color ="yellow"
    t.setAttribute("id","anoted")
    range.surroundContents(t)
    selection.removeAllRanges();

  } else {
    var foundStart = 0, foundEnd = 0;
    var innerHTMLs = []
    for (var node of commonAncestor.childNodes) {
      if (node.contains(start)) { 
        node = wrapNode(node, anchorOffset, -1)
        foundStart = 1

      }
      else if (node.contains(end)) {
        node = wrapNode(node, 0, focusOffset)
        foundEnd = 1

      }
      else if (foundStart && !foundEnd) {
        node = wrapNode(node, 0, -1)
      }
      innerHTMLs.push(node)
    }
    range.commonAncestorContainer.innerHTML = ""
    innerHTMLs.forEach(x => range.commonAncestorContainer.appendChild(x))

  }
}

document.addEventListener('mouseup', () => {
  if (flag)
    wrapSelection();
})