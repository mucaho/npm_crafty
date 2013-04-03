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
 * Create a crafty server instance, which will communicate with clients in the specified room.
 * Pass io.sockets as 2nd argument.
 */
npm_crafty.createServer = function( room, sockets );

/**
 * Add a client to the specified server instance, thus adding the client to the server instance room.
 */
npm_crafty.addClient = function(Crafty, socket);
```

# CLIENT
--------
```html
<head>
  <!-- load the ordinary crafty library -->
  <script src="crafty_client.js"></script>
  <!-- load the npm_crafty module -->
  <script src="npm_crafty.js"></script>
  ...
</head>
```

```javascript
/**
 * Setu
 */
exports.setupDefault
```
