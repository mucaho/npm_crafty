/**
* CLIENT CODE
*/
var exports = exports || {};

exports.createClient = function(label, room) {
	//add net features to crafty
	exports.__addNet(Crafty, label, room);
	
	return Crafty;
};
exports.setServer = function(Crafty, socket) {
	// set to receive from server
	exports.__socketReceive(Crafty, socket);
		
	//set to send to server
	exports.__clientSocketSend(Crafty, socket);
};

exports.__loadScript = function (url, callback) {
	// adding the script tag to the head as suggested before
	var script = document.createElement('script');
	//script.type = 'text/javascript';
	script.src = url;

	// then bind the event to the callback function 
	// there are several events for cross browser compatibility
	script.onreadystatechange = callback;
	script.onload = callback;

	// fire the loading
	document.head.appendChild(script);
};

exports.setupDefault = function(immediateFN, connectFN, disconnectFN) {
	exports.__loadScript("/socket.io/socket.io.js", function() {
		exports.__loadScript("npm_crafty.net.js", function() {
			immediateFN();
			
			var socket = io.connect();
			socket.on('connect', function () {
				console.log('Connected ', socket.socket.sessionid);
				connectFN(socket);
			});
			socket.on('disconnect', function () {
				console.log('Disonnected ', socket.socket.sessionid);
				disconnectFN(socket);
			});
		});
	});
};
