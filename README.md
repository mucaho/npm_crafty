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

Misc
----
MIT License

If you have a desire, open an issue. If you want to contribute, open a pull request against the __development__ branch.
