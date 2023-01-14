import {
    menus
} from './l.js'
chrome.runtime.onInstalled.addListener(async() => {
    for (let [id, title] of Object.entries(menus)) {
        chrome.contextMenus.create({
            id: id,
            title: title,
            type: 'normal',
            contexts: ['selection'],
        })
    }
})


chrome.contextMenus.onClicked.addListener((item, tab) => {
    let id = item.menuItemId
    let selection = item.selectionText
    chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            files: ['pop.js'],
        },
        () => {})
    console.log(id, selection, item)
})