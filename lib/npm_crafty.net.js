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
			var nameCallback = function(name) {
				Crafty.net.__nameMap[name] = this;
			};
			this.bind("NewEntityName", nameCallback);
			this.bind("RemoveComponent", function(component) {
				if (component === "Net") {
					this.unbind("NewEntityName", nameCallback);
				}
			});
		},
		netTrigger: function(eventName, eventObject, isVolatile) {
			Crafty.net.send(this._entityName, "NET_"+eventName, eventObject, isVolatile);
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
		__nameMap: {},
		peerLabel: peerLabel,
		roomLabel: roomLabel,
		send: function(id, eventName, eventObject, isVolatile) {
			var netEvent = {
				id: id,
				eventName: eventName,
				eventObject: eventObject
			};
			if (isVolatile) {
				Crafty.net.__getTransport().volatile.emit('crafty', netEvent);
			} else {
				Crafty.net.__getTransport().emit('crafty', netEvent);
			}
		},
		receive: function(netEvent) {
			var id = netEvent.id;
			var eventName = netEvent.eventName;
			var eventObject = netEvent.eventObject;
			
			if (id === 0)
				Crafty.trigger(eventName, eventObject);
			else
				var ent = Crafty.net.__nameMap[id];
				if (ent)
					ent.trigger(eventName, eventObject);
		}
		/*
		dummy declaration, so no errors are thrown if net events are sent without being connected
		__getTransport: function() {
			return {emit: function(){}, volatile: {emit: function(){}}};
		}
		*/
	};
};

exports.__socketReceive = function(Crafty, socket) {
	socket.on('crafty', function(netEvent) {		
		Crafty.net.receive(netEvent);
	});
};

exports.__clientSocketSend = function(Crafty, socket) {
	Crafty.net.__getTransport = function() {
		return socket;
	};
};

exports.__addClientSocket = function(Crafty, socket) {
	socket.join(Crafty.net.roomLabel);
};

exports.__serverSocketSend = function(Crafty, sockets) {
	Crafty.net.__getTransport = function() {
		return sockets.in(Crafty.net.roomLabel);
	};
};
