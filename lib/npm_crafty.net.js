var exports = exports || {};

exports.__addNet = function(Crafty, peerLabel, roomLabel) {
	Crafty.netTrigger = function(eventName, eventObject, isVolatile) {
		Crafty.net.send(0, "NET_"+eventName, eventObject, isVolatile);
		return Crafty;
	};
	Crafty.netBind = function(eventName, callback) {
		Crafty.bind("NET_"+eventName, callback);
		return Crafty;
	};
	Crafty.netUnbind = function(eventName, callback) {
		Crafty.unbind("NET_"+eventName, callback);
		return Crafty;
	};
	Crafty.define = function(label, callback) {
		if (Crafty.net.peerLabel.indexOf(label) !== -1) {
			callback.call(Crafty);
		}
		return Crafty;
	};

	Crafty.c("Net", {
		init: function(entity) {
		},
		netTrigger: function(eventName, eventObject, isVolatile) {
			Crafty.net.send(this[0], "NET_"+eventName, eventObject, isVolatile);
			return this;
		},
		netBind: function(eventName, callback) {
			this.bind("NET_"+eventName, callback);
			return this;
		},
		netUnbind: function(eventName, callback) {
			this.unbind("NET_"+eventName, callback);
			return this;
		},
		define: function(label, callback) {
			if (Crafty.net.peerLabel.indexOf(label) !== -1) {
				callback.call(this);
			}
			return this;
		}
	});


	Crafty.net = {
		peerLabel: peerLabel,
		roomLabel: roomLabel,
		send: function(id, eventName, eventObject, isVolatile) {
			var netEvent = {
				id: id,
				eventName: eventName,
				eventObject: eventObject
			};
			this.emitCrafty(netEvent, isVolatile);
		},
		receive: function(netEvent) {
			var id = netEvent.id;
			var eventName = netEvent.eventName;
			var eventObject = netEvent.eventObject;
			
			if (id !== 0)
				Crafty(id).trigger(eventName, eventObject);
			else
				Crafty.trigger(eventName, eventObject);
		}
	};
};

exports.__socketReceive = function(Crafty, socket) {
	socket.on('crafty', function(netEvent) {		
		Crafty.net.receive(netEvent);
	});
};

exports.__clientSocketSend = function(Crafty, socket) {
	Crafty.net.emitCrafty = function(netEvent, isVolatile) {
		if (isVolatile) {
			socket.volatile.emit('crafty', netEvent);
		} else {
			socket.emit('crafty', netEvent);
		}
	};
};

exports.__addClientSocket = function(Crafty, socket) {
	socket.join(Crafty.net.roomLabel);
};

exports.__serverSocketSend = function(Crafty, sockets) {
	Crafty.net.emitCrafty = function(netEvent, isVolatile) {
		if (isVolatile) {
			sockets.in(Crafty.net.roomLabel).volatile.emit('crafty', netEvent);
		} else {
			sockets.in(Crafty.net.roomLabel).emit('crafty', netEvent);
		}
	};
};
