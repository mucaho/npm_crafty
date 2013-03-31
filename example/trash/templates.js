//CLIENT

// TIP: .connect with no args does auto-discovery
var socket = io.connect('http://localhost');
// TIP: you can avoid listening on `connect` and listen on events directly too!
socket.on('connect', function () {
	socket.emit('set nickname', prompt('What is your nickname?'));
	
	socket.on('ready', function () {
		console.log('Connected !');
		socket.emit('msg', prompt('What is your message?'));
	});
	
	socket.emit('ferret', 'tobi', function (data) {
		console.log(data); // data will be 'woot'
	});
	
	socket.on('ready', function () {
		socket.emit('msg', prompt('What is your message?'));
	});
});


//SERVER

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
