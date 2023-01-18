import {
    menus
} from './l.js'
chrome.runtime.onInstalled.addListener(async() => {
    for (let [id, title] of Object.entries(menus)) {
        chrome.contextMenus.create({
            id: id,
            title: title,
            type: 'normal',
            contexts: ['all'],
        })
    }
})


chrome.contextMenus.onClicked.addListener((item, tab) => {
    let codes = ['marker.js', 'url.js', 'parse.js']
    let id = item.menuItemId
    let selection = item.selectionText
    codes = codes[Number(id)]
    
    chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            files: [codes],
        },
        () => {})
    
})