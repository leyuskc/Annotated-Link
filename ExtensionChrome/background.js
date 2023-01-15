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
    console.log(codes)
    chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            files: [codes],
        },
        () => {})
    console.log(id, selection, item)
})

// chrome.webNavigation.onCompleted.addListener((details) => {
//     chrome.scripting.executeScript({
//             target: {
//                 tabId: details.tabId,
//                 allFrames: true
//             },
//             files: ['parse.js'],
//         },
//         () => {})
// })