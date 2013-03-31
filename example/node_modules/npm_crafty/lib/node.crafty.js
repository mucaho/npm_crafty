var exports = exports || {};

exports.createServer = function() {
	//create a new crafty instance
	var Crafty = require('./node.crafty_stripped.js').newCrafty();

	//add net features to crafty
	var craftyNet = require('./node.crafty_net.js');
	craftyNet.addNet(Crafty);
	
	return Crafty;
};
exports.toClient = function(socket, Crafty) {
	var craftyNet = require('./node.crafty_net.js');
	//add crafty routing to socket
	craftyNet.routeSocket(socket, Crafty);
};



exports.createClient = function() {
	//add net features to crafty
	exports.addNet(Crafty);
	
	return Crafty;
};
exports.toServer = function(socket, Crafty) {
	// add crafty routing to socket
	exports.routeSocket(socket, Crafty);
};