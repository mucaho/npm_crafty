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
	
	roomManager = new npm_crafty.RoomManager( npm_crafty.io.sockets, ["CLIENT1", "CLIENT2"],  
		function(Crafty) { // function to call to create game
			pongBasic.startGame(Crafty);
		},
		function(Crafty) {
			Crafty.stop(); // function to call to destroy game
		});
	
}, function (socket) { //connect callback

	roomManager.listen(socket);
	
}, function (socket) { //disconnect callback
	//socket will auto leave room

	var slot = roomManager.deallocateSlot(socket);
	console.log("@ LEFT @", slot);

}, 8080);
