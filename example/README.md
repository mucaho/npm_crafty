# Example
---------
Note that in all examples the path to **npm_crafty** module is specified relative to the example folder.
When you install the module you have to `var npm_crafty = require('npm_crafty');`

Run the server with `node exampleName.server.js` (from the appropriate working directory).  
Run the client by opening the url `localhost` with your browser (the browser will load the _html_ file).

## Simple
=========
This example shows you basic usage of npm_crafty for creating one client-server room.   
The server initiates an event on client connect. The client logs the event and replies back to the server. 
The server logs the event.

### Server
```javascript
var npm_crafty = require('../lib/npm_crafty.server');
var path = require('path');
var Crafty;

//setup default server with the following arguments
npm_crafty.setupDefault( function () { //immediate callback

	//setup additional get requests
	npm_crafty.app.get('/', function (req, res) {
		res.sendfile(path.join(__dirname + '/simple.client.html'));
	});
	
	//create Crafty Server and bind it to "Room1"
	Crafty = npm_crafty.createServer("Room1");
	
	//server will receive event from client back
	Crafty.netBind("CustomEvent", function(msg) {
		console.log("2. Server receive event");
	});
	
}, function (socket) { //connect callback

	//bind client socket to crafty instance, thus "Room1"
	npm_crafty.addClient(Crafty, socket);
	
	//send event to newly connected client
	Crafty.netTrigger("CustomEvent", "customData");
	
}, function (socket) { //disconnect callback
});
```
### Client
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Simple</title>
    <script src="crafty_client.js"></script>
    <script src="npm_crafty.js"></script>
  </head>
  <body>
	<script>
	window.onload = function() {
		exports.setupDefault(function() { //immediate callback after Crafty with Crafty.net is available
			
			//create Crafty Client which will be labelled CLIENT
			Crafty = exports.createClient("CLIENT");
			
			//client will receive event and send back to server
			Crafty.netBind("CustomEvent", function(data) {
				console.log("1. Client receive event");
				Crafty.netTrigger("CustomEvent", data, false);
			});
			
		}, function(socket) { //connect callback
		
			//bind client socket to server socket
			exports.setServer(Crafty, socket);
			
		}, function(socket) { // disconnect callback
		});
	};
	</script>
  </body>
</html>
```


## PongBasic
============
This is an adaptation of a [basic pong game](http://craftyjs.com/tutorial/getting-started/how-crafty-works#a_simple_game_of_pong).
Open __localhost__ and enter __"CLIENT1"__, then open __localhost__ again in a new tab and enter __"CLIENT2"__.
CLIENT1 controls the paddle with __W & S__, CLIENT2 with __UP & DOWN__.

In this basic version, each client controls one paddle. The input is send to the server. The server
handles the game logic. The server feeds the updated game state back to the client. The client displays the entities.

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
  
