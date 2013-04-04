var npm_crafty = require('../lib/npm_crafty.server');
var path = require('path');

//setup default server with the following arguments
npm_crafty.setupDefault( function (data) { //immediate callback

	//setup additional get requests
	npm_crafty.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/simple.client.html'));
	});
		
	//create Crafty Server and bind it to "Room1"
	data.Crafty = npm_crafty.createServer("Room1");
	
	//server will receive event from client back
	data.Crafty.netBind("CustomEvent", function(msg) {
		console.log("2. Server receive event");
	});
	
}, function (socket, data) { //connect callback

	//bind client socket to crafty instance, thus "Room1"
	npm_crafty.addClient(data.Crafty, socket);
	
	//send event to newly connected client
	data.Crafty.netTrigger("CustomEvent", "customData", false);
	
}, function (socket, data) { //disconnect callback
});

