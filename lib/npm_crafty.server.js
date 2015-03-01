/**
* SERVER CODE
*/
var craftyLib = require('./npm_crafty.server.import.js');
var craftyNet = require('./npm_crafty.net.js');

exports.createServer = function(room, sockets) {
	// create a new crafty instance
	var Crafty = craftyLib.__newCrafty();
	// add net features to crafty
	craftyNet.__addNet(Crafty, "SERVER", room);
	
	// initialize server send list
	craftyNet.__setServerOutputSockets(Crafty, sockets || exports.io.sockets);

	return Crafty;
};

exports.addClient = function(Crafty, socket) {
	// add client to receive list
	craftyNet.__setInputSocket(Crafty, socket);
	// add client to send list
	craftyNet.__addOutputSocket(Crafty, socket);

	return Crafty;
};

exports.setupDefault = function(immediateFN, connectFN, disconnectFN, port) {
	var app = exports.app = require('express')(),
		server = exports.server = require('http').createServer(app),
		io = exports.io = require('socket.io').listen(server),
		path = require('path'),
		browserify = require('browserify-middleware');

	io.set('log level', 2);
	server.listen(port || process.env.PORT || 80);


	var browserifyOptions = {};
	browserifyOptions[path.join(__dirname + '/npm_crafty.client.js')] = {expose: 'npm_crafty'};
	app.get('/npm_crafty.js', browserify([browserifyOptions]));

	app.get('/crafty_client.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/crafty_client.js'));
	});
	

	io.sockets.on('connection', function (socket) {
		console.log("Connected ", socket.id);
		connectFN(socket);
		
		socket.on('disconnect', function (arg) {
			console.log("Disconnected ", socket.id);
			disconnectFN(socket);
		});
	});
	
	immediateFN();
};