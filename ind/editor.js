// main editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/python");
document.getElementById('editor').style.fontSize = '14px';

var DOM = document.getElementById('submit');
DOM.addEventListener('click', function(event) {
	var content = editor.getValue();
	console.log( "BBB"+content );
	pconn.send( "C"+content ) ;
});

$.get( "/python/default.py" , function(data) {
	editor.setValue( data ) ;
	editor.gotoLine( 1 ) ;
}) ;

// error console
var error = ace.edit("error");
error.setTheme("ace/theme/twilight");
error.getSession().setMode("ace/mode/text");
error.setReadOnly(true);
document.getElementById('error').style.fontSize = '14px';
