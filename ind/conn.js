var connection ;
connection = new WebSocket("ws://"+window.location.hostname+":8081") ;
connection.onopen = function () {
	console.log("Connection opened") ;
	window.addEventListener( 'mouseclick' , function ( event ) {
		var msg = ( event.detail ).toString() ;
		console.log( "catched" ) ;
		//console.log( msg ) ;
		connection.send( msg ) ;
	});
	window.addEventListener( 'begin' , function ( event ) {
		console.log( "begin: " ) ;
		connection.send( "-1" ) ;
	});
	connection.onclose = function () {
		console.log("Connection closed");
	}
	connection.onerror = function () {
		console.error("Connection error");
	}
	connection.onmessage = function (event) {
		var tmp = parseInt( event.data ) ;
		//console.log( tmp ) ;
		if ( tmp != -1 ) {
			receiveMouseEvent( Math.floor( ( tmp % 100 ) / 10 ) , tmp % 10 , Math.floor( tmp / 100 ) ) ;
		} else {
			reinit();
			console.log("SYNCRONOUS");
		}
	}
}

var pconn = new WebSocket("ws://"+window.location.hostname+":8082") ;
pconn.onopen = function() {
	var running = false ;
	console.log( "pConn opened" ) ;
	pconn.onclose = function() {
		console.log("Connection closed");
	}
	pconn.onerror = function () {
		console.error("Connection error");
	}
	pconn.onmessage = function (event) {
		//console.log( event.data ) ;
		if ( event.data[ 0 ] == 's' ) {
			running = true ;
		} else if ( event.data[ 0 ] == 'e' ) {
			running = false ;
		} else if ( event.data[ 0 ] == 'E' ) {
			error.setValue( event.data.slice(1) ) ;
		} else if ( running ) {
			var des = parseInt( event.data ) ;
			if ( des >= 0 && des < 10 ) {
				connection.send( ( Math.floor( Date.now() ) * 100 + uid * 10 + des ).toString() ) ;
			} else if ( des >= 10 && des < 20 ) {
				var ret = ( controlled[ des - 10 ] == uid ) ;
				console.log( ret ) ;
				pconn.send( ret ) ;
				// true or false
			} else if ( des >= 20 && des < 30 ) {
				//console.log( x[ des - 20 ] ) ;
				pconn.send( x[ des - 20 ] ) ;
			} else if ( des >= 30 && des < 40 ) {
				//console.log( y[ des - 30 ] ) ;
				pconn.send( y[ des - 30 ] ) ;
			}
		}
	}
	document.getElementById( 'reset-btn' ).onclick = function( ) {
		console.log( "terminated" ) ;
		pconn.send( "over" ) ;
		reinit() ;
	}
}


