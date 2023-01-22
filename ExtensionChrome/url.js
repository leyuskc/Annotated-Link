getPath = (element) => {
    var path = [];
    while (element.parentNode !== null) {
        var siblings = element.parentNode.childNodes;
        var count = 0;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element) {
                path.unshift(count);
                break;
            }
            count++;
        }
        element = element.parentNode;
    }
    return path;
}
datas = new Array()
ids = document.body.getAttribute('ids').split(',')
ids.forEach((x) => {
    if (!x || x == 'null' || x == null || !Number(x)) return 1
    let element = document.querySelector(`#COLOR-ANOTE-${x}`)
    if (element?.parentElement == undefined) return
    let parent = element.parentElement
    let pointer= element.getAttribute('range').split('|')
    let text = element.querySelector(`#COMMENT-ANOTE-${x}`).value
    let color = element.querySelector(`#PICKER-ANOTE-${x}`).value
    let path = getPath(parent).slice(1)
    datas.push({
        id: x,
        path: path,
        comment: text,
        color: color,
        offset:pointer[0],
        length:pointer[1],
    })
})


string = JSON.stringify(datas)
encodedString = window.btoa(string);
url = window.location + '#' + encodedString, JSON.parse(window.atob(encodedString))
navigator.clipboard.writeText(url)
