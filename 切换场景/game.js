var WIDTH = 600;
var HEIGHT = 600;
var level = 1;//等级，默认从1开始
var score = 0; //得分
var scoreText;//得分的文字说明，添加到舞台上
var topScore = 0;//最高得分
var speed = 1000;//月饼的滚动速度，默认1000豪秒
var dropSpeed = 10000;//吃货的下落速度，默认10000毫秒
var player;//吃货
var moonGroup;//我们把月饼放到这个分组里
var bang;//击中月饼的声音
var music;//背景音乐
var moon;

var currentMoonSpeed = 0;//月饼的移动速度
var currentPlayerSpeed = 0;//吃货的移动速度
var playerTime = 0;//吃货运动到月饼的高度需要的时间
var changeBGScore = 0;
var day;
var night;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

game.states = {};

game.states.menu = function() {
    this.preload = function() {
    	this.load.image('day', 'assets/bg/day.png');
        this.load.image('night', 'assets/bg/night.png');
        this.load.image('player', 'assets/b.png');
        this.load.image('s1', 'assets/mooncake/11.png');
        this.load.image('s2', 'assets/mooncake/22.png');
        this.load.image('1', 'assets/mooncake/1.png');
        this.load.image('2', 'assets/mooncake/2.png');
        this.load.image('3', 'assets/mooncake/3.png');
        this.load.image('4', 'assets/mooncake/4.png');
        this.load.image('5', 'assets/mooncake/5.png');
        this.load.image('6', 'assets/mooncake/6.png');
        this.load.image('7', 'assets/mooncake/7.png');
        this.load.image('message', 'assets/menu/message.png')
        this.load.image('button', 'assets/button.png');
        this.load.audio('bang', 'assets/music/bang.wav');
        this.load.audio('music', 'assets/music/675.mp3');
    },
    this.create = function() {
    	this.add.sprite(0, 0, 'day');
    	var menu = this.add.sprite(0,0, 'message');
        menu.x = (game.width - menu.width) / 2;
        menu.y = (game.height - menu.height) / 2;
        var button = this.add.button(0, 0, 'button', this.startGame);
        button.x = menu.x + (menu.width - button.width) / 2;
        button.y = menu.y + menu.height - button.height + 30;
    },
    this.startGame = function() {
    	game.state.start('start');
    }
}

game.states.start = function() {
	this.preload = function() {
		night = this.add.sprite(0, 0, 'night');
		night.visible = false;
    	day = this.add.sprite(0, 0, 'day'); // 添加背景图片
    	bang = this.add.audio('bang'); // 添加撞击音乐
        music = this.add.audio('music'); // 添加背景音乐
        this.input.maxPointers = 1; // 只能单指点击屏幕或鼠标（非多人游戏）
        game.physics.startSystem(Phaser.Physics.ARCADE); // 启动物理引擎
        topScore = localStorage.getItem("topScore") === null ? 0 : localStorage.getItem("topScore");
        scoreText = game.add.text(10, 10, "-", {
            font:"bold 18px Arial",
            fill: "#000000"
        });
        ///初始化状态
        score = 0;
        level = 1;
        currentMoonSpeed = 0;
        currentPlayerSpeed = 0;
        playerTime = 0;
        updateScore();
	},
	this.create = function() {
		music.play('', 0, 1, true); // 一直播放背景音乐
		moonGroup = game.add.group();//创建月饼分组
        moonGroup.enableBody = true;
        addMoon();
        addPlayer();
        game.physics.arcade.collide(player, moonGroup);//对吃货和月饼组的月饼进行碰撞检测
	},
	this.update = function() {
		game.physics.arcade.overlap(player, moonGroup, collectMoon, null, this);//对吃货和月饼组的月饼进行碰撞检测
	}
}
// 计算吃货运动到月饼高度需要的时间
function playerSpeed() {
	currentPlayerSpeed = 0.9;//(game.height - player.height - 150 + player.height) / 500
	playerTime = (game.height - player.height - 150 - moon.y) / currentPlayerSpeed;
}

function autoCalc(tween) {
	if (player && player.isFlying) {
		return;
	}//避免放置多个吃货
	var b = (moon.x - 300) / currentMoonSpeed;//计算月饼所需时间
//所需时间如果小于100毫秒就发射吃货
	if (moon.moving && Math.abs(playerTime - b) <= 100){
		fire();
	}
}

