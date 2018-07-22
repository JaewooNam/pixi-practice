var stage, renderer;
var container, front
var loader;
var bw = 80;
var bh = 90;
var max = 3;
var slots;
var speed = 10;
var radius = 360;
var playBtn, stopBtns;
var timer;
var completed = 0;
var label;
var list;
var checked = 0;

stage = new PIXI.Container();
renderer = PIXI.autoDetectRenderer(640, 589, {transparent: true, backgroundColor: 0xFFFFFF});
document.body.appendChild(renderer.view);
renderer.view.style.display = "block";
renderer.view.style.width = "1500";
renderer.view.style.marginTop = "40px";
renderer.view.style.marginLeft = "auto";
renderer.view.style.marginRight = "auto";
renderer.view.style.paddingLeft = "0";
renderer.view.style.paddingRight = "0";

container = new PIXI.Container();
stage.addChild(container);
front = new PIXI.Container();
stage.addChild(front);

let totalBetMoney = new PIXI.Text(1000, {fontFamily: 'Arial-Bold', fontSize: 30, fill: 0xFFFFFF, align: 'center'});
let betMoney = new PIXI.Text(10, {fontFamily: 'Arial-Bold', fontSize: 30, fill: 0xFFFFFF, align: 'left'});
let plusBtn = PIXI.Sprite.fromImage('images/add_btn_on.png');
let minusBtn = PIXI.Sprite.fromImage('images/minus_btn_on.png');
let maxBetting = PIXI.Sprite.fromImage("images/max_bet.png");

plusBtn.alpha = 0.7;
minusBtn.alpha = 0.7;
maxBetting.alpha = 0.7;

console.log("test sound");
var sound = new Howl({
    // src: ['sound/play_sound.mp3'],
    src: ['sound/bgm_main_rockstar.mp3'],
    volume: 0.3,
});

sound.play();

var stopSound = new Howl({
    src: ['sound/ui_3.mp3'],
    volume: 0.5
});

var plusCoinSound = new Howl({
    src: ['sound/plus_coin.mp3'],
    volume: 0.8
});

