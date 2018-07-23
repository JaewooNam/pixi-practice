var clickCount = 0;
Slot = (function() {
	var deceleration = 0.23;
	
	function Slot(n, w, h, s, r) {
		PIXI.Container.apply(this, arguments);

		this.init(n, w, h, s, r);
	}

	// Inherit Container class
	Slot.prototype = Object.create(PIXI.Container.prototype, {
		constructor : {value : Slot}
	});

	Slot.prototype.sid;
	Slot.prototype.bw;
	Slot.prototype.bh;
	Slot.prototype.speed;
	Slot.prototype.radius;
	Slot.prototype.max;
	Slot.prototype.unit;
	Slot.prototype.icons;
	Slot.prototype.scrolling = false;
	Slot.prototype.stopped = false;
	Slot.prototype.completed = 0;
	Slot.prototype.blur;
	Slot.prototype.velocity;
	Slot.prototype.guide;
	Slot.prototype.gid;

	Slot.prototype.init = function(n, w, h, s, r) {
		this.sid = n;
		this.bw = w;
		this.bh = h;
		this.speed = this.velocity = s;
		this.radius = r;
		this.interactive = true;

		var container = new PIXI.Container();
		this.addChild(container);
		this.box = new PIXI.Container();
		container.addChild(this.box);

		this.blur = new PIXI.filters.BlurFilter();
		this.blur.blurX = 0;
		this.blur.blurY = 0;
		this.box.filters = [this.blur];

		var mask = new PIXI.Graphics();
		mask.beginFill(0xFFFFFF);
		mask.drawRect(-this.bw, -this.bh*2, this.bw*2, this.bh);
		mask.drawRect(-this.bw, this.bh, this.bw*2, this.bh);
		mask.endFill();
		this.addChild(mask);
		this.interactive = false;
	};

	Slot.prototype.setup = function(list) {
		this.max = list.length;
		this.unit = 360/this.max;
		this.icons = [];
		for (var n = 0; n < this.max; n++) {
			var icon = new SlotIcon(n, this.radius);
			this.box.addChild(icon);
			var texture = list[n];
			icon.setup(texture);
			icon.angle = 360 - this.unit*n;
			icon.update();
			icon.move();
			this.icons.push(icon);
		}
	};

	Slot.prototype.start = function() {
		this.scrolling = true;
		this.stopped = false;
		this.completed = 0;
		this.blur.blurY = 64;
		this.box.filters = [this.blur];
		this.speed = this.velocity;
	};

	Slot.prototype.stop = function() {
		this.scrolling = false;
		this.catchup();
	};

	Slot.prototype.update = function() {
		if (this.stopped) return;

		if (this.scrolling) {
			this.scroll();
		} else {
			this.slide();
		}
	};

	Slot.prototype.scroll = function() {
		for (var n = 0; n < this.max; n++) {
			var icon = this.icons[n];
			icon.angle += this.velocity;
			icon.update();
			icon.move();
		}
	};

	Slot.prototype.slide = function() {
		for (var n = 0; n < this.max; n++) {
			var icon = this.icons[n];
			icon.angle += (icon.tangle - icon.angle)*deceleration;
			if (Math.abs(icon.tangle - icon.angle) < 0.5) {
				icon.angle = icon.tangle;
				this.completed ++;
				if (this.completed > this.max + 1) {
					this.complete();
				}
			}
			icon.update();
			icon.move();
		}
		this.blur.blurY = Math.abs(icon.tangle - icon.angle);
	};

	Slot.prototype.complete = function() {
		this.box.filters = null;
		this.stopped = true;
		this.speed = 0;
		this.emit("complete", this);
		var gid = this.guide.pid;
		for (var n = 0; n < this.max; n++) {
			var icon = this.icons[n];
			icon.angle = icon.tangle = 360 - this.unit*(n - gid);
			icon.update();
			icon.move();
		}
		this.checkout();
	};

	Slot.prototype.catchup = function() {
		clickCount++;
		var list = [];
		for (var n = 0; n < this.max; n++) {
			var icon = this.icons[n];
			if (icon.visible) {
				list.push(icon);
			}
		}

		var pid = list[list.length - 1].pid;
		// Set probability to get JackPot at least once, in 1~20 times randomly.
		if (window.countPlay == window.jackPotCountNumber) {
			pid = window.jackPotPid;
		}
		
		this.guide = this.icons[pid];
		var offset = 360 - (this.guide.angle + 360)%360;
		this.setTarget(offset);
	};

	Slot.prototype.setTarget = function(offset) {
		for (var n = 0; n < this.max; n++) {
			var icon = this.icons[n];
			icon.tangle = icon.angle + offset;
		}
	};

	Slot.prototype.checkout = function() {
		this.gid = this.guide.pid;
		this.emit("select", this);
	};

	return Slot;
})();
