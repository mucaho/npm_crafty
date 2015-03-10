/**
 * A SocketIO socket.
 * @external Socket
 * @see {@link https://github.com/Automattic/socket.io/tree/0.9.17#short-recipes}
 */

 /**
 * A SocketIO namespace.
 * @external Sockets
 * @see {@link https://github.com/Automattic/socket.io/tree/0.9.17#restricting-yourself-to-a-namespace}
 */

/**
 * The CraftyJS library.
 * @external CraftyJS
 * @see {@link http://craftyjs.com/api/}
 */

/**
 * A CraftyJS instance.
 * @class Crafty
 * @memberof external:CraftyJS
 * @see {@link http://craftyjs.com/api/Crafty.html}
 */

/**
 * A CraftyJS entity.
 * @class e
 * @memberof external:CraftyJS
 * @see {@link http://craftyjs.com/api/Crafty-e.html}
 */

 /**
 * A CraftyJS component.
 * @class c
 * @memberof external:CraftyJS
 * @see {@link http://craftyjs.com/api/Crafty-c.html}
 */

/**
 * A CraftyJS event or an user-defined event.
 *
 * @event external:CraftyJS#EventObject
 * @type {*}
 * @see {@link http://craftyjs.com/api/events.html Crafty built-in events}
 */

/**
 * Event callback triggered by a Crafty event.
 * @callback external:CraftyJS~EventCallback
 * @param {external:CraftyJS#event:EventObject} event - the event object that was triggered with the event
 */


/** 
 * The npm_crafty net module. 
 * Contains the additional net features that are added to a [Crafty client or server instance]{@link external:CraftyJS.Crafty}, as well as to [Crafty entities]{@link external:CraftyJS.e}.
 * @module "npm_crafty.net"
 */

/**
 * This is a callback accepting a <code>socket</code> argument.
 * @callback module:"npm_crafty.net"#SocketCallback
 * @param {external:Socket} socket - the connected/disconnected socket
 */

/**
 * A peer label.
 * @typedef {!string} module:"npm_crafty.net"#PeerLabel
 */

/**
 * A room name.
 * @typedef {!string} module:"npm_crafty.net"#RoomName
 */

const NET_EVENT_PREFIX = "__NET__";
const EVENT_CHANNEL = "crafty";

