

function loadMessage(textField) {
    chrome.storage.sync.get(null, function(items) {
        let currentWindow = localStorage.getItem("currentWindow");
        let key;
        if(currentWindow===null){
            key = "0_"+textField.id;
        }else {
            let wind = JSON.parse(currentWindow);
            key = wind.id + '_' + textField.id
        }
        let msg = items[key];
        textField.value = msg === undefined ? 'Edit this message' : msg;
    });
}

function storeMessage(message, id) {
    let items = {};
    let currentWindow = localStorage.getItem("currentWindow");
    if(currentWindow===null){
        items['0_'+id] = message;
    }else{
        let wind = JSON.parse(currentWindow);
        // console.log(wind);
        items[wind.id + "_" + id] = message;
    }
    chrome.storage.sync.set(items);
}


function textFieldInputEventHandler(event) {
    // console.log(event);
    storeMessage(event.target.value, event.target.id);
}

function debounce(callback, ms) {
    let id = null;
    return function(event) {
        clearTimeout(id);
        id = setTimeout(callback.bind(window, event), ms);
    }
}

document.addEventListener('focus' , function() {
	//console.log('focus');
	var textField = document.getElementById('message');
	var titleField = document.getElementById('_title');
    loadMessage(textField);
    loadMessage(titleField);
}, true);

document.addEventListener('DOMContentLoaded', function() {
    var textField = document.getElementById('message');
    var titleField = document.getElementById('_title');
    loadMessage(textField);
    loadMessage(titleField);

    // Debounce listener to prevent exceeding chrome MAX_WRITE_OPERATIONS_PER_MINUTE for storage.sync
    // 500ms is the min delay to prevent exceeding on any possible input
    // but closing the tab within the window of 500ms after typing will result in data loss
    // 200ms is a compromise
    textField.addEventListener('input', debounce(textFieldInputEventHandler, 200));
    titleField.addEventListener('input', debounce(textFieldInputEventHandler, 200));
    // chrome.storage.onChanged.addListener(function() {
    //     // If you load while the user is typing – it can potentially erase recent input,
    //     // since input listener is debounced.
    //     // If the textField is not active, then there is no input there.
    //     // Like in another window / tab.
    //     if (textField === document.activeElement) return;
    //     loadMessage(textField);
    // });
});
