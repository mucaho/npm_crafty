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
 * The <code>sockets</code> parameter contains the Socket.IO namespace to use for all Crafty related data. 
 * It can be omitted when the {@link module:"npm_crafty.server".setupDefault default setup method} is called.
 *
 * @param {!external:Sockets} [sockets] - the socket namespace to use for all communication
 *
 */
function Server(sockets) {
	return {
		/**
		 * Construct a Crafty server instance with net features enabled.
		 * <br />
		 * Each server instance shall have an unique <code>room</code> name. 
		 * Only client and server instances within the same <code>room</code> can talk to each other.
		 * <br />
		 * This method also set's the server instance's {@link module:"npm_crafty.net"#PeerLabel label} to <code>"SERVER"</code>.
		 * 
		 * @param {!module:"npm_crafty.net"#RoomName} room - the room to use for this server instance
		 * @returns {!external:Crafty} the newly created crafty client instance with net features enabled
		 * @see external:Crafty.define
		 *
		 * @example
		 * var npm_crafty = require("npm_crafty");
		 * var Crafty = npm_crafty.createServer("Room1");
		 */
		createServer: function(room) {
			// create a new crafty instance
			var Crafty = craftyLib.__newCrafty();
			// add net features to crafty
			craftyNet.__addNet(Crafty, "SERVER", room);
			
			// initialize server send list
			craftyNet.__setServerOutputSockets(Crafty, sockets);

			return Crafty;
		},

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
		 *
		 * @see module:"npm_crafty.server".removeClient
		 */
		addClient: function(Crafty, socket) {
			// add client to receive list
			craftyNet.__setInputSocket(Crafty, socket);
			// add client to send list
			craftyNet.__addOutputSocket(Crafty, socket);

			return Crafty;
		},

		/**
		 * Remove a client <code>socket</code> from the Crafty server instance.
		 * The Crafty net features will no longer use this <code>socket</code> to communicate with the client.
		 *
		 * @param {!external:Crafty} Crafty - the Crafty server instance to unbind the socket from
		 * @param {!external:Socket} socket - the socket to no longer use for communication with a client
		 * @returns {!external:Crafty} the Crafty instance for method chaining
		 *
		 * @example
		 * var npm_crafty = require("npm_crafty");
		 * var Crafty = npm_crafty.createServer("Room1");
		 * npm_crafty.addClient(Crafty, socket);
		 * npm_crafty.removeClient(Crafty, socket);
		 *
		 * @see module:"npm_crafty.server".addClient
		 */
		removeClient: function(Crafty, socket) {
			// add client to receive list
			craftyNet.__unsetInputSocket(Crafty, socket);
			// add client to send list
			craftyNet.__removeOutputSocket(Crafty, socket);
		}
	}
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
var setupDefault = function(immediateFN, connectFN, disconnectFN, port) {
	var app = require('express')(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
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
	process.nextTick(immediateFN);

	var _server = new Server(io.sockets);
	_server.app = app;
	_server.server = server;
	_server.io = io;
	return _server;
};


function RoomManager(availableSlots, createGame, destroyGame, playerJoin, playerLeave) {
	this.rooms = {}; // roomName -> room
	this.sockets = {}; // socketId -> room
	this.availableSlots = availableSlots;
	this.createGame = createGame;
	this.destroyGame = destroyGame;
	this.playerJoin = playerJoin;
	this.playerLeave = playerLeave;
	this.uuid = require('node-uuid').v1;
}


RoomManager.prototype.createRoom = function() {
	var roomName = this.uuid();
	var room = {
		name: roomName,
		openSlots: this.availableSlots.slice(0),
		takenSpots: {} // socketId -> slot
	}

	console.log("ROOM CREATE @", "open slots #", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);
	room.userData = this.createGame(roomName);
	this.rooms[roomName] = room;

	return room;
}
RoomManager.prototype.destroyRoom = function(room) {
	console.log("ROOM DESTROY @", "open slots #", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);
	this.destroyGame(room.userData);
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

	this.sockets[socket.id] = { room: room, socket: socket };

	return slot;
}

RoomManager.prototype.deallocateSlot = function(socket) {
	var room = this.sockets[socket.id].room;
		delete this.sockets[socket.id];

	var slot = room.takenSpots[socket.id];
		delete room.takenSpots[socket.id];
	room.openSlots.push(slot);
	console.log("SLOT DEALLOCATE @", "open slots", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);

	this.deallocateRoom(room);

	return slot;
};

RoomManager.prototype.notify = function(room, slot, socket, message, notifyCallback) {
	var self = this;

	var socketIds = Object.keys(room.takenSpots);
	var ackedIds = 0;
	for (var i = 0; i < socketIds.length; ++i) {
		self.sockets[socketIds[i]].socket.emit(message, slot, function(data) {
			ackedIds++;
			if (ackedIds >= socketIds.length) {
				console.log(message, "@", slot);
				notifyCallback(room.userData, socket, slot, room.openSlots);
			}
		});
	}
};

RoomManager.prototype.listen = function(socket) {
	var self = this;

	var join = function (callback) {
		var slot = self.allocateSlot(socket),
			room = self.sockets[socket.id].room;
		console.log("JOINED @", slot);
		callback(slot);

		self.notify(room, slot, socket, "Player Joined", self.playerJoin);
	};

	var leave = function (callback) {
		var room = self.sockets[socket.id].room,
			slot = self.deallocateSlot(socket);
		console.log("LEFT @", slot);
		if (typeof callback === "function")
			callback(slot);

		self.notify(room, slot, socket, "Player Left", self.playerLeave);
	};

	socket.on('Join', join);
	socket.on('Leave', leave);
	socket.on('disconnect', leave);
};

Server.setupDefault = setupDefault;
Server.RoomManager = RoomManager;
module.exports = Server;