/**
* The MIT License (MIT)
* Copyright (c) 2013 mkucko@gmail.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
* associated documentation files (the "Software"), to deal in the Software without restriction, 
* including without limitation the rights to use, copy, modify, merge, publish, distribute, 
* sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
* furnished to do so, subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies or 
* substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
* NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


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
	require('./crafty-0.5.3.js').createCrafty(window, navigator);
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