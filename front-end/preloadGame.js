const Phaser = require("phaser");

function PreloadGame(){
	Phaser.Scene.call(this,"PreloadGame");
}

//Actual inheritence logic for PreloadGame to extend Phaser.Scene
PreloadGame.prototype = Object.create(Phaser.Scene.prototype);
PreloadGame.prototype.constructor = PreloadGame;

PreloadGame.prototype.preload = function(){
	this.load.spritesheet('player1Sprite', 'assets/p1.jpg', { frameWidth: 14, frameHeight: 14 });
	this.load.spritesheet('player2Sprite', 'assets/p2.jpg', { frameWidth: 14, frameHeight: 14 });
	this.load.spritesheet('locator', 'assets/game/sprites/soldier/locator.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('locator-1', 'assets/game/sprites/soldier/locator-1.png');
	this.load.image('locator-2', 'assets/game/sprites/soldier/locator-2.png');
	this.load.image('finish', 'assets/game/sprites/star_gold.png');
	this.load.atlas('soldier', 'assets/game/sprites/soldier/soldier-move.png', 'assets/game/sprites/soldier/soldier-move.json');
	this.load.image('bullet', 'assets/Light_Shell_yellow_10x10.png');
	
	// this.load.image('ground', '/assets/platform.png');

	this.load.image("terrain", "assets/game/maps/terrain_atlas512x.png");
	this.load.tilemapTiledJSON("map1", "assets/game/maps/map2-uncompressed-40x30-16px.json");
	// this.load.tilemapCSV("map1", "assets/game/maps/map1-40x30._wall.csv");

	//GUI
	this.load.image("window_small", "assets/game/GUI/ui_dark_blue_racing/window_small.png");
	this.load.image("unchecked_box", "assets/game/GUI/ui_dark_blue_racing/checkbox.png");
	this.load.image("checked_box", "assets/game/GUI/ui_dark_blue_racing/checkbox_select.png");
	this.load.image("bar", "assets/game/GUI/bar/bar.png");
	this.load.image("point", "assets/game/GUI/bar/point.png");

	//audio
	this.load.audio("gun_shoot", "assets/game/audio/gun-5.ogg");
	this.load.audio("player_got_shot", "assets/game/audio/scream-5.ogg");

	//music
	this.load.audio("bg_music", "assets/game/music/theme-4.ogg");

}
PreloadGame.prototype.create = function(){
	this.scene.start("PlayGame");
}

module.exports = PreloadGame;