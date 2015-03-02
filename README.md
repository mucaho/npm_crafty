[![NPM](https://nodei.co/npm/npm_crafty.png?compact=true)](https://nodei.co/npm/npm_crafty/)

npm_crafty
==========

This is a [nodeJS](http://nodejs.org/) module. It runs a server version of [craftyJS](http://craftyjs.com/).

**npm_crafty** adds a logical overlay network on-top of **crafty**   
* You can create multiple __rooms__. Each room contains __one server__ and __multiple clients__.   
* A client can __send events__ to the server. The server can __send events__ to all clients.   
* Define your client & server code __in one place__, and let the module determine __which code to run__.   
* Network events are __automatically routed__ to the correct entity instance on the other end of the network.

_Go multiplayer today with a minimalistic and easy-to-use net api!_

# Version
----------
Current native crafty version is 0.5.3

# Overview
----------
The unmodified crafty version runs on the client (== __browser__). A heavily modified version runs on the server 
(== __nodejs__, drawing stuff and similar is omitted from the server version).   
Both client and server version have additional features available for defining the game code on server or client, 
as well as enabling communication between them.   
These differences between original crafty library and the modified libraries can be seen inside the 
__diff__ folder.  
__You have to alter your game code to include these features.__

In order for the communication to work between server and client(s) you also have to specify how connecting / disconnecting
hosts will affect how your game sessions are setup. Each game session is an unique instance of your game; there can be
multiple game sessions taking place at once and each one takes place inside a game room. A game room consists
of one crafty server instance that communicates with multiple crafty client instances.   
The documentation on game room setup (server and client) setup can be found inside the __lib__ folder.    
__You have to setup game room(s) so that each server instance knows with which client instance to communicate.__

An example can be found inside the __example__ folder.

# Misc
------
If you have a __suggestion or bug report__, open an __issue__. 
If you want to __contribute__, open a __pull request__.

# License
-------------
__The MIT License (MIT)__ (See LICENSE)
