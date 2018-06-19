var editor = new wysihtml5.Editor("wysihtml5-editor", {
        toolbar:     "wysihtml5-editor-toolbar",
        stylesheets: ["css/reset-min.css", "css/editor.css"],
        parserRules: wysihtml5ParserRules
      });

      editor.on("load", function() {
        var composer = editor.composer,
            h1 = editor.composer.element.querySelector("h1");
        if (h1) {
          composer.selection.selectNode(h1);
        }
      });

var toFocus = true;
/*ws.onmessage = function(event) {
    editor.setValue(event.data);
};*/


function onChange() {
    console.log("The content of the editor has changed");
    //console.log(editor.getValue());
    ws.send(editor.getValue());
}

function beforeCommand() {
    toFocus = false;
    console.log("Before command");
}

function onCommand() {
    //toFocus = false;
    console.log("ON command");
    var text = editor.getValue();
    //console.log(text.length);
    if(text.length>0){
        ws.send(text);
        ws.send('GET');
    }

}
function onFocus() {
    if(toFocus){
        console.log("On focus");
        ws.send('GET');
    }else{
        console.log("Out of focus");
        toFocus = true;
    }
}

editor.on("change", onChange);
editor.on("newword:composer", onChange);
editor.on("aftercommand:composer", onCommand);
editor.on("beforecommand:composer", beforeCommand);
editor.on("focus", onFocus);
//editor.on("blur:textarea", onBlur());



/*
editor.addEventListener('focus' , function() {
	console.log('document focus');
	//ws.send('GET');
}, true);

editor.addEventListener('blur' , function() {
	console.log('document blur');
}, true);
*/
/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}*/
