var npm_crafty = require('../lib/npm_crafty.server');
var path = require('path');

//setup default server with the following arguments
npm_crafty.setupDefault( function (data) { //immediate callback
	//setup additional get requests
	npm_crafty.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.client.html'));
	});
	npm_crafty.app.get('/pongBasic.game.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/pongBasic.game.js'));
	});
		
	//create Crafty Server and bind it to "Room1"
	data.Crafty = npm_crafty.createServer("Room1");
	
	//start the loading scene of our game
	var pongBasic = require('./pongBasic.game.js');
	pongBasic.startGame(data.Crafty);

	//make a client counter -> if it reaches 2, start the main scene
	data.clients = 0;
	
}, function (socket, data) { //connect callback
	//bind to socket
	npm_crafty.addClient(data.Crafty, socket);
	
	//increase client counter
	data.clients++;
	if (data.clients === 2) { //2 clients connected
		//start main scene
		data.Crafty.scene("main");
	}
	
}, function (socket, data) { //disconnect callback
	//socket will auto leave room
	
	data.clients--;
	//start the loading scene again
	data.Crafty.scene("loading");
});

//TODO auto manage rooms and clients;