/** 
 * The npm_crafty server module. <br />
 * Allows construction of crafty server instance with net features and offers methods to connect these net features to socket.io.
 * @module "npm_crafty.server"
 * @requires module:"npm_crafty.net"
 * @property {?object} app - the express application instance; only available after calling the {@link module:"npm_crafty.server".setupDefault default setup method}
 * @property {?object} server - the http server instance; only available after calling the {@link module:"npm_crafty.server".setupDefault default setup method}
 * @property {?object} io - the socket.io instance; only available after calling the {@link module:"npm_crafty.server".setupDefault default setup method}
 */

var craftyLib = require('./npm_crafty.server.import.js');
var craftyNet = require('./npm_crafty.net.js');

/**
 * Construct a Crafty server instance with net features enabled.
 * <br />
 * Each server instance shall have an unique <code>room</code> name. 
 * Only client and server instances within the same <code>room</code> can talk to each other.
 * <br />
 * This method also set's the server instance's {@link module:"npm_crafty.net"#PeerLabel label} to <code>"SERVER"</code>.
 * <br />
 * The <code>sockets</code> parameter contains the Socket.IO namespace to use for all Crafty related data. 
 * It can be omitted when the {@link module:"npm_crafty.server".setupDefault default setup method} is called.
 * 
 * @param {!module:"npm_crafty.net"#RoomName} room - the room to use for this server instance
 * @param {!external:Sockets} [sockets] - the socket namespace to use for all communication
 * @returns {!external:Crafty} the newly created crafty client instance with net features enabled
 * @see external:Crafty.define
 *
 * @example
 * var npm_crafty = require("npm_crafty");
 * var Crafty = npm_crafty.createServer("Room1");
 */
exports.createServer = function(room, sockets) {
	// create a new crafty instance
	var Crafty = craftyLib.__newCrafty();
	// add net features to crafty
	craftyNet.__addNet(Crafty, "SERVER", room);
	
	// initialize server send list
	craftyNet.__setServerOutputSockets(Crafty, sockets || exports.io.sockets);

	return Crafty;
};

/**
 * Add a client <code>socket</code> to the Crafty server instance.
 * The Crafty net features will use this <code>socket</code> to communicate with the client.
 *
 * @param {!external:Crafty} Crafty - the Crafty server instance to bind the socket to
 * @param {!external:Socket} socket - the socket to use for communication with a client
 * @returns {!external:Crafty} the Crafty instance for method chaining
 *
 * @example
 * var npm_crafty = require("npm_crafty");
 * var Crafty = npm_crafty.createServer("Room1");
 * npm_crafty.addClient(Crafty, socket);
 */
exports.addClient = function(Crafty, socket) {
	// add client to receive list
	craftyNet.__setInputSocket(Crafty, socket);
	// add client to send list
	craftyNet.__addOutputSocket(Crafty, socket);

	return Crafty;
};

/**
 * Setup a default node server, which will serve npm_crafty's required files (it will reply to GET requests).
 * <code>app</code>, <code>io</code> and <code>server</code> become acessible as the module's properties.
 *
 * @param {!function()} immediateFN - will be called immediately once all libraries are loaded
 * @param {!module:"npm_crafty.net"#SocketCallback} connectFN - will be called when a client connects to the server
 * @param {!module:"npm_crafty.net"#SocketCallback} disconnectFN - will be called when a client disconnects from the server
 * @param {number} [port=80] - the port to use (defaults to standard HTTP port 80)
 *
 * @example
 * var npm_crafty = require("npm_crafty");
 * var Crafty;
 * npm_crafty.setupDefault( function () { //immediate callback
 *     Crafty = npm_crafty.createServer("Room1");
 * }, function (socket) { //connect callback
 *     npm_crafty.addClient(Crafty, socket);
 * }, function (socket) { //disconnect callback
 * });
 */
