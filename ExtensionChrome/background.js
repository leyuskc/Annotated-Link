import {
    menus
} from './l.js'
chrome.runtime.onInstalled.addListener(async() => {
    for (let [id, title] of Object.entries(menus)) {
        chrome.contextMenus.create({
            id: id,
            title: title[0],
            type: title[1],
            contexts: ['all'],
            checked:false,  
        })
    }
    chrome.storage.sync.set({
        "run":0
    })
})


chrome.contextMenus.onClicked.addListener((item, tab) => {
    let codesf = ['marker.js', 'url.js', 'parse.js']
    let id = item.menuItemId
    let selection = item.selectionText
    console.log('Is true?',item.checked)
    chrome.storage.sync.set({
        "run":Number(item.checked)
    })
    codesf = codesf[Number(id)]
    
    chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            files: [codesf],
        },
        () => {})
    
})