//loading fix datas to storage in the begining
chrome.runtime.onInstalled.addListener(async() => {
    chrome.contextMenus.create({
        id: 'hl',
        title: "AnotateLink",
        type: 'normal',
        contexts: ['selection'],
    });
})

chrome.contextMenus.onClicked.addListener((item, tab) => {
    let id = item.menuItemId
    let slected = item.selectionText
    console.log(id, slected)
});




let background = (run) => {
    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
        if (details.url == "chrome://newtab/") {
            return
        }
        if (check(details.url) && details.frameType == "outermost_frame") {
            console.log(details.url)
        }
    })
}