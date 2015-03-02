# npm_crafty.client

The npm_crafty client module. <br />
Allows construction of crafty client instance with net features and offers methods to connect these net features to socket.io.


* * *

### npm_crafty.createClient(label) 

Construct a Crafty client instance with net features enabled. <br />
The <code>label</code> is used to determine which code to execute.

**Parameters**

**label**: `string`, the label to use for this client instance

**Returns**: `Crafty`, the newly created Crafty client instance with net features enabled

**Example**:
```js
var npm_crafty = require("npm_crafty");
var Crafty = npm_crafty.createClient("CLIENT");
```


### npm_crafty.setServer(Crafty, socket) 

Bind the server <code>socket</code> to the Crafty client instance.
The Crafty net features will use this <code>socket</code> to communicate with the server.

**Parameters**

**Crafty**: `Crafty`, the Crafty client instance to bind the socket to

**socket**: `Socket | Sockets`, the socket or socket namespace to use for communication with server

**Returns**: `Crafty`, the Crafty instance for method chaining

**Example**:
```js
var npm_crafty = require("npm_crafty");
var Crafty = npm_crafty.createClient("CLIENT");
npm_crafty.setServer(Crafty, socket);
```


### npm_crafty.setupDefault(immediateFN, connectFN, disconnectFN, serverAddress) 

Setup a default browser client, which will connect to the node server of the website automatically. <br />
Each callback will be called at the appropriate times.
Communication will be set to the default <code>'/'</code> namespace.

**Parameters**

**immediateFN**: `function`, will be called immediately once all libraries are loaded

**connectFN**: `function(Socket)`, will be called when the client connects to the server

**disconnectFN**: `function(Socket)`, will be called when the client disconnects from the server

**serverAddress**: `string`, the server address to connect to (auto-resolved usually and thus can be omitted usually) e.g. "http://localhost"


**Example**:
```js
var npm_crafty = require("npm_crafty");
var Crafty;
npm_crafty.setupDefault( function () { //immediate callback
    Crafty = npm_crafty.createClient("CLIENT");
}, function (socket) { //connect callback
    npm_crafty.setServer(Crafty, socket);
}, function (socket) { //disconnect callback
});
```



* * *










# npm_crafty.server

The npm_crafty server module. <br />
Allows construction of crafty server instance with net features and offers methods to connect these net features to socket.io.

* * *

### npm_crafty.createServer(room, sockets) 

Construct a Crafty server instance with net features enabled.
<br />
Each server instance shall have an unique <code>room</code> name. 
Only client and server instances within the same <code>room</code> can talk to each other.
<br />
This method also set's the server instance's label to <code>"SERVER"</code>.
<br />
The <code>sockets</code> parameter contains the Socket.IO namespace to use for all Crafty related data. 
It can be omitted when the npm_crafty.setupDefault method is called.

**Parameters**

**room**: `string`, the room to use for this server instance

**sockets**: `Sockets`, the socket namespace to use for all communication

**Returns**: `Crafty`, the newly created crafty client instance with net features enabled

**Example**:
```js
var npm_crafty = require("npm_crafty");
var Crafty = npm_crafty.createServer("Room1");
```


### npm_crafty.addClient(Crafty, socket) 

Add a client <code>socket</code> to the Crafty server instance.
The Crafty net features will use this <code>socket</code> to communicate with the client.

**Parameters**

**Crafty**: `Crafty`, the Crafty server instance to bind the socket to

**socket**: `Socket`, the socket to use for communication with a client

**Returns**: `Crafty`, the Crafty instance for method chaining

**Example**:
```js
var npm_crafty = require("npm_crafty");
var Crafty = npm_crafty.createServer("Room1");
npm_crafty.addClient(Crafty, socket);
```


### npm_crafty.setupDefault(immediateFN, connectFN, disconnectFN, port) 

Setup a default node server, which will serve npm_crafty's required files (it will reply to GET requests).
<code>app</code>, <code>io</code> and <code>server</code> become acessible as the module's properties.

**Parameters**

**immediateFN**: `function`, will be called immediately once all libraries are loaded

**connectFN**: `function(Socket)`, will be called when a client connects to the server

**disconnectFN**: `function(Socket)`, will be called when a client disconnects from the server

**port**: `number`, the port to use (defaults to standard HTTP port 80)


**Example**:
```js
var npm_crafty = require("npm_crafty");
var Crafty;
npm_crafty.setupDefault( function () { //immediate callback
    Crafty = npm_crafty.createServer("Room1");
}, function (socket) { //connect callback
    npm_crafty.addClient(Crafty, socket);
}, function (socket) { //disconnect callback
});
```



* * *










