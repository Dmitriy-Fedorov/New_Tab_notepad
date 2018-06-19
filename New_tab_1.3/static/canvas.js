let messageField = document.getElementById('message');
let titleField = document.getElementById('_title');
let body = document.querySelector('body');
let contextMenu = document.getElementById("contextMenu");
let delEntry = document.getElementById("toHide");
let hideContext = document.getElementsByClassName("toHide");
console.log(hideContext);
// console.log(messageField, window.innerWidth, window.innerHeight);
let resize = function () {
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    let fontSize = parseInt(window.getComputedStyle(titleField, null).getPropertyValue('font-size'));
    let titleFieldWidth = parseInt(window.getComputedStyle(titleField, null).getPropertyValue('width'));
    let titleFieldHeight = fontSize + 5;
    titleField.style.left = String((window.innerWidth - titleFieldWidth) / 2) + "px";
    titleField.style.height = titleFieldHeight +'px';

    messageField.style.width = String(window.innerWidth * 0.98) + "px";
    messageField.style.height = String(window.innerHeight - titleFieldHeight - 10) + "px";
    messageField.style.top = titleFieldHeight +'px';
    let messageFieldWidth = parseInt(window.getComputedStyle(messageField, null).getPropertyValue('width'));
    messageField.style.left = ((window.innerWidth - messageFieldWidth)/2)+"px";

};
resize();

let colors = {
    aqua:    '#7fdbff',
    blue:    '#0074d9',
    lime:    '#01ff70',
    navy:    '#001f3f',
    teal:    '#39cccc',
    olive:   '#3d9970',
    green:   '#2ecc40',
    red:     '#ff4136',
    maroon:  '#85144b',
    orange:  '#ff851b',
    purple:  '#b10dc9',
    yellow:  '#ffdc00',
    fuchsia: '#f012be',
    gray:    '#aaaaaa',
    white:   '#ffffff',
    black:   '#111111',
    silver:  '#dddddd'
  };

window.addEventListener('resize',
    function(){
        resize();
        // console.log(window.innerWidth, window.innerHeight);
        // console.log();
    }
);

titleField.addEventListener('keypress',
    function (event) {
        // console.log(key);
        if(event.code === "Enter" || event.code === "NumpadEnter"){
            event.preventDefault();
        }
    });

document.addEventListener('keydown', function (event) {
    // console.log(event);
    if(event.code === "ArrowRight" && event.altKey){
        let currentWindow = JSON.parse(localStorage["currentWindow"]);
        let dict = JSON.parse(localStorage["windowList"]);
        let newCurrentWindow = dict[currentWindow.next];
        localStorage["currentWindow"] = JSON.stringify(newCurrentWindow);
        loadMessage(titleField);
        loadMessage(messageField);
    }
    else if(event.code === "ArrowLeft" && event.altKey){
        let currentWindow = JSON.parse(localStorage["currentWindow"]);
        let dict = JSON.parse(localStorage["windowList"]);
        let newCurrentWindow = dict[currentWindow.prev];
        localStorage["currentWindow"] = JSON.stringify(newCurrentWindow);
        loadMessage(titleField);
        loadMessage(messageField);
    }
});

document.addEventListener('mousewheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
        let fontSize = parseFloat(window.getComputedStyle(messageField, null).getPropertyValue('font-size'));
        // console.log(event, fontSize);
        if(event.deltaY < 0){
            messageField.style.fontSize = fontSize + 1 + "px";
        }else{
            messageField.style.fontSize = fontSize - 1 + "px";
        }
        localStorage.setItem('messageFontSize', messageField.style.fontSize)
    }
    if (event.shiftKey) {
        event.preventDefault();
        let fontSize = parseFloat(window.getComputedStyle(titleField, null).getPropertyValue('font-size'));
        let height = parseFloat(window.getComputedStyle(titleField, null).getPropertyValue('height'));
        // console.log(event, fontSize);
        if(event.deltaY < 0){
            titleField.style.fontSize = fontSize + 1 + "px";
            titleField.style.height = height + 1 + "px"
        }else{
            titleField.style.fontSize = fontSize - 1 + "px";
            titleField.style.height = height - 1 + "px"
        }
        resize();
        localStorage.setItem('titleFontSize', titleField.style.fontSize)
    }
});