var minusCoinSound = new Howl({
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

// make sound button on/off sprite
let soundBtnOn = PIXI.Sprite.fromImage('images/volume_up_on.png');
soundBtnOn.x = 600;
soundBtnOn.y = 10;
soundBtnOn.width = 30;
soundBtnOn.height = 30;
soundBtnOn.alpha = 0.7;
front.addChild(soundBtnOn);
soundBtnOn.interactive = true;
soundBtnOn.buttonMode = true;
soundBtnOn.on('pointerdown', soundOn);

let soundBtnOff = PIXI.Sprite.fromImage('images/volume_down_on.png');
soundBtnOff.x = 600;
soundBtnOff.y = 10;
soundBtnOff.alpha = 0.7;
soundBtnOff.width = 30;
soundBtnOff.height = 30;
soundBtnOff.visible = false;
front.addChild(soundBtnOff);
soundBtnOff.interactive = true;
soundBtnOff.buttonMode = true;
soundBtnOff.on('pointerdown', soundOff);

// Set background image
var backGroundSprite = PIXI.Sprite.fromImage("images/bg_image.png");
stage.addChild(backGroundSprite);
backGroundSprite.addChild(front);

background();

loader = new PIXI.loaders.Loader();
loader.add("icons", "images/sushi_reel.json");
loader.add("button", "images/button_images.json");
loader.add("button2", "images/bet_images.json")
loader.on("complete", complete);
loader.load();

update();

front.addChild(totalBetMoney);
front.addChild(betMoney);

plusBtn.mouseover = function(mouseData) {
    this.alpha = 1;
}

plusBtn.mouseout = function(mouseData) {
    this.alpha = 0.7;
}

minusBtn.mouseover = function(mouseData) {
    this.alpha = 1;
}

minusBtn.mouseout = function(mouseData) {
    this.alpha = 0.7;
}

maxBetting.mouseover = function(mouseData) {
    this.alpha = 1;
}
    
maxBetting.mouseout = function(mouseData) {
    this.alpha = 0.7;
}

soundBtnOff.mouseover = function(mouseData) {
    this.alpha = 1;
}
    
soundBtnOff.mouseout = function(mouseData) {
    this.alpha = 0.7;
}

soundBtnOn.mouseover = function(mouseData) {
    this.alpha = 1;
}    

soundBtnOn.mouseout = function(mouseData) {
    this.alpha = 0.7;
}

// start animating
animate();

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
	for (var n = 0; n < max; n++) { 
		var content = new PIXI.Container();
		container.addChild(content);
		content.position.x = 120 + 150*n;
		content.position.y = 300;
		var base = new PIXI.Graphics();
		// Fill color in reel
		base.beginFill(0xc2eefc);
		base.drawRect(-bw, -bh, bw*2, bh*2);
		base.endFill();
		content.addChild(base);
		var slot = new Slot(n, bw, bh, speed, radius);
		content.addChild(slot);
		slot.setup(icons);
		slots.push(slot);
	}
}

function play(data) {
    startSound.play();
    playBtn.selected(true);
    if (totalBetMoney.text - betMoney.text >= 0 && betMoney.text > 0) {
        totalBetMoney.text = totalBetMoney.text - betMoney.text;
    } else {
        errorMessage.visible = true;
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
    var slot = slots[id];

	stopBtn.selected(true);
    stopSound.play();
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
	completed++;
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

let winText = new PIXI.Text("WIN!!", {
    fontWeight: 'bold',
    fontSize: 60,
    fontFamily: 'Arial',
    fill: '#ff00cb',
    align: 'center',
    stroke: '#FFFFFF',
    strokeThickness: 6
});

winText.position.x = 200;
winText.position.y = 200;
winText.visible = false;
front.addChild(winText);

let errorMessage = new PIXI.Text("Not Enough Balance", {
    fontWeight: 'bold',
    fontSize: 40,
    fontFamily: 'Arial',
    fill: '#db1313',
    align: 'left',
    stroke: '#FFFFFF',
    strokeThickness: 6
});

errorMessage.position.x = 100;
errorMessage.position.y = 400;
errorMessage.visible = false;
stage.addChild(errorMessage);

function match() {
    var parsedTotalBetMoney;
    var parsedBetMoney;
    var matchingBonus;

    winText.visible = false;
    parsedTotalBetMoney = parseInt(totalBetMoney.text);
    parsedBetMoney = parseInt(betMoney.text);

	if ((list[0] == list[1]) && (list[0] == list[2])) {
        matchingBonus = parsedBetMoney * 10;

        if (list[0] == 3) {
            matchingBonus = parsedBetMoney * 20;
        }

        totalBetMoney.text = parsedTotalBetMoney + matchingBonus;
        matchedSound.play();
        winText.visible = true;
    } else {
        winText.visible = false;
        if (betMoney.text >= totalBetMoney.text) {
            if (parseInt(totalBetMoney.text) == 0) {
                plusBtn.x = 130;
                betMoney.text = 10;
                return;
            }
            betMoney.text = totalBetMoney.text;
        }
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
		stopBtn.position.x = 125 + (150 * n);
        stopBtn.position.y = 383;
        stopBtn.height = 50;
		stopBtn.click = stopBtn.touchstart = stop;
		stopBtn.enabled(false);
		stopBtns.push(stopBtn);
	}

	playBtn = new Button(textures_play);
	front.addChild(playBtn);
	playBtn.position.x = 270;
    playBtn.position.y = 460;
    playBtn.click = playBtn.touchstart = play;

	minusBtn.x = 30;
	minusBtn.y = 550;
	minusBtn.width = 30;
	minusBtn.height = 30;
	front.addChild(minusBtn);
	minusBtn.interactive = true;
    minusBtn.buttonMode = true;
    minusBtn.on('pointerdown', minusCoin);

    betMoney.x = minusBtn.x + 50;
    betMoney.y = minusBtn.y;

    plusBtn.x = betMoney.x + (betMoney.x - minusBtn.x);
    // 130
    console.log("init plustBtn.x = ", plusBtn.x);
	plusBtn.y = minusBtn.y;
	plusBtn.width = 30;
	plusBtn.height = 30;
	front.addChild(plusBtn);
	plusBtn.interactive = true;
    plusBtn.buttonMode = true;
    plusBtn.on('pointerdown', plusCoin);


    maxBetting.x = 130;
	maxBetting.y = 514;
	maxBetting.width = 40;
	front.addChild(maxBetting);
	maxBetting.interactive = true;
    maxBetting.buttonMode = true;
    maxBetting.on('pointerdown', setMaxBetMoney);

    totalBetMoney.x = 530;
    totalBetMoney.y = betMoney.y;

    // sound button
}

function setMaxBetMoney() {
    console.log("maxbetfunc 1= ",betMoney.text);
    var tempBetMoney;
    var tempTotalBetMoney;
    var preDigit;
    var currentDigit;

    tempBetMoney = parseInt(betMoney.text);
    console.log("maxbetfunc 2= ", tempBetMoney);
    tempTotalBetMoney = parseInt(totalBetMoney.text);

    resizePlustButton(tempTotalBetMoney);
    // var num = tempBetMoney;
    // num = num.toString();
    // preDigit = num.length;

    // var num2 = tempTotalBetMoney;
    // num2 = num2.toString();
    // currentDigit = num2.length;
    // console.log("max1 = ", num);
    // console.log("max2 = ", num2);
    // console.log("currentDigit max f = ", currentDigit);
    // if (currentDigit > preDigit) {
    //     console.log("max width ", plusBtn.x);
    //     if (plusBtn.x >= 160) {
    //         plusBtn.x = 130;
    //         return;
    //     }
    //     if (plusBtn.x >= 130) {
    //         plusBtn.x += 20;
    //     }
    // }

    betMoney.text = tempTotalBetMoney;
    plusCoinSound.play();
}

function soundOn() {
    soundBtnOn.visible = false;
    soundBtnOff.visible = true;
    soundBtnOff.interactive = true;
    soundBtnOff.buttonMode = true;
    soundBtnOff.on('pointerdown', soundOff);
    sound.pause();
}

function soundOff() {
    soundBtnOff.visible = false;
    soundBtnOn.visible = true;
    sound.play();
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
        fontWeight: 'bold',
        fill: ['#ffffff', '#ffffff'], // gradient
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
	front.addChild(richText);
    
    richText.position.x = 4;
	richText.position.y = 0;
	richText.alpha = 0.5;
}

function plusCoin() {
    var tempBetMoney;
    var tempTotalBetMoney;
    tempBetMoney = parseInt(betMoney.text) + 10;
    console.log("plus btn clicked, ",tempBetMoney);
    tempTotalBetMoney = parseInt(totalBetMoney.text);
    if (tempBetMoney > tempTotalBetMoney) {
        plusBtn.enabled(true);
        return;
    }

    resizePlustButton(tempBetMoney);
    betMoney.text = tempBetMoney;
    plusCoinSound.play();
}

function minusCoin() {
    var tempBetMoney;
    tempBetMoney = parseInt(betMoney.text) - 10;
    if (tempBetMoney <= 0) {
        minusBtn.enabled(true);
        return;
    }

    resizePlustButton(tempBetMoney);
    betMoney.text = tempBetMoney;
    minusCoinSound.play();
}

function resizePlustButton(currentBetMoney) {
    var num;
    num = currentBetMoney.toString();
    currentDigit = num.length;
    plusBtn.x = 130 + ((currentDigit - 2) * 10); 
}

function animate() {
    requestAnimationFrame(animate);
    // render the root container
    renderer.render(stage);
};
