# npm_crafty.net

The npm_crafty net module. 
Contains the additional net features that are added to a Crafty client or server instance, as well as to Crafty entities.



* * *

### Crafty.netTrigger(eventName, eventObject, isVolatile) 

Triggers an event over the net. Other than that it is functionally the same as the [default trigger method](http://craftyjs.com/api/Crafty%20Core.html#-trigger).
The events will be delivered to the Crafty instance(s) at the other end of the network.
<br />
If this is called on the server instance, triggers the event on all client instances.
If this is called on the client instance, trigger the event on the server instance.
<br />
The <code>isVolatile</code> parameter specifies if the transmission should be guaranteed to be delivered to the other end or not. 
If set to <code>true</code>, the event can get lost over the network, but it increases the network performance (useful for transmitting events every frame, like position updates).

**Parameters**

**eventName**: `string`, the event name

**eventObject**: `string`, the event object

**isVolatile**: `boolean`, whether the event should be sent reliably or not; if set to <code>true</code> the event will not be sent reliably

**Fires**: Event

**Returns**: `Crafty`, this Crafty instance for method chaining

**Example**:
```js
Crafty.netTrigger("GameOver", {score: 11});
Crafty.netTrigger("GameOver", {score: 11}, false); // equivalent to the above
```


### Crafty.netBind(eventName, callback) 

Binds to an event over the net. Other than that it is functionally the same as the [default bind method](http://craftyjs.com/api/Crafty%20Core.html#-bind).
The events will be delivered to the Crafty instance(s) at the other end of the network.
<br />
If the event was triggered on the server instance, the event will be received on all client instances.
If the event was triggered on a client instance, the event will be received on the server instance.

**Parameters**

**eventName**: `string`, the event name

**callback**: `function`, the callback to execute upon event receipt

**Returns**: `Crafty`, this Crafty instance for method chaining

**Example**:
```js
Crafty.netBind("GameOver", function(data) {
    console.log("Congratulations, you achieved " + data.score + " points!");
});
```


### Crafty.netUnbind(eventName, callback) 

Unbinds from an event over the net. Other than that it is functionally the same as the [default unbind method](http://craftyjs.com/api/Crafty%20Core.html#-unbind).
The events will be delivered to the Crafty instance(s) at the other end of the network.
<br />
If the event was triggered on the server instance, the event will be received on all client instances.
If the event was triggered on a client instance, the event will be received on the server instance.

**Parameters**

**eventName**: `string`, the event name

**callback**: `function`, the callback to execute upon event receipt

**Returns**: `Crafty`, this Crafty instance for method chaining

**Example**:
```js
var callback = function(data) {
    console.log("Congratulations, you achieved " + data.score + " points!");
};
Crafty.netBind("GameOver", callback);
Crafty.netUnbind("GameOver", callback);
```


### Crafty.define(label, callback) 

Define code which will be executed on a specific Crafty network instance.
<br />
The <code>label</code> argument is used to determine if this code is to be run on this Crafty instance.
Iff this instance's <code>label</code> starts with the given <code>label</code>, the <code>callback</code> is executed.
This instance's <code>label</code> is specified on the client / server creation.

**Parameters**

**label**: `string`, the label this instance's label has to start with in order for the callback to be executed

**callback**: `function`, the callback to execute if this instance's label starts with the given label

**Returns**: `Crafty`, this Crafty instance for method chaining

**Example**:
```js
<caption>create an entity on the Crafty instance, whose label contains "CLIENT"</caption>
Crafty.define("CLIENT", function() {
    Crafty.e("2D, DOM, Text")
          .attr({ x: 100, y: 100 })
          .text("Loading, please stand by."); 
});
```


## Component: Net
A Crafty component that adds net capabilities to Crafty entities. <br />
It is necessary to add it to all entities that require net capabilities. <br />
It is necessary to set an unique [entity name](http://craftyjs.com/api/Crafty%20Core.html#-setName) when adding the component, 
which will be used to route events to correct entities on the other end of the network.


### Crafty.e.netTrigger(eventName, eventObject, isVolatile) 

Triggers an event over the net. Other than that it is functionally the same as the [default trigger method](http://craftyjs.com/api/Crafty%20Core.html#-trigger).
The events will be delivered to the Crafty entity with the same [entity name](http://craftyjs.com/api/Crafty%20Core.html#-setName) on the other end of the network,
thus specifying an unique logical name for each entity is highly recommended.
<br />
If this is called on a server entity, triggers the event on all client entities.
If this is called on a client entity, triggers the event on the server entitiy.
<br />
The <code>isVolatile</code> parameter specifies if the transmission should be guaranteed to be delivered to the other end or not. 
If set to <code>true</code>, the event can get lost over the network, but it increases the network performance (useful for transmitting events every frame, like position updates).

**Parameters**

**eventName**: `string`, the event name

**eventObject**: `string`, the event object

**isVolatile**: `boolean`, whether the event should be sent reliably or not; if set to <code>true</code> the event will not be sent reliably

**Fires**: Event

**Returns**: `Crafty.e`, this Crafty entity for method chaining

**Example**:
```js
var ent = Crafty.e("Net")
                .setName("MyEntity")
                .netTrigger("Moved", {x: this.x, y: this.y});
```

### Crafty.e.netBind(eventName, callback) 

Binds to an event over the net. Other than that it is functionally the same as the [default bind method](http://craftyjs.com/api/Crafty%20Core.html#-bind).
The events are received at the Crafty entity with the same [entity name](http://craftyjs.com/api/Crafty%20Core.html#-setName) as 
the triggering Crafty entity on the other end of the network.
<br />
If the event was triggered on a server entity, the event will be received on all client entities.
If the event was triggered on a client entity, the event will be received on the server entity.

**Parameters**

**eventName**: `string`, the event name

**callback**: `function`, the callback to execute upon event receipt

**Returns**: `Crafty.e`, this Crafty entity for method chaining

**Example**:
```js
var ent = Crafty.e("Net")
                .setName("MyEntity")
                .netBind("Moved", function(data) {
                    this.x = data.x;
                    this.y = data.y;
                });
```

### Crafty.e.netUnbind(eventName, callback) 

Unbinds from an event over the net. Other than that it is functionally the same as the [default unbind method](http://craftyjs.com/api/Crafty%20Core.html#-unbind).
The events are received at the Crafty entity with the same [entity name](http://craftyjs.com/api/Crafty%20Core.html#-setName) as 
the triggering Crafty entity on the other end of the network.
<br />
If the event was triggered on a server entity, the event will be received on all client entities.
If the event was triggered on a client entity, the event will be received on the server entity.

**Parameters**

**eventName**: `string`, the event name

**callback**: `function`, the callback to execute upon event receipt

**Returns**: `Crafty.e`, this Crafty entity for method chaining

**Example**:
```js
var callback = function(data) {
    this.x = data.x;
    this.y = data.y;
};
var ent = Crafty.e("Net").setName("MyEntity");
ent.netBind("Moved", callback);
ent.netUnbind("Moved", callback);
```

### Crafty.e.define(label, callback) 

Define code which will be executed on a Crafty enity, depending on the Crafty instance it belongs to.
<br />
The <code>label</code> argument is used to determine if this code is to be run on this Crafty instance.
Iff this instance's <code>label</code> starts with the given <code>label</code>, the <code>callback</code> is executed.
This instance's <code>label</code> is specified on the client / server creation (see lib documentation).

**Parameters**

**label**: `string`, the label this instance's label has to start with in order for the callback to be executed

**callback**: `function`, the callback to execute if this instance's label starts with the given label

**Returns**: `Crafty.e`, this Crafty entity for method chaining

**Example**:
```js
<caption>Example showing definition of a basic entity, which is extended depending on the label of the Crafty instance it belongs to.</caption>
//common features
Crafty.e("2D, Net")
      .setName("Player1")
      .attr({ x: x, y: y, w: w, h: h })
      //this will be defined on all CLIENTS (e.g. CLIENT1, CLIENT2, ...)
      .define("CLIENT", function() {
          this.addComponent("DOM, Color")
              .color('rgb(255,0,0)');
      })
      //this will defined on CLIENT1 only
      .define("CLIENT1", function() {
          this.addComponent("Keyboard")
              .netTrigger("KeyDown", ...);
      })
      //this will be defined on SERVER only
      .define("SERVER", function() {
          this.addComponent("Collision")
              .onHit("Component", ...)
      });
```



* * *


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
