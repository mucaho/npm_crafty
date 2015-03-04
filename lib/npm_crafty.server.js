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

exports.removeClient = function(Crafty, socket) {
	// add client to receive list
	craftyNet.__unsetInputSocket(Crafty, socket);
	// add client to send list
	craftyNet.__removeOutputSocket(Crafty, socket);
}

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



function RoomManager(namespace, availableSlots, createGame, destroyGame, playerJoin, playerLeave) {
	this.rooms = {}; // roomName -> room
	this.sockets = {}; // socketId -> room
	this.availableSlots = availableSlots;
	this.npm_crafty = exports;
	this.createGame = createGame;
	this.destroyGame = destroyGame;
	this.playerJoin = playerJoin;
	this.playerLeave = playerLeave;
	this.namespace = namespace;
	this.uuid = require('node-uuid').v1;
}


RoomManager.prototype.createRoom = function() {
	var roomName = this.uuid();
	var room = {
		name: roomName,
		instance: this.npm_crafty.createServer(roomName),
		openSlots: this.availableSlots.slice(0),
		takenSpots: {} // socketId -> slot
	}

	console.log("ROOM CREATE @", "open slots #", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);
	this.createGame(room.instance);
	this.rooms[roomName] = room;

	return room;
}
RoomManager.prototype.destroyRoom = function(room) {
	console.log("ROOM DESTROY @", "open slots #", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);
	this.destroyGame(room.instance);
	delete this.rooms[room.name];
}


RoomManager.prototype.allocateRoom = function() {
	var rooms = this.rooms;

	var openRoom = null;
	for (var roomName in rooms) {
		if (rooms[roomName].openSlots.length > 0)
			openRoom = rooms[roomName];
	};
	if (openRoom === null) {
		openRoom = this.createRoom();
	}
	console.log("ROOM ALLOCATE @", "active rooms #", Object.keys(this.rooms).length);

	return openRoom;
};

RoomManager.prototype.deallocateRoom = function(room) {
	if (Object.keys(room.takenSpots).length === 0) {
		this.destroyRoom(room);
	}
	console.log("ROOM DEALLOCATE @", "active rooms #", Object.keys(this.rooms).length);
};

RoomManager.prototype.allocateSlot = function(socket) {
	var room = this.allocateRoom();
	
	var slot = room.openSlots.shift();
	room.takenSpots[socket.id] = slot;
	console.log("SLOT ALLOCATE @", "open slots", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);
	
	this.sockets[socket.id] = room;
	this.npm_crafty.addClient(room.instance, socket);

	return slot;
}

RoomManager.prototype.deallocateSlot = function(socket) {
	var room = this.sockets[socket.id];
		delete this.sockets[socket.id];
	this.npm_crafty.removeClient(room.instance, socket);

	var slot = room.takenSpots[socket.id];
		delete room.takenSpots[socket.id];
	room.openSlots.push(slot);
	console.log("SLOT DEALLOCATE @", "open slots", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);


	this.deallocateRoom(room);

	return slot;
};



RoomManager.prototype.listen = function(socket) {
	var self = this;

	socket.on('Join', function (callback) {
		var slot = self.allocateSlot(socket);
		console.log("JOINED @", slot);
		callback(slot);

		var room = self.sockets[socket.id];
		var socketIds = Object.keys(room.takenSpots);
		var ackedIds = 0;
		for (var i = 0; i < socketIds.length; ++i) {
			self.namespace.sockets[socketIds[i]].emit("Player Joined", slot, function(data) {
				ackedIds++;
				if (ackedIds >= socketIds.length) {
					console.log("PLAYER JOINED @", slot);
					self.playerJoin(room.instance, slot, room.openSlots);
				}
			});
		}
	});

	var leave = function (callback) {
		var room = self.sockets[socket.id];
		var slot = room.takenSpots[socket.id];
		var socketIds = Object.keys(room.takenSpots);
		var ackedIds = callback ? 0 : 1;
		for (var i = 0; i < socketIds.length; ++i) {
			self.namespace.sockets[socketIds[i]].emit("Player Left", slot, function(data) {
				ackedIds++;
				if (ackedIds >= socketIds.length) {
					console.log("PLAYER LEFT @", slot);
					self.playerLeave(room.instance, slot, room.openSlots);
				}
			});
		}

		var slot = self.deallocateSlot(socket);
		console.log("LEFT @", slot);
		if (callback)
			callback(slot);
	};

	socket.on('Leave', leave);
	socket.on('disconnect', leave);
};


exports.RoomManager = RoomManager;