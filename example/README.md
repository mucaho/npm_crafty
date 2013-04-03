# Example
---------
Note that in all examples the path to **npm_crafty** module is specified relative to the example folder.
When you install the module you have to `var npm_crafty = require('npm_crafty');`

Run the server with `node exampleName.server.js` (from the appropriate working directory).  
Run the client by opening the url `localhost` with your browser (the browser will load the _html_ file).

## PongBasic
============
This is an adaptation of a [basic pong game](http://craftyjs.com/tutorial/getting-started/how-crafty-works#a_simple_game_of_pong).
Open __localhost__ and enter __"CLIENT1"__, then open __localhost__ again in a new tab and enter __"CLIENT2"__.
CLIENT1 controls the paddle with __W & S__, CLIENT2 with __UP & DOWN__.

In this basic version, each client controls one paddle. The input is send to the server. The server
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
  
