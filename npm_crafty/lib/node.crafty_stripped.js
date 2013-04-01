var newCrafty = function() {
	//create window
	var window = {
		document: {
		}
	};
	
	//create crafty
	require('./crafty_stripped.js').createCrafty(window);
	var Crafty = window.Crafty;
	
	//add dummys
	Crafty.support = {
		setter: false,
		defineProperty: false
	};
	
	return Crafty;
};

exports.newCrafty = newCrafty;
