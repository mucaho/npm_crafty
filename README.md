npm_crafty
==========

This is a [nodeJS](http://nodejs.org/) module. It runs a server version of [craftyJS](http://craftyjs.com/).

Differences from original crafty
--------------------------------
The .diff file of each version is available inside the /diff folder.

The server uses a stripped-down version of crafty. The following features & their subfeatures are **disabled**:
* GRAPHICS
	* Crafty.DrawManager = notSupported;
	* Crafty.stage = notSupported;
	* Crafty.DOM = notSupported;
	* Crafty.canvas = notSupported;
	* Crafty.viewport = notSupported;
	* Crafty.background = notSupported;
	* Crafty.sprite = notSupported;

* SOUND
	* Crafty.audio = notSupported;

* COMPATIBILITY
	* Crafty.support = notSupported;
	* Crafty.mobile = notSupported;
	* Crafty.device = notSupported;

* ASSETS
	* Crafty.toRGB = notSupported;
	* Crafty.assets = notSupported;
	* Crafty.asset = notSupported;
	* Crafty.loader = notSupported;

* INPUT
	* Crafty.keydown = notSupported;
	* Crafty.addEvent = notSupported;
	* Crafty.removeEvent = notSupported;
	* Crafty.touchDispatch = notSupported;
	* Crafty.mouseDispatch = notSupported;
	* Crafty.keyboardDispatch = notSupported;


Example
-------
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