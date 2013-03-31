var exports = exports || {};

exports.addNet = function(Crafty) {
	Crafty.netTrigger = function(eventName, eventObject) {
		Crafty.net.send(0, "NET_"+eventName, eventObject);
	};
	Crafty.netBind = function(eventName, callback) {
		Crafty.bind("NET_"+eventName, callback);
	};
	Crafty.netUnbind = function(eventName, callback) {
		Crafty.unbind("NET_"+eventName, callback);
	};

	Crafty.c("NetEvents", {
		init: function(entity) {
		},
		netTrigger: function(eventName, eventObject) {
			Crafty.net.send(this[0], "NET_"+eventName, eventObject);
		},
		netBind: function(eventName, callback) {
			this.bind("NET_"+eventName, callback);
		},
		netUnbind: function(eventName, callback) {
			this.unbind("NET_"+eventName, callback);
		}
	});



	//TODO net, getDestination() instead of _socket
	Crafty.net = {
		send: function(id, eventName, eventObject) {
			this._socket.emitCrafty(id, eventName, eventObject);
		},
		receive: function(id, eventName, eventObject) {
			if (id !== 0)
				Crafty(id).trigger(eventName, eventObject);
			else
				Crafty.trigger(eventName, eventObject);
		}
	};
};

exports.routeSocket = function(socket, Crafty) {
	Crafty.net._socket = socket;
	
	socket.on('crafty', function(netEvent) {
		var id = netEvent.id;
		var eventName = netEvent.eventName;
		var eventObject = netEvent.eventObject;
		
		Crafty.net.receive(id, eventName, eventObject);
	});
	
	socket.emitCrafty = function(id, eventName, eventObject) {
		var netEvent = {
			id: id,
			eventName: eventName,
			eventObject: eventObject
		};
		
		socket.emit('crafty', netEvent);
	};
};
