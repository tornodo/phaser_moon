var WIDTH = 600;
var HEIGHT = 600;
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game');

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
    	this.add.sprite(0, 0, 'day'); // 添加背景图片
    	bang = this.add.audio('bang'); // 添加撞击音乐
        music = this.add.audio('music'); // 添加背景音乐
        this.input.maxPointers = 1; // 只能单指点击屏幕或鼠标（非多人游戏）
        game.physics.startSystem(Phaser.Physics.ARCADE); // 启动物理引擎
	},
	this.create = function() {
		music.play('', 0, 1, true); // 一直播放背景音乐
        var moon = this.add.sprite(0, 0, "1");
        moon.anchor.set(0.5); // 设置演员锚点为中心点
        var x = game.width - moon.width / 2;
        var y = -moon.height / 2;
        moon.x = x;
        moon.y = y;
	},
	this.update = function() {
		
	}
}
game.state.add('menu', game.states.menu);
game.state.add('start', game.states.start);
game.state.start('menu');