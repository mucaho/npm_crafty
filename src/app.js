var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(80);
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/app.html');
});
app.get('/libs/node.crafty.js', function (req, res) {
	res.sendfile(__dirname + '/libs/node.crafty.js');
});
app.get('/libs/node.crafty_net.js', function (req, res) {
	res.sendfile(__dirname + '/libs/node.crafty_net.js');
});
app.get('/libs/crafty.js', function (req, res) {
	res.sendfile(__dirname + '/libs/crafty.js');
});


io.sockets.on('connection', function (socket) {
	startSession(socket);
	
	console.log("Connected ", socket.id);
	socket.on('disconnect', function (arg) {
		console.log("Disconnected ", socket.id);
	});
});

var startSession = function(socket) {
	//load module
	var craftyModule = require('./libs/node.crafty.js');
	//create Crafty Server
	Crafty = craftyModule.createServer();
	//bind to socket
	craftyModule.toClient(socket, Crafty);
	
	//start crafty instance
	//Crafty.init();
	//stop crafty instance
	//Crafty.stop();

	//bind to events that come over net
	Crafty.netBind("Bla", function(data) {
		console.log(data);
	});
}
	
