var exports = exports || {};
exports.startGame = function(Crafty) {
	Crafty.init(600, 300);
	
	const TYPE_BORDER = "border";
	const TYPE_SCORE = "score";
	const TYPE_PADDLE = "paddle";
	const TYPE_BALL = "ball";
	
	const EVENT_LEFT_HIT = "leftScoreBoardHit";
	const EVENT_RIGHT_HIT = "rightScoreBoardHit";
	
	Crafty.c("Collidable", {
		init: function(entity) {
		},
		collidable: function(type, callback) {
			this._collideCallback = callback;
			this._type = type;
			return this;
		},
		collide: function(collider) {
			if (this._collideCallback)
				this._collideCallback(collider);
		},
		getType: function() {
			return this._type;
		}
	});
	
	/**
	* Movable Component. Automatically moves dX, dY every frame
	*/
	Crafty.c("Movable", {
		init: function(entity) {
			this.requires("2D");
			this.bind('EnterFrame', function () {
				this.x += this._dX;
				this.y += this._dY;
				this.trigger("Moved", {x: this.x, y: this.y});
			});
		},
		movable: function(dX, dY) {
			this._dX = dX;
			this._dY = dY;
			return this;
		}
	});
	
	
	Crafty.c("ServerPaddle", {
		init: function(entity) {
			this
			.netBind("KeyDown", function(e) {
				this.trigger("KeyDown", e);
			})
			.netBind("KeyUp", function(e) {
				this.trigger("KeyUp", e);
			})
			.bind("Moved", function(e) {
				this.netTrigger("Moved", e);
			});
		}
	});
	
	Crafty
	.define("CLIENT", function() {
		this.netBind("SceneChange", function(data) {
			this.scene(data.newScene);
		});
	})
	.define("SERVER", function() {
		this.bind("SceneChange", function(data) {
			this.netTrigger("SceneChange", data);
		});
	});

	Crafty.scene("loading", function() {
		Crafty.define("CLIENT", function() {
			Crafty.e("2D, Net")
				.setName("Loading Text")
				.addComponent("DOM, Text")
				.attr({ w: 100, h: 20, x: 150, y: 120 })
				.text("Waiting for clients...")
				.css({ "text-align": "center" });
		});
	});
	
	
	Crafty.scene("main", function() {
		Crafty.define("CLIENT", function() {
			this.background('rgb(127,127,127)');
		});

		//ROOF
		Crafty.e("2D, Net")
			.setName("Roof")
			.attr({ x: 0, y: 0, w: 600, h: 10 })
			.define("CLIENT", function() {
				this.addComponent("DOM, Color")
				.color('rgb(0,0,0)');
			})
			.define("SERVER", function() {
				this.addComponent("Collidable")
				.collidable(TYPE_BORDER, null);
			});
		//FLOOR, same as ROOF
		Crafty.e("2D, Net")
			.setName("Floor")
			.attr({ x: 0, y: 290, w: 600, h: 10 })
			.define("CLIENT", function() {
				this.addComponent("DOM, Color")
				.color('rgb(0,0,0)');
			})
			.define("SERVER", function() {
				this.addComponent("Collidable")
				.collidable(TYPE_BORDER, null);
			});
		
		
		//SCORE LEFT
		Crafty.e("2D, Net")
			.setName("Score Left")
			.attr({ x: 0, y: 10, w: 10, h: 280})
			.define("CLIENT", function() {
				this.addComponent("DOM, Text")
				.text("0")
				.netBind("UPDATE_POINTS", function(points) {
					this.text(points);
				});
			})
			.define("SERVER", function() {
				this.attr({points: 0})
				.addComponent("Collidable")
				.collidable(TYPE_SCORE, function(collider) {
					Crafty.trigger(EVENT_LEFT_HIT);
				})
				.bind(EVENT_RIGHT_HIT, function() {
					this.netTrigger("UPDATE_POINTS", ++this.points);
				});
			});

		//SCORE RIGHT, analog to SCORE LEFT
		Crafty.e("2D, Net")
			.setName("Score Right")
			.attr({ x: 590, y: 10, w: 10, h: 280})
			.define("CLIENT", function() {
				this.addComponent("DOM, Text")
				.text("0")
				.netBind("UPDATE_POINTS", function(points) {
					this.text(points);
				});
			})
			.define("SERVER", function() {
				this.attr({points: 0})
				.addComponent("Collidable")
				.collidable(TYPE_SCORE, function(collider) {
					Crafty.trigger(EVENT_RIGHT_HIT);
				})
				.bind(EVENT_LEFT_HIT, function() {
					this.netTrigger("UPDATE_POINTS", ++this.points);
				});
			});
		
		
		//PADDLE LEFT
		Crafty.e("2D, Net")
			.setName("Paddle Left")
			.attr({ x: 40, y: 100, w: 10, h: 100 })
			.define("CLIENT", function() {
				this.addComponent("DOM, Color")
				.color('rgb(255,0,0)')
				
				.netBind('Moved', function(newPos) {
					this.x = newPos.x;
					this.y = newPos.y;
				});
			})
			.define("CLIENT1", function() {
				this.bind("KeyDown", function(e) {
					if (e.key === Crafty.keys["W"] || e.key === Crafty.keys["S"]) {
						if (e.originalEvent)
							delete e.originalEvent;
						this.netTrigger("KeyDown", e);
					}
				})
				.bind("KeyUp", function(e) {
					if (e.key === Crafty.keys["W"] || e.key === Crafty.keys["S"]) {
						if (e.originalEvent)
							delete e.originalEvent;
						this.netTrigger("KeyUp", e);
					}
				})
			})
			.define("SERVER", function() {
				this.addComponent("Multiway, Collidable, ServerPaddle")
				.multiway(4, { W: -90, S: 90 })
				.collidable(TYPE_PADDLE, null);
			});

		//PADDLE RIGHT, analog to PADDLE LEFT but with CLIENT2
		Crafty.e("2D, Net")
			.setName("Paddle Right")
			.attr({ x: 550, y: 100, w: 10, h: 100 })
			.define("CLIENT", function() {
				this.addComponent("DOM, Color")
				.color('rgb(255,0,0)')
				
				.netBind('Moved', function(newPos) {
					this.x = newPos.x;
					this.y = newPos.y;
				});
			})
			.define("CLIENT2", function() {
				this.bind("KeyDown", function(e) {
					if (e.key === Crafty.keys["UP_ARROW"] || e.key === Crafty.keys["DOWN_ARROW"]) {
						if (e.originalEvent)
							delete e.originalEvent;
						this.netTrigger("KeyDown", e);
					}
				})
				.bind("KeyUp", function(e) {
					if (e.key === Crafty.keys["UP_ARROW"] || e.key === Crafty.keys["DOWN_ARROW"]) {
						if (e.originalEvent)
							delete e.originalEvent;
						this.netTrigger("KeyUp", e);
					}
				})
			})
			.define("SERVER", function() {
				this.addComponent("Multiway, Collidable, ServerPaddle")
				.multiway(4, { UP_ARROW: -90, DOWN_ARROW: 90})
				.collidable(TYPE_PADDLE, null);
			});
			
		
		//BALL
		Crafty.e("2D, Net")
			.setName("Ball")
			.attr({ x: 300, y: 150, w: 10, h: 10 })
			.define("CLIENT", function() {
				this.addComponent("DOM, Color")
				.color('rgb(0,0,255)')
				.netBind('Moved', function(newPos) {
					this.x = newPos.x;
					this.y = newPos.y;
				});
			})
			.define("SERVER", function() {
				this.addComponent("Collision, Collidable, Movable")
				.onHit('Collidable', function(collisionResults) {
					var obj;
					for(var i = 0; i < collisionResults.length; i++) {
						obj = collisionResults[i].obj;
						obj.collide(this);
						this.collide(obj);
					}
				})
				.collidable(TYPE_BALL, function(collider) {
					var type = collider.getType();
					if (type === TYPE_SCORE) {
						this.movable(Crafty.math.randomInt(2, 5), Crafty.math.randomInt(2, 5));
						this.y = 150;
						this.x = 300;
					} else if (type === TYPE_PADDLE) {
						this._dX *= -1;
					} else if (type === TYPE_BORDER) {
						this._dY *= -1;
					}
				})
				.movable(Crafty.math.randomInt(2, 5), Crafty.math.randomInt(2, 5))
				.bind('Moved', function(newPos) {
					this.netTrigger('Moved', newPos, true);
				});
			});

	});
	
	//automatically play the loading scene
	Crafty.scene("loading");
}