//create a new crafty instance
var Crafty = require('./libs/crafty_nodejs.js').newCrafty();

//start crafty instance
Crafty.init();

//log every frame
Crafty.e("2D")
	.bind("EnterFrame", function(frame) {
		console.log(frame);
	});