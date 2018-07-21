var stage, renderer;
var container, front
var balanceStatus;
var loader;
var bw = 80;
var bh = 90;
var max = 3;
var slots;
var speed = 8;
var radius = 360;
var playBtn, stopBtns;
var timer;
var completed = 0;
var label;
var balance = 1000;
var totalBalanceMoney;
var list;
var checked = 0;

let totalBetMoney = new PIXI.Text(1000, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xFFFFFF, align: 'center'});
let betMoney = new PIXI.Text(10, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xFFFFFF, align: 'left'});
totalBetMoney.x = 530;
totalBetMoney.y = 545;
betMoney.x = 85;
betMoney.y = 545;

var sound = new Howl({
    src: ['sound/bgm_main_rockstar.mp3'],
    volume: 0.6
});

var sound2 = new Howl({
    src: ['sound/bgm_lobby.mp3'],
    volume: 0.6
});
sound.play();

var sound3 = new Howl({
    src: ['sound/ui_3.mp3'],
    volume: 0.8
});

var sound4 = new Howl({
    src: ['sound/plus_coin.mp3'],
    volume: 0.8
});

var sound5 = new Howl({
    src: ['sound/minus_coin.mp3'],
    volume: 0.8
});

var matchedSound = new Howl({
    src: ['sound/r_medal.mp3'],
    volume: 0.8
});

var startSound = new Howl({
    src: ['sound/Rescue_Blast_Start.mp3'],
    volume: 0.8
});


stage = new PIXI.Container();
renderer = PIXI.autoDetectRenderer(1500, 589, {transparent: true, backgroundColor: 0xFFFFFF});
document.body.appendChild(renderer.view);
renderer.view.style.display = "block";
renderer.view.style.width = "1500";

renderer.view.style.marginTop = "40px";
renderer.view.style.marginLeft = "auto";
renderer.view.style.marginRight = "auto";
renderer.view.style.paddingLeft = "0";
renderer.view.style.paddingRight = "0";


// container
container = new PIXI.Container();
stage.addChild(container);
front = new PIXI.Container();
stage.addChild(front);

// Set background image
var backGroundSprite = PIXI.Sprite.fromImage("images/bg_image.png");
stage.addChild(backGroundSprite);
backGroundSprite.addChild(front);

background();

loader = new PIXI.loaders.Loader();
//loader.add("frame", "images/frame.png");c
loader.add("icons", "images/sushi_reel.json");
loader.add("button", "images/button_images.json");
loader.add("button2", "images/bet_images.json")
loader.on("complete", complete);
loader.load();

update();

front.addChild(totalBetMoney);
front.addChild(betMoney);

function update() {
	renderer.render(stage);
	requestAnimationFrame(update);
}

function complete() {
	initialize();
	setup();
}

function initialize() {
	label = new PIXI.Text("", {"font": "24px Arial", "fill": "#666666", "align": "center"});
	stage.addChild(label);
	label.position.x = 320;
	label.position.y = 20;

	var icons = [];
	icons.push(PIXI.Texture.fromFrame("sushi_01.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_02.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_03.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_04.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_05.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_06.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_07.png"));

	slots = [];
	//var texture = PIXI.Texture.fromImage("images/bg_image.png");
	for (var n = 0; n < max; n++) {
		var content = new PIXI.Container();
		container.addChild(content);
		content.position.x = 120 + 150*n;
		content.position.y = 300;
		var base = new PIXI.Graphics();
		// Fill color in reel
		base.beginFill(0xe9fff8);
		base.drawRect(-bw, -bh, bw*2, bh*2);
		base.endFill();
		content.addChild(base);
		var slot = new Slot(n, bw, bh, speed, radius);
		content.addChild(slot);
		slot.setup(icons);
		slots.push(slot);
		// var frame = new PIXI.Sprite(texture);
		// frame.pivot.x = 110;
		// frame.pivot.y = 120;
		// content.addChild(frame);
	}

	// var frame = new PIXI.Sprite(texture);
	// frame.pivot.x = 10;
	// frame.pivot.y = 10;
	// content.addChild(frame);
}

