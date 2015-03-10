const EVENT_PLAYER_JOIN = "Player Join";
const EVENT_PLAYER_LEAVE = "Player Leave";
const EVENT_JOIN = 'Join';
const EVENT_LEAVE = 'Leave';

function ClientMatchmaker(createGame, destroyGame, playerJoin, playerLeave) {
	this.createGame = createGame;
	this.destroyGame = destroyGame;
	this.playerJoin = playerJoin;
	this.playerLeave = playerLeave;
}


ClientMatchmaker.prototype.join = function(socket) {
	var npm_crafty = this.npm_crafty,
		self = this;

	socket.on(EVENT_PLAYER_JOIN, function (slot, callback) {
		console.log(EVENT_PLAYER_JOIN, "@", slot);
		self.playerJoin(self.userData);
		callback();
	});
	socket.on(EVENT_PLAYER_LEAVE, function (slot, callback) {
		console.log(EVENT_PLAYER_LEAVE, "@", slot);
		self.playerLeave(self.userData);
		callback();
	});

	socket.emit(EVENT_JOIN, function(slot) {
		console.log(EVENT_JOIN, "@", slot);
		self.userData = self.createGame(slot, socket);
	});
};

ClientMatchmaker.prototype.leave = function(socket) {
	var npm_crafty = this.npm_crafty,
		self = this;

	socket.emit(EVENT_LEAVE, function(slot) {
		console.log(EVENT_LEAVE, "@", slot);
		self.destroyGame(self.userData, socket);
	});

	socket.removeAllListeners(EVENT_PLAYER_JOIN);
	socket.removeAllListeners(EVENT_PLAYER_LEAVE);
};


function ServerMatchmaker(availableSlots, createGame, destroyGame, playerJoin, playerLeave) {
	this.rooms = {}; // roomName -> room
	this.sockets = {}; // socketId -> room
	this.availableSlots = availableSlots;
	this.createGame = createGame;
	this.destroyGame = destroyGame;
	this.playerJoin = playerJoin;
	this.playerLeave = playerLeave;
	this.uuid = require('node-uuid').v1;
}


ServerMatchmaker.prototype.createRoom = function() {
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
ServerMatchmaker.prototype.destroyRoom = function(room) {
	console.log("ROOM DESTROY @", "open slots #", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);
	this.destroyGame(room.userData);
	delete this.rooms[room.name];
}


ServerMatchmaker.prototype.allocateRoom = function() {
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

ServerMatchmaker.prototype.deallocateRoom = function(room) {
	if (Object.keys(room.takenSpots).length === 0) {
		this.destroyRoom(room);
	}
	console.log("ROOM DEALLOCATE @", "active rooms #", Object.keys(this.rooms).length);
};

ServerMatchmaker.prototype.allocateSlot = function(socket) {
	var room = this.allocateRoom();
	
	var slot = room.openSlots.shift();
	room.takenSpots[socket.id] = slot;
	console.log("SLOT ALLOCATE @", "open slots", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);

	this.sockets[socket.id] = { room: room, socket: socket };

	return slot;
}

ServerMatchmaker.prototype.deallocateSlot = function(socket) {
	var room = this.sockets[socket.id].room;
		delete this.sockets[socket.id];

	var slot = room.takenSpots[socket.id];
		delete room.takenSpots[socket.id];
	room.openSlots.push(slot);
	console.log("SLOT DEALLOCATE @", "open slots", room.openSlots, "taken spots #", Object.keys(room.takenSpots).length);

	this.deallocateRoom(room);

	return slot;
};

ServerMatchmaker.prototype.notify = function(room, slot, socket, message, notifyCallback) {
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

ServerMatchmaker.prototype.listen = function(socket) {
	var self = this;

	var join = function (callback) {
		var slot = self.allocateSlot(socket),
			room = self.sockets[socket.id].room;
		console.log(EVENT_JOIN, "@", slot);
		callback(slot);

		self.notify(room, slot, socket, EVENT_PLAYER_JOIN, self.playerJoin);
	};

	var leave = function (callback) {
		var room = self.sockets[socket.id].room,
			slot = self.deallocateSlot(socket);
		console.log(EVENT_LEAVE, "@", slot);
		if (typeof callback === "function")
			callback(slot);

		self.notify(room, slot, socket, EVENT_PLAYER_LEAVE, self.playerLeave);
	};

	socket.on(EVENT_JOIN, join);
	socket.on(EVENT_LEAVE, leave);
	socket.on('disconnect', leave);
};


exports.ClientMatchmaker = ClientMatchmaker;
exports.ServerMatchmaker = ServerMatchmaker;