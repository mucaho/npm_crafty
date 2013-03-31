npm_crafty
==========

This is a [nodeJS](http://nodejs.org/) module. It runs a server version of [craftyJS](http://craftyjs.com/).

# Differences from original crafty
--------------------------------
## Added to crafty
Crafty.net feature is added to Crafty. It allows you to __bind & trigger events over the net__.
The methods are analog to the default ones (they only prepend **"NET_"** to the **"EventName"**).
```javascript
//global events will be delivered to the other Crafty instance
Crafty.netTrigger("EventName", eventData);
Crafty.netBind("EventName", callback);
Crafty.netUnbind("EventName", callback);
//entity events will be delivered to the entity with the same ID
var ent = Crafty.e("NetEvents"); //this component enables net events
ent.netTrigger("EventName", eventData);
ent.netBind("EventName", callback);
ent.netUnbind("EventName", callback);
```

## Removed from crafty
The **.diff file** of each version is available inside the **/diff folder**.
The server uses a __stripped-down version of crafty__. The following features & their subfeatures are **disabled**:
* __GRAPHICS__
	* Crafty.DrawManager
	* Crafty.stage
	* Crafty.DOM
	* Crafty.canvas
	* Crafty.viewport
	* Crafty.background
	* Crafty.sprite

* __SOUND__
	* Crafty.audio

* __COMPATIBILITY__
	* Crafty.support
	* Crafty.mobile
	* Crafty.device

* __ASSETS__
	* Crafty.assets
	* Crafty.asset
	* Crafty.loader

* __INPUT__
 	* Crafty.keydown
	* Crafty.addEvent
	* Crafty.removeEvent
	* Crafty.touchDispatch
	* Crafty.mouseDispatch
	* Crafty.keyboardDispatch

	
# Example
---------
Look at the _app.js_ and _app.html_ files in the _src_ folder.
Run the server with `node app.js` (from the appropriate working directory).
Run the client by opening the url `localhost` with your browser (the browser will load the _html_ file).
The client sends the event to the server and the server logs the event.

__SERVER__
```javascript
//node&socket.io specific stuff omitted
...

//this will be called for each client that connects
var startSession = function(socket) {
	//load module
	var craftyModule = require('npm_crafty');
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
}
});
```

__CLIENT__
```html
<head>
	<!-- Be sure to include the scripts in this order -->
	<script src="/socket.io/socket.io.js"></script>
	<script src="lib/crafty.js"></script>
	<script src="lib/node.crafty_net.js"></script>
	<script src="lib/node.crafty.js"></script>
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

# Misc
------
If you have a __desire__, open an __issue__. 
If you want to __contribute__, open a pull request against the __development branch__.

# License
-------------
__The MIT License (MIT)__ (See LICENSE)

