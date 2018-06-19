var ws = new WebSocket("ws://127.0.0.1:8888/ws");



ws.onmessage = function(event) {
    editor.setValue(event.data);
};

ws.onopen = function() {
    console.log("Connection established");
};

ws.onclose = function(event) {
    if (event.wasClean) {
        ws.send(editor.getValue());
        console.log('Connection closed');
    } else {
        console.log('Обрыв соединения');
    }
    console.log('Code: ' + event.code + ' Cause: ' + event.reason);
};

ws.onerror = function(error) {
    console.log("Error " + error.message);
};

/*function onChange() { console.log("The content of the editor has changed");
                      console.log(editor.getValue());}*/
/****************/
/*document.addEventListener('DOMContentLoaded', function() {
    var textField = document.getElementById('wysihtml5-editor');
    console.log(textField);
    console.log('DOMContentLoaded_0');
    textField.addEventListener('input', debounce(textFieldInputEventHandler, 5));
    //console.log(editor);
    editor.on("change", onChange);
    console.log('DOMContentLoaded_1');

});

document.addEventListener('focus' , function() {
	console.log('document focus');
	//ws.send('GET');
}, true);


document.addEventListener('blur' , function() {
	console.log('document blur');
}, true);

*/



