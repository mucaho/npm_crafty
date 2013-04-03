# SERVER
--------

```javascript
/**
 * Import the npm_crafty module
 */
var npm_crafty = require('npm_crafty');

/**
 * Setup a default node server, which will serve npm_crafty's required files (it will reply to GET requests).
 * socket.io is attached to the server also.
 * 
 * Each callback will be called at the appropriate times, an object data = {app, io, server} will be supplied.
 * 
 * immediateCallback = function(data) ... will be called immediately
 * connectCallback = function(socket, data) ... will be called when a client connects
 * disconnectCallback = function(socket, data) ... will be called when a client disconnects
 * port ... the port to use
 */
npm_crafty.setupDefault = function( immediateCallback, connectCallback, disconnectCallback, port );

/**
 * Create a crafty server instance. Each server instance shall have an unique room label.
 * Pass io.sockets as 2nd argument.
 * 
 * The server's machine label is set to "SERVER" (used in determining which code to execute).
 */
npm_crafty.createServer = function( room, sockets );

/**
 * Add a client socket to the server instance.
 */
npm_crafty.addClient = function(Crafty, socket);
```

# CLIENT
--------
```html
<head>
  <!-- load the ordinary crafty library -->
  <script src="crafty_client.js"></script>
  <!-- import the npm_crafty module -->
  <script src="npm_crafty.js"></script>
  ...
</head>
```

```javascript
/**
 * Setup a default browser client, which will connect to the node server of the website automatically.
 * 
 * Each callback will be called at the appropriate times.
 * 
 * immediateCallback = function() ... will be called immediately
 * connectCallback = function(socket) ... will be called when the client connects to the server
 * disconnectCallback = function(socket) ... will be called when the client disconnects from the server
 */
exports.setupDefault = function( immediateCallback, connectCallback, disconnectCallback);

/**
 * Create a crafty client instance.
 * 
 * The client's machine label is set to LABEL (used in determining which code to execute).
 */
exports.createClient = function(label, room);

/**
 * Bind the server socket to the client instance.
 */
exports.setServer = function(Crafty, socket);
```
