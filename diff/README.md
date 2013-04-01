# Differences from original crafty
--------------------------------
## Added to crafty
------------------
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
----------------------
The server uses a __stripped-down version of crafty__.

### Automatic Filtering
-----------------------
First files are automatically fetched from crafty's github page and written to a file. `node node.build-crafty.js`

The order in which they are written is defined in [original crafty build file]
(https://github.com/craftyjs/Crafty/blob/master/build/build-crafty.php).

Not all files get included. After inspecting the source files, i have put together a list of what
gets included and what doesn't.

**Stuff that gets included:**
* 2D
* HashMap
* animate
* animation
* collision
* core
* diamondiso
* drawing
* fps
* import
* intro
* isometric
* math
* outro
* time

**Stuff that doesnt get included:**
* DOM
* canvas
* controls
* device
* extensions
* hitbox
* html
* loader
* particles
* sound
* sprite
* storage
* text

### Manual Filtering
-----------------------
Automatic Filtering is not enough, so i have put together some notes what else needs to be changed.

**Removal of lines, components and Crafty namespace**
* animation.js: _-c.SpriteAnimation_
* core.js: 
** `Crafty.init()` -> remove line `Crafty.viewport.init();`
** `Crafty.timer.step()`, `Crafty.timer.simpulateFrames()` -> remove line `Crafty.DrawManager.draw();`
* drawing.js: _-c.Color, -c.Tint, -c.Image, -Crafty.DrawManager, -DirtyRectangles_

**Things to consider in the future**
* controls.js: in future emulate the addEvent/removeEvent calls, they bind on "Load" and "CraftyStop"
* extensions.js: in future preserve addEvent & removeEvent for emulating input
* some existing features use Crafty.viewport's properties
