/**
 * The npm_crafty client module. Contains the Client API.
 * @module "npm_crafty.client"
 * @requires module:"npm_crafty.net"
 * @requires module:"npm_crafty.matchmaking"
 */

var craftyNet = require('./npm_crafty.net.js');
var matchmaker = require('./npm_crafty.matchmaking.js');


/**
 * Construct a Crafty client instance with net features enabled. <br />
 * The <code>label</code> is used to determine which code to execute.
 *
 * @memberof module:"npm_crafty.client"~Client#
 * @param {!module:"npm_crafty.net"#PeerLabel} label - the label to use for this client instance
 * @returns {!external:CraftyJS.Crafty} the newly created Crafty client instance with net features enabled
 * @see external:CraftyJS.Crafty#define
 *
 * @example
 * var Client = require('npm_crafty')();
 * var Crafty = Client.createInstance("CLIENT");
 */
var createInstance = function(label) {
	//add net features to crafty
	craftyNet.__addNet(Crafty, label, "");
	
	return Crafty;
};

/**
 * Bind the server <code>socket</code> to the Crafty client instance.
 * The Crafty net features will use this <code>socket</code> to communicate with the server.
 *
 * @memberof module:"npm_crafty.client"~Client#
 * @param {!external:CraftyJS.Crafty} Crafty - the Crafty client instance to bind the socket to
 * @param {!external:Socket | !external:Sockets} socket - the socket or socket namespace to use for communication with server
 * @returns {!external:CraftyJS.Crafty} the Crafty instance for method chaining
 *
 * @example
 * var Client = require('npm_crafty')();
 * var Crafty = Client.createInstance("CLIENT");
 * Client.setServer(Crafty, socket);
 *
 * @see module:"npm_crafty.client"~Client#unsetServer
 */
var setServer = function(Crafty, socket) {
	// set to receive from server
	craftyNet.__setInputSocket(Crafty, socket);
	// set to send to server
	craftyNet.__setClientOutputSocket(Crafty, socket);

	return Crafty;
};

/**
 * Unbind the server <code>socket</code> from the Crafty client instance.
 * The Crafty net features will no longer use this <code>socket</code> to communicate with the server.
 *
 * @memberof module:"npm_crafty.client"~Client#
 * @param {!external:CraftyJS.Crafty} Crafty - the Crafty client instance to unbind the socket from
 * @param {!external:Socket | !external:Sockets} socket - the socket or socket namespace to no longer use for communication with server
 * @returns {!external:CraftyJS.Crafty} the Crafty instance for method chaining
 *
 * @example
 * var Client = require('npm_crafty')();
 * var Crafty = Client.createInstance("CLIENT");
 * Client.setServer(Crafty, socket);
 * Client.unsetServer(Crafty, socket);
 *
 * @see module:"npm_crafty.client"~Client#setServer
 */
var unsetServer = function(Crafty, socket) {
	// set to receive from server
	craftyNet.__unsetInputSocket(Crafty, socket);
	// set to send to server
	craftyNet.__setClientOutputSocket(Crafty, null);

	return Crafty;
};

/**
 * The Client API.
 * <br />
 * Can be constructed with this constructor or by calling the [default setup method]{@link module:"npm_crafty.client"~Client.setupDefault}.
 * After construction, various methods are available for creating a crafty client instance with net features and for connecting these net features to socket.io.
 * <br />
 * Also offers a static method for [automatic matchmaking](module:"npm_crafty.client"~Client.MatchMaker).
 *
 * @class
 * @property {object} [io] - the socket.io instance; only available after calling the [default setup method]{@link module:"npm_crafty.client"~Client.setupDefault}
 *
 * @example
 * var Client = require('npm_crafty')();
 */
function Client() {
	return {
		createInstance: createInstance,
		setServer: setServer,
		unsetServer: unsetServer
	};
}


var __loadScript = function (url, callback) {
	var script = document.createElement('script');
	//script.type = 'text/javascript';
	script.src = url;

	// then bind the event to the callback function 
	// there are several events for cross browser compatibility
	script.onreadystatechange = callback;
	script.onload = callback;

	// fire the loading
	document.head.appendChild(script);
};

/**
 * Setup a default browser client, which will connect to the node server of the website automatically. <br />
 * Each callback will be called at the appropriate times.
 * Communication will be set to the default <code>'/'</code> namespace.
 *
 * @memberof module:"npm_crafty.client"~Client
 * @param {!function()} immediateFN - will be called immediately once all libraries are loaded
 * @param {!module:"npm_crafty.net"#SocketCallback} connectFN - will be called when the client connects to the server
 * @param {!module:"npm_crafty.net"#SocketCallback} disconnectFN - will be called when the client disconnects from the server
 * @param {string} [serverAddress=""] - the server address to connect to (auto-resolved usually and thus can be omitted usually) e.g. "http://localhost"
 * @returns {!module:"npm_crafty.client"~Client} - the ClientAPI object, which in addition to the available methods also contains the <code>io</code> property
 *
 * @example
 * var Crafty;
 * var Client = require('npm_crafty').setupDefault( function () { //immediate callback
 *     Crafty = Client.createInstance("CLIENT");
 * }, function (socket) { //connect callback
 *     Client.setServer(Crafty, socket);
 * }, function (socket) { //disconnect callback
 * });
 */
var setupDefault = function(immediateFN, connectFN, disconnectFN, serverAddress) {
	var path = (serverAddress ? serverAddress : "") + "/socket.io/socket.io.js";
	var _client = new Client();

	__loadScript(path, function() {
		_client.io = io;
		immediateFN();

		var socket = io.connect(serverAddress);
		socket.on('connect', function () {
			console.log('Connected ', socket.socket.sessionid);
			connectFN(socket);
		});
		socket.on('disconnect', function () {
			console.log('Disonnected ', socket.socket.sessionid);
			disconnectFN(socket);
		});
	});

	return _client;
};



Client.setupDefault = setupDefault;
Client.Matchmaker = matchmaker.ClientMatchmaker;
module.exports = Client;
