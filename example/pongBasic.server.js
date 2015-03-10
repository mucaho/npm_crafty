var path = require('path'),
	npm_crafty = require('../lib/npm_crafty.server'),
	pongBasic = require('./pongBasic.game.js'),
	matchmaker;

//setup default server with the following arguments
var Server = npm_crafty.setupDefault( function () { //immediate callback
	//setup additional get requests
	Server.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.client.html'));
	});
	Server.app.get('/pongBasic.game.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.game.js'));
	});
	
	//setup automatic room management
	matchmaker = new npm_crafty.Matchmaker( ["CLIENT1", "CLIENT2"], // available slots
		function(roomName) { // function to call to create game

			var Crafty = Server.createServer(roomName);
			pongBasic.startGame(Crafty);
			return Crafty;

		}, function(Crafty) { // function to call to destroy game

			Crafty.stop();

		}, 	function(Crafty, socket, slot, openSlots) { // function to call when player joins

			Server.addClient(Crafty, socket);
			if (openSlots.length === 0)
				Crafty.scene("main");

		}, 	function(Crafty, socket, slot, openSlots) { // function to call when player leaves

			Server.removeClient(Crafty, socket);
			if (openSlots.length > 0)
				Crafty.scene("loading");
		});
	
}, function (socket) { //connect callback

	matchmaker.listen(socket);
	
}, function (socket) { //disconnect callback
	//socket will auto leave room

});
