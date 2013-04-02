exports.newCrafty = function() {
	//create window
	var window = {
		document: {
		}
	};
	
	//create crafty
	require('./crafty_server.js').createCrafty(window);
	var Crafty = window.Crafty;
	
	//add dummys
	Crafty.support = {
		setter: true,
		defineProperty: true
	};
	Crafty.viewport = {
		_x: 0,
		_y: 0,
		width: 0,
		height: 0
	};
	
	return Crafty;
};
