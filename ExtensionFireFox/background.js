const menus = {
    0: 'Annote',
    1: 'URL',
    2: 'Parse'
}
browser.runtime.onInstalled.addListener(async() => {
    for (let [id, title] of Object.entries(menus)) {
        browser.contextMenus.create({
            id: id,
            title: title,
            type: 'normal',
            contexts: ['all'],
        })
    }
})


browser.contextMenus.onClicked.addListener((item, tab) => {
    let codes = ['marker.js', 'url.js', 'parse.js']
    let id = item.menuItemId
    let selection = item.selectionText
    codes = codes[Number(id)]
    
    browser.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            files: [codes],
        },
        () => {})
    
})