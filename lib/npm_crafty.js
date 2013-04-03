var exports = exports || {};

/**
* SERVER CODE
*/
exports.createServer = function(room, sockets) {
	//create a new crafty instance
	var Crafty = require('./npm_crafty.server.js').__newCrafty();

	//add net features to crafty
	var craftyNet = require('./npm_crafty.net.js');
	craftyNet.__addNet(Crafty, "SERVER", room);
	
	//initialize server routing
	craftyNet.__serverSocketSend(Crafty, sockets);
	
	return Crafty;
};
exports.addClient = function(Crafty, socket) {
	var craftyNet = require('./npm_crafty.net.js');
	
	//add client to receive list
	craftyNet.__socketReceive(Crafty, socket);
	
	//add client to send list
	craftyNet.__addClientSocket(Crafty, socket);
};


/**
* CLIENT CODE
*/
exports.createClient = function(label, room) {
	//add net features to crafty
	exports.__addNet(Crafty, label, room);
	
	return Crafty;
};
exports.setServer = function(Crafty, socket) {
	// add receive
	exports.__socketReceive(Crafty, socket);
	
	//add send
	exports.__clientSocketSend(Crafty, socket);
};