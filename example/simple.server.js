var path = require('path'),
	npm_crafty = require('../lib/npm_crafty.server');

var Crafty;
//setup default server with the following arguments
npm_crafty.setupDefault( function () { //immediate callback
	//setup additional get requests
	npm_crafty.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/simple.client.html'));
	});
	
	//create Crafty Server and bind it to "Room1"
	Crafty = npm_crafty.createServer("Room1");
	
	//server will receive event from client back
	Crafty.netBind("CustomEvent", function(msg) {
		console.log("2. Server receive event");
	});
	
}, function (socket) { //connect callback

	//bind client socket to crafty instance, thus "Room1"
	npm_crafty.addClient(Crafty, socket);
	
	//send event to newly connected client
	Crafty.netTrigger("CustomEvent", "customData");
	
}, function (socket) { //disconnect callback
});

