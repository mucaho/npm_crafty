var exports = exports || {};
exports.startGame = function(Crafty) {
	const TYPE_BORDER = "border";
	const TYPE_SCORE = "score";
	const TYPE_PADDLE = "paddle";
	const TYPE_BALL = "ball";
	
	const EVENT_LEFT_HIT = "leftScoreBoardHit";
	const EVENT_RIGHT_HIT = "rightScoreBoardHit";

/**************************************************************************
*
*					INIT CRAFTY
*
**************************************************************************/
	Crafty.init(600, 300);


/**************************************************************************
*
*					SETUP SCENES
*
**************************************************************************/

	Crafty.define("CLIENT", function() {
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

		Crafty.e("Platform")
			.setName("Roof")
			.attr({ x: 0, y: 0, w: 600, h: 10 });

		Crafty.e("Platform")
			.setName("Floor")
			.attr({ x: 0, y: 290, w: 600, h: 10 });

		Crafty.e("Score")
			.setName("Score Left")
			.attr({ x: 0, y: 10, w: 10, h: 280})
			.score(EVENT_LEFT_HIT, EVENT_RIGHT_HIT);

		Crafty.e("Score")
			.setName("Score Right")
			.attr({ x: 590, y: 10, w: 10, h: 280})
			.score(EVENT_RIGHT_HIT, EVENT_LEFT_HIT);

		Crafty.e("Paddle")
			.setName("Paddle Left")
			.attr({ x: 40, y: 100, w: 10, h: 100 })
			.paddle("CLIENT1", "W", "S");

		Crafty.e("Paddle")
			.setName("Paddle Right")
			.attr({ x: 550, y: 100, w: 10, h: 100 })
			.paddle("CLIENT2", "UP_ARROW", "DOWN_ARROW");

		Crafty.e("Ball")
			.setName("Ball")
			.attr({ x: 300, y: 150, w: 10, h: 10 });
	});
	
/**************************************************************************
*
*					UTILITY COMPONENTS
*
**************************************************************************/

	/**
	*	Collidable component. Has a type, a callback and the ability to run callback.
	*/
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

/**************************************************************************
*
*					GAME COMPONENTS
*
**************************************************************************/

	Crafty.c("Platform", {
		init: function(entity) {
			this.requires("2D, Net")
				.define("CLIENT", function() {
					this.addComponent("DOM, Color")
						.color('rgb(0,0,0)');
				})
				.define("SERVER", function() {
					this.addComponent("Collidable")
						.collidable(TYPE_BORDER, null);
				});
		}
	});

	Crafty.c("Score", {
		init: function(entity) {
			this.requires("2D, Net")
				.define("CLIENT", function() {
					this.addComponent("DOM, Text")
						.text("0")
						.netBind("UPDATE_POINTS", function(points) {
							this.text(points);
						});
				})
		},
		score: function(sourceEvent, targetEvent) {
			this.define("SERVER", function() {
				this.attr({points: 0})
					.addComponent("Collidable")
					.collidable(TYPE_SCORE, function(collider) {
						Crafty.trigger(sourceEvent);
					})
					.bind(targetEvent, function() {
						this.netTrigger("UPDATE_POINTS", ++this.points);
					});
			});
		}
	});

	Crafty.c("Paddle", {
		init: function(entity) {
			this.requires("2D, Net")
				.define("CLIENT", function() {
					this.addComponent("DOM, Color")
						.color('rgb(255,0,0)')
						.netBind('Moved', function(newPos) {
							this.x = newPos.x;
							this.y = newPos.y;
						});
				})
		},
		paddle: function(clientId, upKey, downKey) {
			this.define(clientId, function() {
					this.bind("KeyDown", function(e) {
							if (e.key === Crafty.keys[upKey] || e.key === Crafty.keys[downKey]) {
								this.netTrigger("KeyDown", {key: e.key});
							}
						})
						.bind("KeyUp", function(e) {
							if (e.key === Crafty.keys[upKey] || e.key === Crafty.keys[downKey]) {
								this.netTrigger("KeyUp", {key: e.key});
							}
						})
				})
				.define("SERVER", function() {
					var keyBinds = {};
					keyBinds[upKey] = -90;
					keyBinds[downKey] = 90;
					
					this.addComponent("Multiway, Collidable")
						.multiway(4, keyBinds)
						.collidable(TYPE_PADDLE, null)
						.netBind("KeyDown", function(e) {
							this.trigger("KeyDown", e);
						})
						.netBind("KeyUp", function(e) {
							this.trigger("KeyUp", e);
						})
						.bind("Moved", function(e) {
							this.netTrigger("Moved", e);
						});
				});
		}
	});

	Crafty.c("Ball", {
		init: function(entity) {
			this.requires("2D, Net")
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
		}
	});

/**************************************************************************
*
*				START LOADING SCENE AUTOMATICALLY
*
**************************************************************************/
	Crafty.scene("loading");
}