exports.setupDefault = function(immediateFN, connectFN, disconnectFN, port) {
	var app = exports.app = require('express')(),
		server = exports.server = require('http').createServer(app),
		io = exports.io = require('socket.io').listen(server),
		path = require('path'),
		browserify = require('browserify-middleware');

	io.set('log level', 2);
	server.listen(port || process.env.PORT || 80);


	var browserifyOptions = {};
	browserifyOptions[path.join(__dirname + '/npm_crafty.client.js')] = {expose: 'npm_crafty'};
	app.get('/npm_crafty.js', browserify([browserifyOptions]));

	app.get('/crafty_client.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/crafty_client.js'));
	});
	

	io.sockets.on('connection', function (socket) {
		console.log("Connected ", socket.id);
		connectFN(socket);
		
		socket.on('disconnect', function (arg) {
			console.log("Disconnected ", socket.id);
			disconnectFN(socket);
		});
	});
	
	immediateFN();
};



function RoomManager(namespace, availableSlots, reinitGame, startGame, stopGame) {
	this.openRoom = null;
	this.rooms = {}; // roomName -> room
	this.sockets = {}; // socketId -> room
	this.availableSlots = availableSlots;
	this.npm_crafty = exports;
	this.reinitGame = reinitGame;
	this.startGame = startGame;
	this.stopGame = stopGame;
	this.namespace = namespace;
}


RoomManager.prototype.connectClient = function(socket) {
	var npm_crafty = this.npm_crafty,
		uuid = require('node-uuid');
	var rooms = this.rooms,
		availableSlots = this.availableSlots.slice(0),
		sockets = this.sockets;

	var room = this.openRoom;
	if (room === null) {
		var roomName = uuid.v1();
		room = {
			name: roomName,
			instance: npm_crafty.createServer(roomName),
			openSlots: availableSlots,
			takenSpots: {} // socket -> slot
		}
		this.reinitGame(room.instance); // restart the game, go to lobby scene
		
		rooms[roomName] = room;
		this.openRoom = room;
	}

	var slot = room.openSlots.shift();
	room.takenSpots[socket.id] = slot;
	if (room.openSlots.length === 0) {
		this.openRoom = null;
	};
	sockets[socket.id] = room;
	npm_crafty.addClient(room.instance, socket);
	console.log("CONNECT", "\t", this.openRoom != null, "open room", "\t", Object.keys(sockets).length, "# of connected players", "\t", Object.keys(rooms).length, "# of active rooms", 
		"\n", "current room: ", "open", room.openSlots, "taken", Object.keys(room.takenSpots).length);
	
	socket.emit('GameSlot', slot);
	
	if (room.openSlots.length === 0) {
		var self = this;
		setTimeout(function() {
			var otherSocketIds = Object.keys(room.takenSpots);
			for (var i = 0; i < otherSocketIds.length; ++i) {
				self.namespace.sockets[otherSocketIds[i]].emit('GameStart');
			}
			self.startGame(room.instance); // go to main scene
		}, 5000);
	}
};

RoomManager.prototype.disconnectClient = function(socket) {
	var rooms = this.rooms,
		sockets = this.sockets,
		room = sockets[socket.id],
		slot = room.takenSpots[socket.id];

	room.openSlots.push(slot);
	delete sockets[socket.id];
	delete room.takenSpots[socket.id];
	delete rooms[room.roomName];
	if (this.openRoom === null)
		this.openRoom = room;
	console.log("DISCONNECT", "\t", this.openRoom != null, "open room", "\t", Object.keys(sockets).length, "# of connected players", "\t", Object.keys(rooms).length, "# of active rooms", 
		"\n", "current room: ", "open", room.openSlots, "taken", Object.keys(room.takenSpots).length);

	if (room !== this.openRoom) {
		var otherSocketIds = Object.keys(room.takenSpots);
		for (var i = 0; i < otherSocketIds.length; ++i) {
			this.namespace.sockets[otherSocketIds[i]].emit('GameStop');
		}
		this.stopGame(room.instance);
	}
};


exports.RoomManager = RoomManager;