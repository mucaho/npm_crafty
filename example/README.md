# Example
---------
Look at the _app.js_ and _app.html_ files in the _src_ folder.
Run the server with `node app.js` (from the appropriate working directory).
Run the client by opening the url `localhost` with your browser (the browser will load the _html_ file).
The client sends the event to the server and the server logs the event.

__SERVER__
```javascript
//node&socket.io specific stuff omitted
...

//this will be called for each client that connects
var startSession = function(socket) {
  //load module
	var craftyModule = require('npm_crafty');
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
	<script src="lib/crafty.js"></script>
	<script src="lib/node.crafty_net.js"></script>
	<script src="lib/node.crafty.js"></script>
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
