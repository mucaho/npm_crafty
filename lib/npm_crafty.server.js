/**
* SERVER CODE
*/
exports.createServer = function(room, sockets) {
	//create a new crafty instance
	var Crafty = require('./npm_crafty.server.import.js').__newCrafty();

	//add net features to crafty
	var craftyNet = require('./npm_crafty.net.js');
	craftyNet.__addNet(Crafty, "SERVER", room);
	
	//initialize server send list
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

exports.setupDefault = function(immediateFN, connectFN, disconnectFN, port) {
	var app = require('express')(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		path = require('path');
		
	var data = {
		io: io,
		app: app,
		server: server
	};

	io.set('log level', 2);
	server.listen(port || 80);

	app.get('/npm_crafty.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/npm_crafty.client.js'));
	});
	app.get('/npm_crafty.net.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/npm_crafty.net.js'));
	});
	app.get('/crafty_client.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/crafty_client.js'));
	});
	

	
	io.sockets.on('connection', function (socket) {
		console.log("Connected ", socket.id);
		connectFN(socket, data);
		
		socket.on('disconnect', function (arg) {
			console.log("Disconnected ", socket.id);
			disconnectFN(socket, data);
		});
	});
	
	
	immediateFN(data);
};