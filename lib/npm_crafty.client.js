/**
* CLIENT CODE
*/
var craftyNet = require('./npm_crafty.net.js');

exports.createClient = function(label) {
	//add net features to crafty
	craftyNet.__addNet(Crafty, label, "");
	
	return Crafty;
};

exports.setServer = function(Crafty, socket) {
	// set to receive from server
	craftyNet.__setInputSocket(Crafty, socket);
	// set to send to server
	craftyNet.__setClientOutputSocket(Crafty, socket);

	return Crafty;
};

var __loadScript = function (url, callback) {
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


exports.setupDefault = function(immediateFN, connectFN, disconnectFN, serverAddress) {
	var path = (serverAddress ? serverAddress : "") + "/socket.io/socket.io.js";
	
	__loadScript(path, function() {
		immediateFN();

		var socket = io.connect(serverAddress);
		socket.on('connect', function () {
			console.log('Connected ', socket.socket.sessionid);
			connectFN(socket);
		});
		socket.on('disconnect', function () {
			console.log('Disonnected ', socket.socket.sessionid);
			disconnectFN(socket);
		});
	});
};
