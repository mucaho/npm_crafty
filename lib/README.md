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
 * app, io, server become acessible as the module's properties.
 * 
 * Each callback will be called at the appropriate times.
 * immediateCallback = function() ... will be called immediately
 * connectCallback = function(socket) ... will be called when a client connects
 * disconnectCallback = function(socket) ... will be called when a client disconnects
 * 
 * port ... the port to use (defaults to standard HTTP port 80)
 */
npm_crafty.setupDefault = function ( immediateCallback, connectCallback, disconnectCallback, port );

/**
 * Create a crafty server instance. Each server instance shall have an unique room label.
 * 
 * The server's machine label is set to "SERVER" (used for determining which code to execute).
 */
npm_crafty.createServer = function ( room );

/**
 * Add a client socket to the server instance.
 */
npm_crafty.addClient = function ( Crafty, socket );

/**
 * The express application instance.
 * It is only available after calling npm_crafty.setupDefault(...);
 */
npm_crafty.app;

/**
 * The http server instance.
 * It is only available after calling npm_crafty.setupDefault(...);
 */
npm_crafty.server;

/**
 * The socket.io instance.
 * It is only available after calling npm_crafty.setupDefault(...);
 */
npm_crafty.io;
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
 * immediateCallback = function() ... will be called immediately
 * connectCallback = function(socket) ... will be called when the client connects to the server
 * disconnectCallback = function(socket) ... will be called when the client disconnects from the server
 */
exports.setupDefault = function ( immediateCallback, connectCallback, disconnectCallback );

/**
 * Create a crafty client instance.
 * 
 * The client's machine label is set to the argument LABEL (used for determining which code to execute).
 */
exports.createClient = function ( label );

/**
 * Bind the server socket to the client instance.
 */
exports.setServer = function ( Crafty, socket );
```
