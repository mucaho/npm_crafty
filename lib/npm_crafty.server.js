/** 
 * The npm_crafty server module. Contains the Server API.
 * @module "npm_crafty.server"
 * @requires module:"npm_crafty.net"
 * @requires module:"npm_crafty.matchmaking"
 */

var craftyLib = require('./npm_crafty.server.import.js');
var craftyNet = require('./npm_crafty.net.js');
var matchmaker = require('./npm_crafty.matchmaking.js');




/**
 * Construct a Crafty server instance with net features enabled.
 * <br />
 * Each server instance shall have an unique <code>room</code> name. 
 * Only client and server instances within the same <code>room</code> can talk to each other.
 * <br />
 * This method also set's the server instance's [label]{@link module:"npm_crafty.net"#PeerLabel} to <code>"SERVER"</code>.
 * 
 * @memberof module:"npm_crafty.server"~Server#
 * @param {!module:"npm_crafty.net"#RoomName} room - the room to use for this server instance
 * @returns {!external:CraftyJS.Crafty} the newly created crafty client instance with net features enabled
 * @see external:CraftyJS.Crafty#define
 *
 * @example
 * var Server = require('npm_crafty')(io.sockets);
 * var Crafty = Server.createInstance("Room1");
 */
var createInstance = function(room, sockets) {
	// create a new crafty instance
	var Crafty = craftyLib.__newCrafty();
	// add net features to crafty
	craftyNet.__addNet(Crafty, "SERVER", room);
	
	// initialize server send list
	craftyNet.__setServerOutputSockets(Crafty, sockets);

	return Crafty;
};

/**
 * Add a client <code>socket</code> to the Crafty server instance.
 * The Crafty net features will use this <code>socket</code> to communicate with the client.
 *
 * @memberof module:"npm_crafty.server"~Server#
 * @param {!external:CraftyJS.Crafty} Crafty - the Crafty server instance to bind the socket to
 * @param {!external:Socket} socket - the socket to use for communication with a client
 * @returns {!external:CraftyJS.Crafty} the Crafty instance for method chaining
 *
 * @example
 * var Server = require('npm_crafty')(io.sockets);
 * var Crafty = Server.createInstance("Room1");
 * Server.addClient(Crafty, socket);
 *
 * @see module:"npm_crafty.server"~Server#removeClient
 */
var addClient = function(Crafty, socket) {
	// add client to receive list
	craftyNet.__setInputSocket(Crafty, socket);
	// add client to send list
	craftyNet.__addOutputSocket(Crafty, socket);

	return Crafty;
};

/**
 * Remove a client <code>socket</code> from the Crafty server instance.
 * The Crafty net features will no longer use this <code>socket</code> to communicate with the client.
 *
 * @memberof module:"npm_crafty.server"~Server#
 * @param {!external:CraftyJS.Crafty} Crafty - the Crafty server instance to unbind the socket from
 * @param {!external:Socket} socket - the socket to no longer use for communication with a client
 * @returns {!external:CraftyJS.Crafty} the Crafty instance for method chaining
 *
 * @example
 * var Server = require('npm_crafty')(io.sockets);
 * var Crafty = Server.createInstance("Room1");
 * Server.addClient(Crafty, socket);
 * Server.removeClient(Crafty, socket);
 *
 * @see module:"npm_crafty.server"~Server#addClient
 */
var removeClient = function(Crafty, socket) {
	// add client to receive list
	craftyNet.__unsetInputSocket(Crafty, socket);
	// add client to send list
	craftyNet.__removeOutputSocket(Crafty, socket);
};

/**
 * The Server API.
 * <br />
 * Can be constructed with this constructor or by calling the [default setup method]{@link module:"npm_crafty.server"~Server.setupDefault}.
 * After construction, various methods are available for creating a crafty server instance with net features and for connecting these net features to socket.io.
 * <br />
 * Also offers a static method for [automatic matchmaking](module:"npm_crafty.server"~Server.MatchMaker).
 * <br />
 * The <code>sockets</code> parameter contains the Socket.IO namespace to use for all Crafty related data.
 *
 * @class
 * @param {!external:Sockets} sockets - the socket namespace to use for all Crafty-related communication
 * @property {object} [app] - the express application instance; only available after calling the [default setup method]{@link module:"npm_crafty.server"~Server.setupDefault}
 * @property {object} [server] - the http server instance; only available after calling the [default setup method]{@link module:"npm_crafty.server"~Server.setupDefault}
 * @property {object} [io] - the socket.io instance; only available after calling the [default setup method]{@link module:"npm_crafty.server"~Server.setupDefault}
 *
 * @example
 * var Server = require('npm_crafty')(io.of("/crafty"));
 */
function Server(sockets) {
	return {
		createInstance: function(room) {
			return createInstance(room, sockets);
		},
		addClient: addClient,
		removeClient: removeClient
	};
}


/**
 * Setup a default node server, which will serve npm_crafty's required files (it will reply to GET requests). <br />
 * Each callback will be called at the appropriate times.
 * Communication will be set to the default <code>'/'</code> namespace.
 *
 * @memberof module:"npm_crafty.server"~Server
 * @param {!function()} immediateFN - will be called immediately once all libraries are loaded
 * @param {!module:"npm_crafty.net"#SocketCallback} connectFN - will be called when a client connects to the server
 * @param {!module:"npm_crafty.net"#SocketCallback} disconnectFN - will be called when a client disconnects from the server
 * @param {number} [port=80] - the port to use (defaults to <code>process.env.PORT</code>; falls back to standard HTTP port <code>80</code>)
 * @returns {!module:"npm_crafty.server"~Server} - the ServerAPI object, which in addition to the available methods also contains the <code>app</code>, <code>server</code> and <code>io</code> property
 *
 * @example
 * var Crafty;
 * var Server = require('npm_crafty').setupDefault( function () { //immediate callback
 *     Crafty = Server.createInstance("Room1");
 * }, function (socket) { //connect callback
 *     Server.addClient(Crafty, socket);
 * }, function (socket) { //disconnect callback
 * });
 */
var setupDefault = function(immediateFN, connectFN, disconnectFN, port) {
	var app = require('express')(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		path = require('path'),
		browserify = require('browserify-middleware');

	io.set('log level', 2);
	server.listen(port || process.env.PORT || 80);


	var browserifyOptions = {};
	browserifyOptions[path.join(__dirname + '/npm_crafty.client.js')] = {expose: 'npm_crafty'};
	app.get('/npm_crafty.js', browserify([browserifyOptions]));

	app.get('/crafty_client.js', function (req, res) {
		res.sendfile(path.join(__dirname + '/crafty_client.js'));
	});
	

	io.sockets.on('connection', function (socket) {
		console.log("Connected ", socket.id);
		connectFN(socket);
		
		socket.on('disconnect', function (arg) {
			console.log("Disconnected ", socket.id);
			disconnectFN(socket);
		});
	});
	process.nextTick(immediateFN);

	var _server = new Server(io.sockets);
	_server.app = app;
	_server.server = server;
	_server.io = io;
	return _server;
};

Server.setupDefault = setupDefault;
Server.Matchmaker = matchmaker.ServerMatchmaker;
module.exports = Server;