exports.__addNet = function(Crafty, peerLabel, roomName) {
	/**
	 * Triggers an event over the net. Other than that it is functionally the same as the [default trigger method]{@link http://craftyjs.com/api/Crafty%20Core.html#-trigger}.
	 * The events will be delivered to the Crafty instance(s) at the other end of the network.
	 * <br />
	 * If this is called on the server instance, triggers the event on all client instances.
	 * If this is called on the client instance, trigger the event on the server instance.
	 * <br />
	 * The <code>isVolatile</code> parameter specifies if the transmission should be guaranteed to be delivered to the other end or not. 
	 * If set to <code>true</code>, the event can get lost over the network, but it increases the network performance (useful for transmitting events every frame, like position updates).
	 *
	 * @method external:CraftyJS.Crafty#netTrigger
	 * @fires external:CraftyJS#event:EventObject
	 * @param {!string} eventName - the event name
	 * @param {!string} eventObject - the event object
	 * @param {boolean} [isVolatile=false] - whether the event should be sent reliably or not; if set to <code>true</code> the event will not be sent reliably
	 * @returns {!external:CraftyJS.Crafty} this Crafty instance for method chaining
	 * @see external:CraftyJS.Crafty#netBind
	 * @see external:CraftyJS.Crafty#netUnbind
	 * @example
	 * Crafty.netTrigger("GameOver", {score: 11});
	 * Crafty.netTrigger("GameOver", {score: 11}, false); // equivalent to the above
	 */
	Crafty.netTrigger = function(eventName, eventObject, isVolatile) {
		Crafty.net.send(0, NET_EVENT_PREFIX + eventName, eventObject, isVolatile);
		return Crafty;
	};
	/**
	 * Binds to an event over the net. Other than that it is functionally the same as the [default bind method]{@link http://craftyjs.com/api/Crafty%20Core.html#-bind}.
	 * The events will be delivered to the Crafty instance(s) at the other end of the network.
	 * <br />
	 * If the event was triggered on the server instance, the event will be received on all client instances.
	 * If the event was triggered on a client instance, the event will be received on the server instance.
	 *
	 * @method external:CraftyJS.Crafty#netBind
	 * @listens external:CraftyJS#event:EventObject
	 * @param {!string} eventName - the event name
	 * @param {!external:CraftyJS~EventCallback} callback - the callback to execute upon event receipt
	 * @returns {!external:CraftyJS.Crafty} this Crafty instance for method chaining
	 * @see external:CraftyJS.Crafty#netUnbind
	 * @see external:CraftyJS.Crafty#netTrigger
	 * @example
	 * Crafty.netBind("GameOver", function(data) {
	 *     console.log("Congratulations, you achieved " + data.score + " points!");
	 * });
	 */
	Crafty.netBind = function(eventName, callback) {
		Crafty.bind(NET_EVENT_PREFIX + eventName, callback);
		return Crafty;
	};
	/**
	 * Unbinds from an event over the net. Other than that it is functionally the same as the [default unbind method]{@link http://craftyjs.com/api/Crafty%20Core.html#-unbind}.
	 * The events will be delivered to the Crafty instance(s) at the other end of the network.
	 * <br />
	 * If the event was triggered on the server instance, the event will be received on all client instances.
	 * If the event was triggered on a client instance, the event will be received on the server instance.
	 *
	 * @method external:CraftyJS.Crafty#netUnbind
	 * @listens external:CraftyJS#event:EventObject
	 * @param {!string} eventName - the event name
	 * @param {!external:CraftyJS~EventCallback} callback - the callback to execute upon event receipt
	 * @returns {!external:CraftyJS.Crafty} this Crafty instance for method chaining
	 * @see external:CraftyJS.Crafty#netBind
	 * @see external:CraftyJS.Crafty#netTrigger
	 * @example
	 * var callback = function(data) {
	 *     console.log("Congratulations, you achieved " + data.score + " points!");
	 * };
	 * Crafty.netBind("GameOver", callback);
	 * Crafty.netUnbind("GameOver", callback);
	 */
	Crafty.netUnbind = function(eventName, callback) {
		Crafty.unbind(NET_EVENT_PREFIX + eventName, callback);
		return Crafty;
	};
	/**
	 * Define code which will be executed on a specific [Crafty network instance]{@link external:CraftyJS.Crafty}.
	 * <br />
	 * The <code>label</code> argument is used to determine if this code is to be run on this Crafty instance.
	 * Iff this instance's <code>label</code> starts with the given <code>label</code>, the <code>callback</code> is executed.
	 * This instance's <code>label</code> is specified on the client / server creation.
	 *
	 * @method external:CraftyJS.Crafty#define
	 * @param {!module:"npm_crafty.net"#PeerLabel} label - the label this instance's label has to start with in order for the callback to be executed
	 * @param {!function()} callback - the callback to execute if this instance's label starts with the given label
	 * @returns {!external:CraftyJS.Crafty} this Crafty instance for method chaining
	 *
	 * @example <caption>create an entity on the Crafty instance, whose label contains "CLIENT"</caption>
	 * Crafty.define("CLIENT", function() {
	 *     Crafty.e("2D, DOM, Text")
	 *           .attr({ x: 100, y: 100 })
	 *           .text("Loading, please stand by."); 
	 * });
	 * @see module:"npm_crafty.client"~Client#createInstance
	 * @see module:"npm_crafty.server"~Server#createInstance
	 */
	Crafty.define = function(label, callback) {
		if (Crafty.net.peerLabel.indexOf(label) !== -1) {
			callback.call(Crafty);
		}
		return Crafty;
	};

	/**
	 * A [Crafty component]{@link external:CraftyJS.c} that adds net capabilities to [Crafty entities]{@link external:CraftyJS.e}. <br />
	 * It is necessary to add it to all entities that require net capabilities. <br />
	 * It is necessary to set an unique [entity name]{@link http://craftyjs.com/api/Crafty%20Core.html#-setName} when adding the component, 
	 * which will be used to route events to correct entities on the other end of the network.
	 *
	 * @class Net
	 * @augments external:CraftyJS.c
	 * @memberof external:CraftyJS
	 * @example <caption>Add net capabilities to an entity</caption>
	 * var myEntity = Crafty.e("2D, Net, DOM, Color")
	 *                      .setName("MyUniqueEntity");
	 */
	Crafty.c("Net", {
		init: function() {
			var nameMap = Crafty.net.__nameMap;
			
			var removeOldEntry = function() {
				if (this._oldEntityName)
					if (nameMap[this._oldEntityName] === this)
						delete nameMap[this._oldEntityName];
			};
			var modifyMap = function() {
				if (this._entityName) {
					nameMap[this._entityName] = this;
					removeOldEntry.call(this);	
					this._oldEntityName = this._entityName;
				}
			};
			this.bind("NewEntityName", modifyMap);
			this.bind("RemoveComponent", function(component) {
				if (component === "Net") {
					this.unbind("NewEntityName", modifyMap);
					removeOldEntry.call(this);
				}
			});
			
			modifyMap.call(this);
		},
		/**
		 * Triggers an event over the net. Other than that it is functionally the same as the [default trigger method]{@link http://craftyjs.com/api/Crafty%20Core.html#-trigger}.
		 * The events will be delivered to the [Crafty entity]{@link external:CraftyJS.e} with the same [entity name]{@link http://craftyjs.com/api/Crafty%20Core.html#-setName} on the other end of the network,
		 * thus specifying an unique logical name for each entity is highly recommended.
		 * <br />
		 * If this is called on a server entity, triggers the event on all client entities.
		 * If this is called on a client entity, triggers the event on the server entitiy.
		 * <br />
		 * The <code>isVolatile</code> parameter specifies if the transmission should be guaranteed to be delivered to the other end or not. 
		 * If set to <code>true</code>, the event can get lost over the network, but it increases the network performance (useful for transmitting events every frame, like position updates).
		 *
		 * @method external:CraftyJS.e#netTrigger
		 * @fires external:CraftyJS#event:EventObject
		 * @param {!string} eventName - the event name
		 * @param {!string} eventObject - the event object
		 * @param {boolean} [isVolatile=false] - whether the event should be sent reliably or not; if set to <code>true</code> the event will not be sent reliably
		 * @returns {!external:CraftyJS.e} this Crafty entity for method chaining
		 * @see external:CraftyJS.e#netBind
		 * @see external:CraftyJS.e#netUnbind
		 * @example
		 * var ent = Crafty.e("Net")
		 *                 .setName("MyEntity")
		 *                 .netTrigger("Moved", {x: this.x, y: this.y});
		 */
		netTrigger: function(eventName, eventObject, isVolatile) {
			Crafty.net.send(this._entityName, NET_EVENT_PREFIX + eventName, eventObject, isVolatile);
			return this;
		},
		/**
		 * Binds to an event over the net. Other than that it is functionally the same as the [default bind method]{@link http://craftyjs.com/api/Crafty%20Core.html#-bind}.
		 * The events are received at the [Crafty entity]{@link external:CraftyJS.e} with the same [entity name]{@link http://craftyjs.com/api/Crafty%20Core.html#-setName} as 
		 * the triggering [Crafty entity]{@link external:CraftyJS.e} on the other end of the network.
		 * <br />
		 * If the event was triggered on a server entity, the event will be received on all client entities.
		 * If the event was triggered on a client entity, the event will be received on the server entity.
		 *
		 * @method external:CraftyJS.e#netBind
		 * @listens external:CraftyJS#event:EventObject
		 * @param {!string} eventName - the event name
		 * @param {!external:CraftyJS~EventCallback} callback - the callback to execute upon event receipt
		 * @returns {!external:CraftyJS.e} this Crafty entity for method chaining
		 * @see external:CraftyJS.e#netUnbind
		 * @see external:CraftyJS.e#netTrigger
		 * @example
		 * var ent = Crafty.e("Net")
		 *                 .setName("MyEntity")
		 *                 .netBind("Moved", function(data) {
		 *                     this.x = data.x;
		 *                     this.y = data.y;
		 *                 });
		 */
		netBind: function(eventName, callback) {
			this.bind(NET_EVENT_PREFIX + eventName, callback);
			return this;
		},
		/**
		 * Unbinds from an event over the net. Other than that it is functionally the same as the [default unbind method]{@link http://craftyjs.com/api/Crafty%20Core.html#-unbind}.
		 * The events are received at the [Crafty entity]{@link external:CraftyJS.e} with the same [entity name]{@link http://craftyjs.com/api/Crafty%20Core.html#-setName} as 
		 * the triggering [Crafty entity]{@link external:CraftyJS.e} on the other end of the network.
		 * <br />
		 * If the event was triggered on a server entity, the event will be received on all client entities.
		 * If the event was triggered on a client entity, the event will be received on the server entity.
		 *
		 * @method external:CraftyJS.e#netUnbind
		 * @listens external:CraftyJS#event:EventObject
		 * @param {!string} eventName - the event name
		 * @param {!external:CraftyJS~EventCallback} callback - the callback to execute upon event receipt
		 * @returns {!external:CraftyJS.e} this Crafty entity for method chaining
		 * @see external:CraftyJS.e#netBind
		 * @see external:CraftyJS.e#netTrigger
		 * @example
		 * var callback = function(data) {
		 *     this.x = data.x;
		 *     this.y = data.y;
		 * };
		 * var ent = Crafty.e("Net").setName("MyEntity");
		 * ent.netBind("Moved", callback);
		 * ent.netUnbind("Moved", callback);
		 */
		netUnbind: function(eventName, callback) {
			this.unbind(NET_EVENT_PREFIX + eventName, callback);
			return this;
		},
		/**
		 * Define code which will be executed on a [Crafty enity]{@link external:CraftyJS.e}, depending on the Crafty instance it belongs to.
		 * <br />
		 * The <code>label</code> argument is used to determine if this code is to be run on this Crafty instance.
		 * Iff this instance's <code>label</code> starts with the given <code>label</code>, the <code>callback</code> is executed.
		 * This instance's <code>label</code> is specified on the client / server creation (see lib documentation).
		 *
		 * @method external:CraftyJS.e#define
		 * @param {!module:"npm_crafty.net"#PeerLabel} label - the label this instance's label has to start with in order for the callback to be executed
		 * @param {!function()} callback - the callback to execute if this instance's label starts with the given label
		 * @returns {!external:CraftyJS.e} this Crafty entity for method chaining
		 *
		 * @example <caption>Example showing definition of a basic entity, which is extended depending on the label of the Crafty instance it belongs to.</caption>
		 * //common features
		 * Crafty.e("2D, Net")
		 *       .setName("Player1")
		 *       .attr({ x: x, y: y, w: w, h: h })
		 *       //this will be defined on all CLIENTS (e.g. CLIENT1, CLIENT2, ...)
		 *       .define("CLIENT", function() {
		 *           this.addComponent("DOM, Color")
		 *               .color('rgb(255,0,0)');
		 *       })
		 *       //this will defined on CLIENT1 only
		 *       .define("CLIENT1", function() {
		 *           this.addComponent("Keyboard")
		 *               .netTrigger("KeyDown", ...);
		 *       })
		 *       //this will be defined on SERVER only
		 *       .define("SERVER", function() {
		 *           this.addComponent("Collision")
		 *               .onHit("Component", ...)
		 *       });
		 */
		define: function(label, callback) {
			if (Crafty.net.peerLabel.indexOf(label) !== -1) {
				callback.call(this);
			}
			return this;
		}
	});

	/**
	 * A property that adds net capabilities to a [Crafty instance]{@link external:CraftyJS.Crafty}.
	 *
	 * @member external:CraftyJS.Crafty#net
	 * @type {!object}
	 * @property {!module:"npm_crafty.net"#PeerLabel} peerLabel - specifies the <code>label</code> of a [Crafty instance]{@link external:CraftyJS.Crafty}
	 * @property {!module:"npm_crafty.net"#RoomName} roomName - specifies the <code>room name</code> of a [Crafty instance]{@link external:CraftyJS.Crafty}
	 */
	Crafty.net = {
		__nameMap: {},
		peerLabel: peerLabel,
		roomName: roomName,
		send: function(id, eventName, eventObject, isVolatile) {
			var transport = Crafty.net.__getTransport();
			if (!transport)
				return;

			var netEvent = {
				id: id,
				eventName: eventName,
				eventObject: eventObject
			};
			if (isVolatile) {
				transport.volatile.emit(EVENT_CHANNEL, netEvent);
			} else {
				transport.emit(EVENT_CHANNEL, netEvent);
			}
		},
		receive: function(netEvent) {
			var id = netEvent.id;
			var eventName = netEvent.eventName;
			var eventObject = netEvent.eventObject;
			
			if (id === 0)
				Crafty.trigger(eventName, eventObject);
			else
				var ent = Crafty.net.__nameMap[id];
				if (ent)
					ent.trigger(eventName, eventObject);
		},
		__getTransport: function() {
			return null;
		}
	};
};


exports.__setInputSocket = function(Crafty, socket) {
	socket.on(EVENT_CHANNEL, function(netEvent) {
		Crafty.net.receive(netEvent);
	});
};

exports.__unsetInputSocket = function(Crafty, socket) {
	socket.removeAllListeners(EVENT_CHANNEL);
};

exports.__addOutputSocket = function(Crafty, socket) {
	socket.join(Crafty.net.roomName);
};

exports.__removeOutputSocket = function(Crafty, socket) {
	socket.leave(Crafty.net.roomName);
};

exports.__setClientOutputSocket = function(Crafty, socket) {
	Crafty.net.__getTransport = function() {
		return socket;
	};
};

exports.__setServerOutputSockets = function(Crafty, sockets) {
	Crafty.net.__getTransport = function() {
		return sockets.in(Crafty.net.roomName);
	};
};
