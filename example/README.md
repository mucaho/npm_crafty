# Example
---------
Note that in all examples the path to the lib files is defined relative to this directory. Once you 
install the **npm_crafty** module you have to **adjust the paths** accordingly.

## Simple
=========
Look at the _simple.server.js_ and _simple.client.html_ files.
Run the server with `node simple.server.js` (from the appropriate working directory).
Run the client by opening the url `localhost` with your browser (the browser will load the _html_ file).
The client sends the event to the server and the server logs the event.

__SERVER__
```javascript
//node&socket.io specific stuff omitted
...

//this will be called for each client that connects
var startSession = function(socket) {
	//load module
	var craftyModule = require('../lib/npm_crafty');
	//create Crafty Server
	Crafty = craftyModule.createServer();
	//bind to socket
	craftyModule.toClient(socket, Crafty);
	
	//start crafty instance
	//Crafty.init();
	//stop crafty instance
	//Crafty.stop();

	//bind to events that come over net
	Crafty.netBind("Bla", function(data) {
		console.log(data);
	});
};
```

__CLIENT__
```html
<head>
	<!-- Be sure to include the scripts in this order -->
	<script src="/socket.io/socket.io.js"></script>
	<script src="crafty_client.js"></script>
	<script src="npm_crafty.net.js"></script>
	<script src="npm_crafty.js"></script>
	...
</head>
<body>
<script>
window.onload = function() {
	//io specific stuff
	var socket = io.connect();
	...
	
	//create Crafty Client
	Crafty = exports.createClient();
	//bind to socket
	exports.toServer(socket, Crafty);
	
	//start crafty instance
	//Crafty.init();
	//stop crafty instance
	//Crafty.stop();
	
	//trigger event over net
	Crafty.netTrigger("Bla", "dudu");
};

</script>
</body>
```
