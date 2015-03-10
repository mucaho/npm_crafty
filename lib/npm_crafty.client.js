/** 
 * The npm_crafty client module. <br />
 * Allows construction of crafty client instance with net features and offers methods to connect these net features to socket.io.
 * @module "npm_crafty.client"
 * @requires module:"npm_crafty.net"
 */

var craftyNet = require('./npm_crafty.net.js');
var matchmaker = require('./npm_crafty.matchmaker.js');

function Client() {
	return {
		/**
		 * Construct a Crafty client instance with net features enabled. <br />
		 * The <code>label</code> is used to determine which code to execute.
		 *
		 * @param {!module:"npm_crafty.net"#PeerLabel} label - the label to use for this client instance
		 * @returns {!external:Crafty} the newly created Crafty client instance with net features enabled
		 * @see external:Crafty.define
		 *
		 * @example
		 * var npm_crafty = require("npm_crafty");
		 * var Crafty = npm_crafty.createClient("CLIENT");
		 */
		createClient: function(label) {
			//add net features to crafty
			craftyNet.__addNet(Crafty, label, "");
			
			return Crafty;
		},
		/**
		 * Bind the server <code>socket</code> to the Crafty client instance.
		 * The Crafty net features will use this <code>socket</code> to communicate with the server.
		 *
		 * @param {!external:Crafty} Crafty - the Crafty client instance to bind the socket to
		 * @param {!external:Socket | !external:Sockets} socket - the socket or socket namespace to use for communication with server
		 * @returns {!external:Crafty} the Crafty instance for method chaining
		 *
		 * @example
		 * var npm_crafty = require("npm_crafty");
		 * var Crafty = npm_crafty.createClient("CLIENT");
		 * npm_crafty.setServer(Crafty, socket);
		 *
		 * @see module:"npm_crafty.client".unsetServer
		 */
		setServer: function(Crafty, socket) {
			// set to receive from server
			craftyNet.__setInputSocket(Crafty, socket);
			// set to send to server
			craftyNet.__setClientOutputSocket(Crafty, socket);

			return Crafty;
		},

		/**
		 * Unbind the server <code>socket</code> from the Crafty client instance.
		 * The Crafty net features will no longer use this <code>socket</code> to communicate with the server.
		 *
		 * @param {!external:Crafty} Crafty - the Crafty client instance to unbind the socket from
		 * @param {!external:Socket | !external:Sockets} socket - the socket or socket namespace to no longer use for communication with server
		 * @returns {!external:Crafty} the Crafty instance for method chaining
		 *
		 * @example
		 * var npm_crafty = require("npm_crafty");
		 * var Crafty = npm_crafty.createClient("CLIENT");
		 * npm_crafty.setServer(Crafty, socket);
		 *
		 * @see module:"npm_crafty.client".setServer
		 */
		unsetServer: function(Crafty, socket) {
			// set to receive from server
			craftyNet.__unsetInputSocket(Crafty, socket);
			// set to send to server
			craftyNet.__setClientOutputSocket(Crafty, null);

			return Crafty;
		}
	}
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
 * @param {!function()} immediateFN - will be called immediately once all libraries are loaded
 * @param {!module:"npm_crafty.net"#SocketCallback} connectFN - will be called when the client connects to the server
 * @param {!module:"npm_crafty.net"#SocketCallback} disconnectFN - will be called when the client disconnects from the server
 * @param {string} [serverAddress=""] - the server address to connect to (auto-resolved usually and thus can be omitted usually) e.g. "http://localhost"
 *
 * @example
 * var npm_crafty = require("npm_crafty");
 * var Crafty;
 * npm_crafty.setupDefault( function () { //immediate callback
 *     Crafty = npm_crafty.createClient("CLIENT");
 * }, function (socket) { //connect callback
 *     npm_crafty.setServer(Crafty, socket);
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
