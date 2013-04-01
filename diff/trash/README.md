# Differences from original crafty
--------------------------------
## Added to crafty
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
The **.diff file** of each version is available inside the **/diff folder**.
The server uses a __stripped-down version of crafty__. The following features & their subfeatures are **disabled**:
* __GRAPHICS__
  * Crafty.DrawManager
	* Crafty.stage
	* Crafty.DOM
	* Crafty.canvas
	* Crafty.viewport
	* Crafty.background
	* Crafty.sprite

* __SOUND__
	* Crafty.audio

* __COMPATIBILITY__
	* Crafty.support
	* Crafty.mobile
	* Crafty.device

* __ASSETS__
	* Crafty.assets
	* Crafty.asset
	* Crafty.loader

* __INPUT__
 	* Crafty.keydown
	* Crafty.addEvent
	* Crafty.removeEvent
	* Crafty.touchDispatch
	* Crafty.mouseDispatch
	* Crafty.keyboardDispatch
