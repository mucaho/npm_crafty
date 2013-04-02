exports.startGame = function(Crafty, CLIENT) {
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
	
	Crafty.c("ClientPaddle", {
		init: function(entity) {
			this
			.bind("KeyDown", function(e) {
				this.netTrigger("KeyDown", e);
			})
			.bind("KeyUp", function(e) {
				this.netTrigger("KeyUp", e);
			})
			.netBind('Moved', function(newPos) {
				this.x = newPos.x;
				this.y = newPos.y;
			});
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
	
	var entityMap = {};
	var initCommon = function() {
		entityMap["Roof"] = Crafty.e("2D, NetEvents").attr({ x: 0, y: 0, w: 600, h: 10 });
		entityMap["Floor"] = Crafty.e("2D, NetEvents").attr({ x: 0, y: 290, w: 600, h: 10 });
		entityMap["ScoreLeft"] = Crafty.e("2D, NetEvents").attr({ x: 0, y: 10, w: 10, h: 280});
		entityMap["ScoreRight"] = Crafty.e("2D, NetEvents").attr({ x: 590, y: 10, w: 10, h: 280});
		entityMap["PaddleLeft"] = Crafty.e("2D, NetEvents").attr({ x: 40, y: 100, w: 10, h: 100 });
		entityMap["PaddleRight"] = Crafty.e("2D, NetEvents").attr({ x: 550, y: 100, w: 10, h: 100 });
		entityMap["Ball"] = Crafty.e("2D, NetEvents").attr({ x: 300, y: 150, w: 10, h: 10 });
	};
	var initClient = function() {
		entityMap["Roof"]
			.addComponent("DOM, Color")
			.color('rgb(0,0,0)');
		entityMap["Floor"]
			.addComponent("DOM, Color")
			.color('rgb(0,0,0)');
			
		
		entityMap["ScoreLeft"]
			.attr({points: 0})
			.addComponent("DOM, Text")
			.text("0")
			.netBind(EVENT_RIGHT_HIT, function() {
				this.text(++this.points);
			});
		entityMap["ScoreRight"]
			.attr({points: 0})
			.addComponent("DOM, Text")
			.text("0")
			.netBind(EVENT_LEFT_HIT, function() {
				this.text(++this.points);
			});
		
		
		entityMap["PaddleLeft"]
			.addComponent("DOM, Color, ClientPaddle")
			.color('rgb(255,0,0)');
		entityMap["PaddleRight"]
			.addComponent("DOM, Color, ClientPaddle")
			.color('rgb(0,255,0)');
			
		
		entityMap["Ball"]
			.addComponent("DOM, Color")
			.color('rgb(0,0,255)')
			.netBind('Moved', function(newPos) {
				this.x = newPos.x;
				this.y = newPos.y;
			});
	};
	var initServer = function () {
		entityMap["Roof"]
			.addComponent("Collidable")
			.collidable(TYPE_BORDER, null);
		entityMap["Floor"]
			.addComponent("Collidable")
			.collidable(TYPE_BORDER, null);
			
			
		entityMap["ScoreLeft"]
			.addComponent("Collidable")
			.collidable(TYPE_SCORE, function(collider) {
				Crafty.netTrigger(EVENT_LEFT_HIT);
			});
		entityMap["ScoreRight"]
			.addComponent("Collidable")
			.collidable(TYPE_SCORE, function(collider) {
				Crafty.netTrigger(EVENT_RIGHT_HIT);
			});
		
		
		entityMap["PaddleLeft"]
			.addComponent("Multiway, Collidable, ServerPaddle")
			.multiway(4, { W: -90, S: 90 })
			.collidable(TYPE_PADDLE, null);
		entityMap["PaddleRight"]
			.addComponent("Multiway, Collidable, ServerPaddle")
			.multiway(4, { UP_ARROW: -90, DOWN_ARROW: 90})
			.collidable(TYPE_PADDLE, null);


		entityMap["Ball"]
			.addComponent("Collision, Collidable, Movable")
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
					this.x = 300;
				} else if (type === TYPE_PADDLE) {
					this._dX *= -1;
				} else if (type === TYPE_BORDER) {
					this._dY *= -1;
				}
			})
			.movable(Crafty.math.randomInt(2, 5), Crafty.math.randomInt(2, 5))
			.bind('Moved', function(newPos) {
				this.netTrigger('Moved', newPos);
			});
	};
	
	
	//define main scene
	Crafty.scene("main", function() {
		initCommon();
		if (CLIENT) {
			Crafty.background('rgb(127,127,127)');
			initClient();
		} else {
			initServer();
		}
	});
	//automatically play the main scene
	Crafty.scene("main");
}