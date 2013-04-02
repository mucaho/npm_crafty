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

## PongBasic
============
This is an adaptation of a [basic pong game](http://craftyjs.com/tutorial/getting-started/how-crafty-works#a_simple_game_of_pong).

In this basic version, one client controls both paddles. The input is send to the server. The server
handles the game logic. The server feeds the updated game logic to the client. The client displays the entities.

Note that npm_crafty only handles **low-level networking**. In a real world example, where the server
is not __localhost__ you would have to predict client movement on the client locally and adjust the movement
accordingly when a corrected position update of the server arrives.

The relevant files are:
* __pongBasic.client.html__
* __pongBasic.server.js__
* __pongBasic.game.js__
  * all __common features__ of entities are defined equally in both server and client
  * the client adds __input and output features__ to entites
  * the server adds __game logic__ features to entities
  * both the client and the server communicate via __net events__
  
