function loadMessage(textField) {
    var msg = localStorage["message"];
    textField.value = msg === undefined ? 'edit this message' : msg;
}

function storeMessage(message) {
    localStorage['message'] = message;
}

function textFieldInputEventHandler(event) {
    storeMessage(event.target.value);
}

function debounce(callback, ms) {
    var id = null;
    return function(event) {
        clearTimeout(id);
        id = setTimeout(callback.bind(window, event), ms);
    }
}

document.addEventListener('focus' , function() {
	var textField = document.getElementById('message');
    loadMessage(textField);
}, true);

document.addEventListener('DOMContentLoaded', function() {
    var textField = document.getElementById('message');
    loadMessage(textField);

    textField.addEventListener('input', debounce(textFieldInputEventHandler, 200));

});