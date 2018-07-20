Button = (function() {

	function Button(textures) {
		PIXI.Container.apply(this, arguments);

		this.init(textures);
	}

	// Containerクラス継承
	Button.prototype = Object.create(PIXI.Container.prototype, {
		constructor : {value : Button}
	});

	Button.prototype.id;
	Button.prototype.button;
	Button.prototype.textures;
	Button.prototype._enabled = true;
	Button.prototype._selected = false;
	Button.prototype.pressing = false;
	Button.prototype.over = false;

	Button.prototype.init = function(textures) {
		this.textures = textures;

		this.button = new PIXI.Sprite(null);
		this.addChild(this.button);

		this.pivot.x = 54;
		this.pivot.y = 23;

		this.enabled(true);
		this.selected(false);

		this.mousedown = this.touchstart = press;
		this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = release;
		this.mouseover = rollover;
		this.mouseout = rollout;
	};

	Button.prototype.enabled = function(value) {
		this._enabled = value;
		if (value) {
			if (!this.over) {
				this.button.texture = this.textures.btn_up;
			} else {
				this.button.texture = this.textures.btn_over;
			}
		} else {
			this.button.texture = this.textures.btn_disabled;
		}
		this.interactive = value;
		this.buttonMode = value;
	};

	Button.prototype.selected = function(value) {
		this._selected = value;
		this._enabled = !value;
		if (value) {
			this.button.texture = this.textures.btn_selected;
		} else {
			this.button.texture = this.textures.btn_up;
		}
		this.interactive = !value;
		this.buttonMode = !value;
	};

	function press(data) {
		if (!this._enabled) return;
		this.pressing = true;
		this.button.texture = this.textures.btn_selected;
	}

	function release(data) {
		this.pressing = false;
		if (this.pressing || this.over) {
			this.button.texture = this.textures.btn_over;
		} else {
			this.button.texture = this.textures.btn_up;
		}
	}

	function rollover(data) {
		if (!this._enabled) return;
		this.over = true;
		this.button.texture = this.textures.btn_over;
	}

	function rollout(data) {
		if (!this._enabled) return;
		this.pressing = false;
		this.over = false;
		this.button.texture = this.textures.btn_up;
	}

	return Button;
})();