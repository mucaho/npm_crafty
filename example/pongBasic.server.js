var craftyModule = require('../lib/npm_crafty.server');
var path = require('path');

//setup default server with the following arguments
craftyModule.setupDefault( function (data) { //immediate callback
	//setup additional get requests
	data.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.client.html'));
	});
	data.app.get('/pongBasic.game.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.game.js'));
	});
		
	//create Crafty Server
	data.Crafty = craftyModule.createServer("Room1", data.io.sockets);

	//start actual game
	var pongBasic = require('./pongBasic.game.js');
	pongBasic.startGame(data.Crafty);
	
}, function (socket, data) { //connect callback
	//bind to socket
	craftyModule.addClient(data.Crafty, socket);
	
}, function (socket, data) { //disconnect callback
	//socket will auto leave room
});

