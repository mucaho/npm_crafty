var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/app.html');
});

/*
	socket.on('set nickname', function (name) {
		socket.set('nickname', name, function () { 
			socket.emit('ready'); 
		});
	});

	socket.on('msg', function (msg) {
		socket.get('nickname', function (err, name) {
		  console.log('Chat message by ', name);
		});
	});
	socket.volatile.emit('bieber tweet', 'msg');
	
	socket.on('ferret', function (name, fn) {
		fn('woot');
	});
	
	socket.join('justin bieber fans');
	socket.broadcast.to('justin bieber fans').emit('new fan');
	io.sockets.in('rammstein fans').emit('new non-fan');
	
	io.sockets.emit('user disconnected');
*/

//create a new crafty instance
var Crafty = require('./libs/crafty_nodejs.js').newCrafty();



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



//TODO net
Crafty.net = {
	send: function(id, eventName, eventObject) {
		_socket.emitCrafty(id, eventName, eventObject);
	},
	receive: function(id, eventName, eventObject) {
		if (id !== 0)
			Crafty(id).trigger(eventName, eventObject);
		else
			Crafty.trigger(eventName, eventObject);
	}
};



io.sockets.on('connection', function (socket) {
	Crafty.net._socket = socket;
	console.log("Connected ", socket.id);
	
	socket.on('disconnect', function (arg) {
		console.log("Disconnected ", socket.id);
	});
	
	
	
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
});






//start crafty instance
Crafty.init();

//log every frame
Crafty.e("2D, Tween")
	.bind("EnterFrame", function(frame) {
		//console.log(this.x, this.y);
	})
	/*
	.tween({x: 100, y: 100}, 100)
	.bind("TweenEnd", function() {
		this.tween({x: -this.x, y: -this.y}, 100);
	})
	*/
	;
	
