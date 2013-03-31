npm_crafty
==========

This is a [nodeJS](http://nodejs.org/) module. It runs a server version of [craftyJS](http://craftyjs.com/).

Differences from original crafty
--------------------------------
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

	
Example
-------
Look at the _app.js_ and _app.html_ files in the _src_ folder.
Run the server with `node app.js` (from the appropriate working directory).
Run the client by opening the url `localhost` with your browser (the browser will load the _html_ file).
The client sends the event to the server and the server logs the event.

__SERVER__
```javascript
//node specific stuff omitted
...

//create a new crafty instance
var Crafty = require('./libs/crafty_nodejs.js').newCrafty();

//add net features to crafty
var craftyNet = require('./libs/crafty_net_nodejs.js');
craftyNet.addNet(Crafty);

io.sockets.on('connection', function (socket) {
	//add crafty routing to socket
	craftyNet.routeSocket(socket, Crafty);
});

//start crafty instance
//Crafty.init();

//stop crafty instance
//Crafty.stop();

//bind to events that come over net
Crafty.netBind("Bla", function(data) {
	console.log(data);
});
```

__CLIENT__
```javascript
//other script includes omitted
//...

//add net features to crafty
exports.addNet(Crafty);

//socket.io specific initialization
var socket = io.connect();
// add crafty routing to socket
exports.routeSocket(socket, Crafty);

//start crafty instance
//Crafty.init();

//stop crafty instance
//Crafty.stop();

//trigger event over net
Crafty.netTrigger("Bla", "dudu");
```

Misc
----
If you have a _desire_, open an _issue_. 
If you want to _contribute_, open a pull request against the _development branch_.

MIT License
-----------
__The MIT License (MIT)__

Copyright (c) 2013 mkucko@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT 
OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

