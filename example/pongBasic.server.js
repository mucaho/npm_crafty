var path = require('path'),
	npm_crafty = require('../lib/npm_crafty.server'),
	pongBasic = require('./pongBasic.game.js'),
	roomManager;

//setup default server with the following arguments
npm_crafty.setupDefault( function () { //immediate callback
	//setup additional get requests
	npm_crafty.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.client.html'));
	});
	npm_crafty.app.get('/pongBasic.game.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.game.js'));
	});
	
	roomManager = new npm_crafty.RoomManager( ["CLIENT1", "CLIENT2"],  
		function(Crafty) { // function to call to create game
			pongBasic.startGame(Crafty);
		}, function(Crafty) { // function to call to destroy game
			Crafty.stop();
		}, 	function(Crafty, slot, openSlots) { // function to call when player joins
			if (openSlots.length === 0)
				Crafty.scene("main");
		}, 	function(Crafty, slot, openSlots) { // function to call when player leaves
			if (openSlots.length > 0)
				Crafty.scene("loading");
		});
	
}, function (socket) { //connect callback

	roomManager.listen(socket);
	
}, function (socket) { //disconnect callback
	//socket will auto leave room

}, 8080);
