var newCrafty = function() {
	//create window, navigator
	var window = {
			document: {
				createElement: function(arg) {
					if(arg == "div") {
						var div = {
							style: ""
						}
						return div;
					}
					
					return {};
				}
			}
	};
	var navigator = {
			userAgent: ""
	};
	//create crafty
	require('./crafty_stripped.js').createCrafty(window, navigator);
	var Crafty = window.Crafty;

	
	//disable unused stuff, throw exceptions
	var notSupported = function() {
		throw "This feature is not supported in server-side Crafty";
	};
		Crafty.DrawManager = notSupported;
		Crafty.stage = notSupported;
		Crafty.DOM = notSupported;
		Crafty.canvas = notSupported;
		Crafty.viewport = notSupported;
		Crafty.background = notSupported;
		Crafty.sprite = notSupported;
		//Crafty.toRGB = notSupported;
		Crafty.audio = notSupported;

		Crafty.support = notSupported;
		Crafty.mobile = notSupported;
		Crafty.device = notSupported;

		Crafty.assets = notSupported;
		Crafty.asset = notSupported;
		Crafty.loader = notSupported;
		
		Crafty.keydown = notSupported;
		Crafty.addEvent = notSupported;
		Crafty.removeEvent = notSupported;
		Crafty.touchDispatch = notSupported;
		Crafty.mouseDispatch = notSupported;
		Crafty.keyboardDispatch = notSupported;
		
	return Crafty;
};

exports.newCrafty = newCrafty;
