var newCrafty = function() {
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
	
	return Crafty;
};

exports.newCrafty = newCrafty;
