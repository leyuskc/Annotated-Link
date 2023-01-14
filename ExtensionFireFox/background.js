import {
    menus
} from './l.js'
browser.runtime.onInstalled.addListener(async() => {
    for (let [id, title] of Object.entries(menus)) {
        browser.contextMenus.create({
            id: id,
            title: title,
            type: 'normal',
            contexts: ['selection'],
        })
    }
})


browser.contextMenus.onClicked.addListener((item, tab) => {
    let id = item.menuItemId
    let selection = item.selectionText
    browser.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            files: ['pop.js'],
        },
        () => {})
    console.log(id, selection, item)
})