		Crafty.c("CheckProperty", {
			init: function(entity) {
			},
			checkProperty: function(property, callback) {
				if (this.hasOwnProperty(property))
					callback.call(this);
			}
		});