document.addEventListener('DOMContentLoaded', function(){
    if(localStorage.getItem("messageFontSize")!==null){
        messageField.style.fontSize = localStorage.getItem("messageFontSize");
    }
    if(localStorage.getItem("titleFontSize")!==null){
        titleField.style.fontSize = localStorage.getItem("titleFontSize");
        resize()
    }
    if(localStorage.getItem("currentWindow")===null){
        let item = {"id": "0",
                    "prev": "0",
                    "next": "0"};
        localStorage.setItem("currentWindow", JSON.stringify(item));
        localStorage.setItem("windowList", JSON.stringify({"0": item}));
    }
});

window.oncontextmenu = function (event) {
    if (event.ctrlKey){
        let dict = JSON.parse(localStorage["windowList"]);
        let keys = Object.keys(dict);
        if(keys.length > 1){
            for(let i = 0; i < hideContext.length; i++)
                hideContext[i].style.display = "block";

        }else{
            for(let i = 0; i < hideContext.length; i++)
                hideContext[i].style.display = "none";
        }
        contextMenu.style.display = "block";
        contextMenu.style.left = event.clientX + "px";
        contextMenu.style.top = event.clientY + "px";
        // console.log(event.stopPropagation);
        // console.log(event);
        event.stopPropagation();
        return false
    }


    // rightClick(event);

};

hideContextMenu = function (event) {
    let target = event.path[0].innerText;
    // console.log(event, target);
    contextMenu.style.display = "none";
    if(target==="Create New"){
        let dict = JSON.parse(localStorage["windowList"]);
        let keys = Object.keys(dict).sort();
        let lastWin = keys[keys.length-1];
        let firstWin = keys[0];
        let newID = String(parseInt(lastWin) + 1);
        let NewWindow = {id: newID, prev: lastWin, next: firstWin};
        dict[lastWin].next = newID;
        dict[firstWin].prev = newID;
        dict[newID] = NewWindow;

        localStorage["currentWindow"] = JSON.stringify(NewWindow);
        localStorage["windowList"] = JSON.stringify(dict);
        storeMessage("Tab #"+newID, "_title");
        loadMessage(titleField);
        loadMessage(messageField);
        // console.log(dict, keys);
    }
    if(target==="Delete Current"){
        let currentWindow = JSON.parse(localStorage["currentWindow"]);
        let dict = JSON.parse(localStorage["windowList"]);
        let keys = Object.keys(dict).sort();
        let lastWin = keys[keys.length-1];
        let firstWin = keys[0];
        // let newID = String(parseInt(lastWin) + 1);
        let showWindow = dict[currentWindow.prev];
        dict[currentWindow.prev].next = currentWindow.next;
        dict[currentWindow.next].prev = currentWindow.prev;
        delete dict[currentWindow.id];

        localStorage["currentWindow"] = JSON.stringify(showWindow);
        localStorage["windowList"] = JSON.stringify(dict);

        let toRemove = [currentWindow.id+"_message", currentWindow.id + "__title"];
        chrome.storage.sync.remove(toRemove);
        loadMessage(titleField);
        loadMessage(messageField);
        // console.log(dict, keys);
    }
    else if(target==="Next"){
        let currentWindow = JSON.parse(localStorage["currentWindow"]);
        let dict = JSON.parse(localStorage["windowList"]);
        let newCurrentWindow = dict[currentWindow.next];
        localStorage["currentWindow"] = JSON.stringify(newCurrentWindow);
        loadMessage(titleField);
        loadMessage(messageField);
    }
    else if(target==="Previous"){
        let currentWindow = JSON.parse(localStorage["currentWindow"]);
        let dict = JSON.parse(localStorage["windowList"]);
        let newCurrentWindow = dict[currentWindow.prev];
        localStorage["currentWindow"] = JSON.stringify(newCurrentWindow);
        loadMessage(titleField);
        loadMessage(messageField);
    }
};

window.onclick = hideContextMenu;

