var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/app.html');
});

app.get('/libs/crafty_net_nodejs.js', function (req, res) {
	res.sendfile(__dirname + '/libs/crafty_net_nodejs.js');
});
app.get('/libs/crafty-0.5.3_original.js', function (req, res) {
	res.sendfile(__dirname + '/libs/crafty-0.5.3_original.js');
});


//create a new crafty instance
var Crafty = require('./libs/crafty_nodejs.js').newCrafty();

var craftyNet = require('./libs/crafty_net_nodejs.js');
//add net features to crafty
craftyNet.addNet(Crafty);

io.sockets.on('connection', function (socket) {
	//add crafty routing to socket
	craftyNet.routeSocket(socket, Crafty);
	
	console.log("Connected ", socket.id);
	socket.on('disconnect', function (arg) {
		console.log("Disconnected ", socket.id);
	});
});


//start crafty instance
//Crafty.init();

Crafty.netBind("Bla", function(data) {
	console.log(data);
});
	
