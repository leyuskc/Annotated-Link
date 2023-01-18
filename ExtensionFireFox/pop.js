body = document.body
c = body.getAttribute('evo') == null ? 0 : Number(body.getAttribute('evo'))
body.setAttribute("evo", (c + 1))

colrand = () => {
    chart = "0123456789abcdef"
    col = '#'
    for (let i = 0; i < 6; i++) {
        col += chart[Math.ceil(Math.random() * 15)]
    }
    return col

}

function func(a) {
    //if (c) return
    backup = []
    let cleanr = (de) => {
        backup.push(de.textContent)
    }
    select = document.getSelection().toString()
    neww = a.target.innerHTML
    old = a.target.querySelector('span')
    if (old != null) {
        old.replaceWith(old.textContent)
    }
    temp = a.target.innerHTML
    console.table(temp, neww)
    index = a.target.innerHTML.indexOf(select)
    temp = `${temp.slice(0,index)}<span id='colorYTVYT${c}' style="color: ${colrand()};background: ${colrand()}3b;">${temp.slice(index,index+select.length)}</span>${temp.slice(index+select.length)}`
    a.target.innerHTML = `${temp}`
    
}
if (c == 0) {
    document.addEventListener("mouseup", func)
} else {
    document.removeEventListener("mouseup", func)
}