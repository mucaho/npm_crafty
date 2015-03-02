## Removed from crafty
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
* _stuff that will be heavily filtered manually:_
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
* animation.js: remove __SpriteAnimation__
* core.js: 
  * `Crafty.init()` -> remove line `Crafty.viewport.init();`
  * `Crafty.stop()` -> remove whole `if (Crafty.stage && ...)` block 
  * `Crafty.timer.step()`, `Crafty.timer.simpulateFrames()` -> remove line `Crafty.DrawManager.draw();`
* drawing.js: 
  * remove everything but __Crafty.scene__
    * remove _-c.Color, -c.Tint, -c.Image, -Crafty.DrawManager, -DirtyRectangles_
  * `Crafty.scene()` -> remove line `Crafty.viewport.reset();`
* controls.js:
  * remove everything but __Multiway, Fourway, Twoway__
    * remove -c.Keyboard, -c.Draggable, -c.Mouse, -Crafty.bind("Load", ...); -Crafty.bind("CraftyStop", ...);
-Crafty.detectBlur, -Crafty.mouseDispatch, -Crafty.touchDispatch, -Crafty.keyboardDispatch
  * `Multiway.multiway()` -> remove whole `/*Apply movement if key is down when created*/ for(;;;){}` block
  * `Twoway.twoway()` -> change 

```javascript
.bind("KeyDown", function () {
	if (this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("Z")) this._up = true;
});
```
to
```javascript
.bind("KeyDown", function(e) {
	if (e.key === Crafty.keys["UP_ARROW"] || e.key === Crafty.keys["W"] || e.key === Crafty.keys["Z"])
		this._up = true;
});
```
* extensions.js: remove everything but __Crafty.keys__ & __Crafty.mouseButtons__
  * remove -Crafty.sprite, -Crafty.addEvent, -Crafty.removeEvent, -Crafty.background, -Crafty.viewport, 
-c.viewport, -Crafty.support

**Things to note**
  * controls.js & extensions.js: __mouse-, key- and touchDispatch__ are handled by clients (see _PongBasic_ example).
