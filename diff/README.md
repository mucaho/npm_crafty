# Differences from original crafty
----------------------------------
## Added to crafty
==================
Crafty.net feature is added to Crafty. It allows you to __bind & trigger events over the net__.
The methods are analog to the default ones (they only prepend **"NET_"** to the **"EventName"**).
```javascript
//global events will be delivered to the other Crafty instance
Crafty.netTrigger("EventName", eventData);
Crafty.netBind("EventName", callback);
Crafty.netUnbind("EventName", callback);

//entity events will be delivered to the entity with the same ID
var ent = Crafty.e("NetEvents"); //this component enables net events
ent.netTrigger("EventName", eventData);
ent.netBind("EventName", callback);
ent.netUnbind("EventName", callback);
```

## Removed from crafty
======================
The server uses a __stripped-down version of crafty__.

### Automatic Filtering
First files are automatically fetched from crafty's github page and written to a file. `node npm_crafty.build.js`

The order in which they are written is defined in [original crafty build file]
(https://github.com/craftyjs/Crafty/blob/master/build/build-crafty.php).

Not all files get included. After inspecting the source files, i have put together a list of what
gets included and what doesn't.

**Stuff that gets included:**
* 2D
* HashMap
* animate
* collision
* core
* diamondiso
* fps
* import
* intro
* isometric
* math
* outro
* time
* __stuff that will be heavily filtered manually:__
  * animation
  * drawing
  * controls
  * extensions

**Stuff that doesnt get included:**
* DOM
* canvas
* device
* hitbox
* html
* loader
* particles
* sound
* sprite
* storage
* text

### Manual Filtering
Automatic Filtering is not enough, so i have put together some notes what else needs to be changed.

**Addition of dummy objects**
* Provide dummy `window = { document:{} };` object to creation of Crafty instance
* Add dummy `Crafty.support = { setter: true, defineProperty: true };` to existing Crafty instance
(but before starting Crafty).
* Add dummy `Crafty.viewport = { _x: 0, _y: 0, width: 0, height: 0 };` to existing Crafty instance
(but before starting Crafty).

**Removal of lines, components and Crafty namespace**
* animation.js: _-c.SpriteAnimation_
* core.js: 
  * `Crafty.init()` -> remove line `Crafty.viewport.init();`
  * `Crafty.stop()` -> remove whole `if (Crafty.stage && ...)` block 
  * `Crafty.timer.step()`, `Crafty.timer.simpulateFrames()` -> remove line `Crafty.DrawManager.draw();`
* drawing.js: 
  * remove everything but _Crafty.scene_
  * `Crafty.scene()` -> remove line `Crafty.viewport.reset();`
* controls.js:
  * remove everything but __c.Multiway, c.Fourway, c.Twoway__
  * `Multiway` -> remove whole `/*Apply movement if key is down when created*/ for(;;;){}` block
  * Twoway -> change 
`
.bind("KeyDown", function () {
	if (this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("Z")) this._up = true;
});
`
`
.bind("KeyDown", function(e) {
	if (e.key === Crafty.keys["UP_ARROW"] || e.key === Crafty.keys["W"] || e.key === Crafty.keys["Z"])
		this._up = true;
});
`
* extensions.js: remove everything but `Crafty.keys` & `Crafty.mouseButtons`

**Things to consider in the future**
  * controls.js: in future emulate the addEvent/removeEvent calls, they bind on "Load" and "CraftyStop"
  * extensions.js: in future preserve addEvent & removeEvent for emulating input