game.states.stop = function() {
    this.preload = function() {
        this.add.sprite(0, 0, 'day');
        var menu = this.add.sprite(0,0, 'message');
        menu.x = (game.width - menu.width) / 2;
        menu.y = (game.height - menu.height) / 2;
        var button = this.add.button(0, 0, 'button', this.startGame);
        button.x = menu.x + (menu.width - button.width) / 2;
        button.y = menu.y + menu.height - button.height + 30;
        scoreText = game.add.text(Math.max(30, menu.x + 10), menu.y - 50, "-", {
            font:"bold 28px Arial",
            fill: "#000000"
        });
    },
    this.create = function() {
        updateScore();
    },
    this.startGame = function() {
        game.state.start('start');
    }
}

function collectMoon(player, moon) {
    playerTween.stop();
    if(moon.name === 'special') {
    	score += 5;
    	changeBGScore += 5;
    } else {
	    score += 1;
	    changeBGScore += 1;
    }
    if (changeBGScore >= 20) {
    	changeBGScore = 0;
    	if (day.visible === false) {
    		day.visible = true;
    		night.visible = false;
    	} else {
    		day.visible = false;
    		night.visible = true;
    	}
    }
    if(score > 0 && score % 10 === 0) {
        level += 1;
        resetSpeed();
    } 
    player.isFlying = false;
    moon.moving = false;
    bang.play();//播放吃到月饼的声音
    moon.kill();//销毁月饼
    player.kill();//销毁吃货
    updateScore();//更新得分
    addMoon(); //添加一个新的月饼
    addPlayer();//添加一个新的吃货
}

// 更新得分
function updateScore() {
	scoreText.text = "得分：" + score + "    最高得分：" + Math.max(score, topScore);
}

// 更新速度
function resetSpeed() {
	speed =  speed - 1;
	speed <= 500 ? 500 : speed;
    dropSpeed = dropSpeed - 1;
    dropSpeed <= 800 ? 800 : dropSpeed;
}

// 添加月饼
function addMoon() {
	var index = game.rnd.between(1, 7);//随机一个1到7的数字，好创建对应数字的月饼
	//var moon;
	if (score >0 && score % 10 == 0) {
		var name = game.rnd.between(0, 1) === 0 ? 's1' : 's2';
        moon = moonGroup.create(0, 0, name);
        moon.name = 'special';
        game.physics.arcade.enable(moon);
	} else {
    	moon = moonGroup.create(0, 0, index.toString());//创建月饼
    }
    moon.anchor.set(0.5); // 设置演员锚点为中心点
    var x = game.width - moon.width / 2;
    var y = -moon.height / 2;
    moon.x = x;
    moon.y = y;
    var moonEnterTween = game.add.tween(moon).to({y : Math.max(moon.height * 2, game.height / 2 - level * 5) }, 
    	game.rnd.between(500, 1000), 'Bounce', true);
    moonEnterTween.onComplete.add(moveMoon, this, 0, moon);
    
}

// 滚动月饼
function moveMoon(moon) {
	playerSpeed();
    currentMoonSpeed = (game.width - moon.width) / speed;
    console.log("speed is" + speed + " , moon speed is " + currentMoonSpeed);
    moonTween = game.add.tween(moon).to({
        x : moon.width / 2,
        angle : -720
    }, speed, "Linear", true);
    moon.moving = true;
    moonTween.onUpdateCallback(autoCalc, moonTween);
    moonTween.yoyo(true, 0);
    moonTween.repeat(50, 0);
}

// 添加吃货
function addPlayer() {
    player = game.add.sprite(0, 0, 'player');
    game.physics.arcade.enable(player);
    player.anchor.set(0.5);
    player.x = game.width / 2;
    player.y = game.height - player.height - 150;
    playerTween = game.add.tween(player).to({ y : game.height }, dropSpeed, 'Linear', true);
    playerTween.onComplete.add(gameOver, this);
    game.input.onDown.add(fire, this);
}
// 发射吃货
function fire() {
    game.input.onDown.remove(fire, this);
    playerTween.stop();
    player.isFlying = true;
    playerTween = game.add.tween(player).to({ y : -player.height }, 500, 'Linear', true);
    playerTween.onComplete.add(gameOver, this);
}

// 游戏结束
function gameOver() {
    localStorage.setItem("topScore", Math.max(score, topScore));//记录最高得分
    updateScore();//更新显示分数
    music.stop();//停止播放背景音乐
    game.state.start('stop');//跳转到游戏结束的舞台
}

game.state.add('menu', game.states.menu);
game.state.add('start', game.states.start);
game.state.add('stop', game.states.stop);
game.state.start('menu');