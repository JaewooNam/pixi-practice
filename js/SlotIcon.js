SlotIcon = (function() {

	var radian = Math.PI/180;
	var offset = 45;

	function SlotIcon(n, r) {
		PIXI.Container.apply(this, arguments);

		this.init(n, r);
	}

	// Containerクラス継承
	SlotIcon.prototype = Object.create(PIXI.Container.prototype, {
		constructor : {value : SlotIcon}
	});

	SlotIcon.prototype.pid;
	SlotIcon.prototype.point;
	SlotIcon.prototype.angle;
	SlotIcon.prototype.tangle;
	SlotIcon.prototype.radius;

	SlotIcon.prototype.init = function(n, r) {
		this.pid = n;
		this.radius = r;
	};

	SlotIcon.prototype.setup = function(texture) {
		var icon = new PIXI.Sprite(texture);
		this.addChild(icon);
		icon.pivot.x = icon.width >> 1;
		icon.pivot.y = icon.height >> 1;
	};

	SlotIcon.prototype.update = function() {
		this.point = this.radius*Math.sin(this.angle*radian);
	};

	SlotIcon.prototype.move = function() {
		var degree = (this.angle + 360)%360;
		if (degree > offset && degree < 360 - offset) {
			this.angle = Math.round(this.angle);
			this.visible = false;
		} else {
			this.visible = true;
			this.position.y = this.point;
		}
	};

	return SlotIcon;
})();