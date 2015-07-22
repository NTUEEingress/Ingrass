var http = require("http")
var ws = require("./node_modules/nodejs-websocket")
var fs = require("fs")
var express = require( 'express' ) ;
var app = express() ;
var cors = require('cors');
var pysh = require('python-shell');

app.use(express.static('./'));
app.use(cors());
app.listen( 8080 ) ;

app.get('/', function(req, res) {
	res.sendFile('index.html', {root: __dirname});
});

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on("text", function (str) {
		broadcast(str) ;
	})
	connection.on("close", function () {
	})
})
server.listen(8081)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	})
}

var pserver = ws.createServer( function( connection ) {
	var pro ;
	var running ;
	connection.on("text", function( str ) {
		//console.log( str );
		if ( str[ 0 ] == 'o' ) {
			if ( running ) {
				running = false ;
				connection.sendText( "end" ) ;
				pro.end(function (err) {
					console.log('finished');
				});
			}
		} else if ( str[ 0 ] == 'C' ) {
			//console.log( connection ) ;
			if ( running ) {
				running = false ;
				connection.sendText( "end" ) ;
				pro.end(function (err) {
					console.log('finished');
				});
			}
			fs.writeFile('python/tmp.py',str.slice(1),function(err) {
				if (err) return console.log(err);
				console.log('tmp.py created');
				pro = new pysh( 'tmp.py' , {args:['-u'],pythonPath:"python3"});
				connection.sendText( "start" ) ;
				running = true ;
				pro.on('message',function(message){
					//console.log(message);
					connection.sendText( message ) ;
				});
				pro.on('error',function(err) {
					console.log( err ) ;
					connection.sendText( "E"+err ) ;
					pro.end(function (err) {
						console.log('finished');
					});
				});
				pro.on('close',function() {
					running = false ;
					connection.sendText( "end" ) ;
				});
				/*
				pro.end(function (err) {
					console.log('finished');
					if (err) throw err;
					console.log('finished');
				});
				*/
			});
		} else {
			if ( running == true )
				pro.send( str ) ;
		}
	})
	connection.on("close",function() {
	})
})
pserver.listen( 8082 ) ;