function play(data) {

    console.log("play btn clicked");
    startSound.play();
    playBtn.selected(true);
    if (totalBetMoney.text - betMoney.text >= 0 && betMoney.text > 0) {
        totalBetMoney.text = totalBetMoney.text - betMoney.text;
    } else {
        playBtn.enabled(true);
        return;
    }

	for (var n = 0; n < max; n++) {
		var stopBtn = stopBtns[n];
		stopBtn.enabled(true);
	}

	start();
}

function start() {
	for (var n = 0; n < max; n++) {
		var slot = slots[n];
		//slot.on("select", selected);
		//slot.on("complete", scrolled);
		slot.once("select", selected);
		slot.once("complete", scrolled);
		slot.start();
	}
	timer = setInterval(tick, 16);

	completed = 0;
	label.text = "";
	list = [];
	checked = 0;
}

function stop(data) {
	var id = data.target.id;

	var stopBtn = stopBtns[id];
	stopBtn.selected(true);

    var slot = slots[id];
    sound3.play();
	slot.stop();
}

function tick() {
	for (var n = 0; n < max; n++) {
		var slot = slots[n];
		slot.update();
	}
}

function selected(event) {
	//event.off("select", selected);
	list[event.sid] = event.gid;
	checked ++;
	if (checked > max - 1) match();
}

function scrolled(event) {
	//event.off("complete", scrolled);
	completed ++;
	if (completed > max - 1) {
		clearInterval(timer);
		clear();
	}
}

function clear() {
	playBtn.selected(false);
	for (var n = 0; n < max; n++) {
		var stopBtn = stopBtns[n];
		stopBtn.selected(false);
		stopBtn.enabled(false);
	}
}

function match() {
    var parsedTotalBetMoney;
    var paresBetMoney;
    var matchingBonus;

    var spinningText = new PIXI.Text("WIN !!", {
        fontWeight: 'bold',
        fontSize: 60,
        fontFamily: 'Arial',
        fill: '#cc00ff',
        align: 'center',
        stroke: '#FFFFFF',
        strokeThickness: 6
    });

	if ((list[0] == list[1]) && (list[0] == list[2])) {
        parsedTotalBetMoney = parseInt(totalBetMoney.text);
        parsedBetMoney = parseInt(betMoney.text);
        matchingBonus = parsedBetMoney * 10;
        totalBetMoney.text = parsedTotalBetMoney + matchingBonus;
        front.addChild(spinningText);

        spinningText.marginLeft = 1000;
        spinningText.position.y = 300;

        matchedSound.play();
	} else {
        // parsedTotalBetMoney = parseInt(totalBetMoney.text);
        // parsedBetMoney = parseInt(betMoney.text);
        // matchingBonus = parsedBetMoney * 10;
        // totalBetMoney.text = parsedTotalBetMoney + matchingBonus;
        // front.addChild(spinningText);

        // spinningText.marginLeft = 1000;
        // spinningText.position.y = 300;
    }
    
//    sound.stop();
}

