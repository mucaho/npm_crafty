var fs = require('fs');
var request = require('request');

var sources = [
	//"license.txt",
	"core",
	"intro",
	"HashMap",
	"2D",
	"collision",
	//"hitbox",
	//"DOM",
	"fps",
	//"html",
	//"storage",
	//"extensions",
	//"device",
	//"sprite",
	//"canvas",
	//"controls",
	"animate",
	"animation",
	"drawing",
	"isometric",
	//"particles",
	//"sound",
	//"text",
	//"loader",
	"math",
	"time",
	"outro" 
];

var writeStream = fs.createWriteStream('crafty_stripped.js');
var prependURL = "https://raw.github.com/craftyjs/Crafty/master/src/";
var appendURL = ".js";

var HEADER = "exports.createCrafty = function(window) {\n";
var FOOTER = "\n};\n";
  
var readStream;
var url;
var importSource = function(index) {
	if (index >= sources.length) {
		writeStream.end(FOOTER);
		return;
	}
	url = prependURL + sources[index] + appendURL;
	console.log("Requesting ", url);
	
	readStream = request(url);
	readStream.pipe(writeStream, { end: false });
	readStream.on("end", function() {
		importSource(++index);
	});
};

writeStream.write(HEADER);
//start recursion
importSource(0);
