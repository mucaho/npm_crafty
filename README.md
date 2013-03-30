npm_crafty
==========

This is a [nodeJS](http://nodejs.org/) module. It runs a server version of [craftyJS](http://craftyjs.com/).

Differences from original crafty
--------------------------------
The **.diff file** of each version is available inside the **/diff folder**.

The server uses a stripped-down version of crafty. The following features & their subfeatures are **disabled**:
* GRAPHICS
	* Crafty.DrawManager
	* Crafty.stage
	* Crafty.DOM
	* Crafty.canvas
	* Crafty.viewport
	* Crafty.background
	* Crafty.sprite

* SOUND
	* Crafty.audio

* COMPATIBILITY
	* Crafty.support
	* Crafty.mobile
	* Crafty.device

* ASSETS
	* Crafty.assets
	* Crafty.asset
	* Crafty.loader

* INPUT
 	* Crafty.keydown
	* Crafty.addEvent
	* Crafty.removeEvent
	* Crafty.touchDispatch
	* Crafty.mouseDispatch
	* Crafty.keyboardDispatch

	
Example
-------
Save the code below as app.js and run the command `node app.js` from the current working directory.

```javascript
//create a new crafty instance
var Crafty = require('./libs/crafty_nodejs.js').newCrafty();

//start crafty instance
Crafty.init();

//log every frame
Crafty.e("2D")
	.bind("EnterFrame", function(frame) {
		console.log(frame);
	});
```