//layout
function setup() {
	var textures_play = {
		"btn_up" : PIXI.Texture.fromFrame("start_button_3.png"), 
		"btn_over" : PIXI.Texture.fromFrame("start_button_1.png"), 
		"btn_selected" : PIXI.Texture.fromFrame("start_button_4.png"), 
		"btn_disabled" : PIXI.Texture.fromFrame("start_button_2.png"), 
	};
	var textures_stop = {
		"btn_up" : PIXI.Texture.fromFrame("stop_button_1.png"), 
		"btn_over" : PIXI.Texture.fromFrame("stop_button_2.png"), 
		"btn_selected" : PIXI.Texture.fromFrame("stop_button_4.png"), 
		"btn_disabled" : PIXI.Texture.fromFrame("stop_button_3.png")
	};

	stopBtns = [];
	for (var n = 0; n < max; n++) {
		var stopBtn = new Button(textures_stop);
		front.addChild(stopBtn);
		stopBtn.id = n;
		// content.position.x = 120 + 150*n;
		// content.position.y = 300;
		stopBtn.position.x = 125 + 150*n;
		stopBtn.position.y = 383;
		stopBtn.click = stopBtn.touchstart = stop;
		stopBtn.enabled(false);
		stopBtns.push(stopBtn);
	}

	playBtn = new Button(textures_play);
	front.addChild(playBtn);
	playBtn.position.x = 270;
    playBtn.position.y = 460;

    playBtn.click = playBtn.touchstart = play;
	// console.log("play btn clicked!");


	// Set bet status pannel

	// Set balance pannel

	// Set Plus, Minus Buttons
	let plusBtn = PIXI.Sprite.fromImage('images/add_btn_on.png');
	let minusBtn = PIXI.Sprite.fromImage('images/minus_btn_on.png');
	plusBtn.x = 160;
	plusBtn.y = 550;
	plusBtn.width = 30;
	plusBtn.height = 30;
	front.addChild(plusBtn);
	plusBtn.interactive = true;
    plusBtn.buttonMode = true;
    plusBtn.on('pointerdown', addOneHero);

	minusBtn.x = 10;
	minusBtn.y = 550;
	minusBtn.width = 30;
	minusBtn.height = 30;
	front.addChild(minusBtn);
	minusBtn.interactive = true;
    minusBtn.buttonMode = true;
    var ccc = parseInt(betMoney.text);
    if (ccc < 10) {
        minusBtn.enabled(true);
        return;
    }
    minusBtn.on('pointerdown', minusCoin);
}

function background() {
	var version = PIXI.VERSION;
	var rendererType;
	switch (renderer.type) {
		case PIXI.RENDERER_TYPE.WEBGL :
			rendererType = "WebGL";
			break;
		case PIXI.RENDERER_TYPE.CANVAS :
			rendererType = "Context2D";
			break;
    }
    
    var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });
    
    var richText = new PIXI.Text("Sushi Slot", style);

	// var txt = "Sushi Slot";
	// var basic = new PIXI.Text(txt, {"font": "20px Arial", "fill": "#000000", "align": "left"});
	front.addChild(richText);

	// basic.position.x = 4;
	// basic.position.y = 0;
    // basic.alpha = 0.6;
    
    richText.position.x = 4;
	richText.position.y = 0;
	richText.alpha = 0.6;
}


function addOneHero () {
    sound4.play();
    console.log("it is true");
    console.log(typeof(betMoney.text));
    var a;
    var b;
    a = parseInt(betMoney.text);
    b = parseInt(totalBetMoney.text);

    if (a <= b) {
        betMoney.text = a + 10;
    }

	// heroBetCounterNumber.text++;
	// totalBets.text++;
	// console.log(totalBets.text);
	// balanceLeft.text--;
	// if(balanceLeft.text <0) {
	// 	alert("You are out of cash!");
	// 	balanceLeft.text++;
	// 	totalBets.text --;
	// 	heroBetCounterNumber.text--;
	// 	console.log(totalBets.text);
	// }
	// var audio_bet = document.getElementById("audio_bet");
	// if (audio_bet.paused) {
	// 	audio_bet.play();        
	// } else {
	// 	audio_bet.currentTime = 0;
	// }
}

function minusCoin() {
    sound5.play();
    console.log("it is true");
    var a;
    a = parseInt(betMoney.text);
    if (betMoney.text > 0) {
        betMoney.text = a - 10;
    } else {
        playBtn.enabled(true);
        return;
    }

	// heroBetCounterNumber.text++;
	// totalBets.text++;
	// console.log(totalBets.text);
	// balanceLeft.text--;
	// if(balanceLeft.text <0) {
	// 	alert("You are out of cash!");
	// 	balanceLeft.text++;
	// 	totalBets.text --;
	// 	heroBetCounterNumber.text--;
	// 	console.log(totalBets.text);
	// }
	// var audio_bet = document.getElementById("audio_bet");
	// if (audio_bet.paused) {
	// 	audio_bet.play();        
	// } else {
	// 	audio_bet.currentTime = 0;
	// }
}
