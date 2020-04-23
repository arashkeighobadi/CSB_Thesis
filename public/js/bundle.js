(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = MessageBox;

function MessageBox(that, text, w = 400, h = 250){
    this.gameScene = that;
    //make a group to hold all the elements
    this.msgBox = this.gameScene.add.group();
    
    // let rt = this.gameScene.add.renderTexture(0, 0, 800, 600);
    this.back = this.gameScene.add.rectangle(400, 300, w, h, 0xff0000);
    // rt.draw(this.back, 300, 300);
    //make the back of the message box
    // this.back = this.gameScene.add.sprite(0, 0, "boxBack");
    //make a text field
    this.text1 = this.gameScene.add.text(0, 0, text, { fontSize: '32px', fill: '#FFFFFF' });
    //set the textfeild to wrap if the text is too long
    this.text1.wordWrap = true;
    //make the width of the wrap 90% of the width 
    //of the message box
    // this.text1.wordWrapWidth = {width: 50};
    //
    //
    //add the elements to the group
    this.msgBox.add(this.back);
    this.msgBox.add(this.text1);
    //
    //
    //
    //set the message box in the center of the screen
    this.msgBox.x = 400;
    this.msgBox.y = 300;
    //
    //set the text in the middle of the message box
    this.text1.x = 400 - this.text1.width/2;
    this.text1.y = 200 - this.text1.height / 2;
    //make a state reference to the messsage box
    // this.msgBox = msgBox;
    return 3;
}

MessageBox.prototype.addButton = function(buttonText, buttonLogic) {
    //make the close button
    // this.button = this.gameScene.add.button(0, 0, buttonText);
    this.button = this.gameScene.add.text(400, 300, buttonText, { fontSize: '32px', fill: '#0f0' });
    this.button.setInteractive();
    this.button.on('pointerdown', buttonLogic);


    //add the button to the group
    this.msgBox.add(this.button);
    //set the close button
    //in the center horizontally
    //and near the bottom of the box vertically
    this.button.x = 400 - this.button.width/2;//this.back.width / 2 - this.button.width / 2;
    this.button.y = 300 - this.button.height/2;//this.back.height - this.button.height;
    //enable the button for input
    // this.button.inputEnabled = true;
    //add a listener to destroy the box when the button is pressed
    // this.button.events.onInputDown.add(this.hideBox, this);
}

MessageBox.prototype.hideBox = function() {
    //destroy the box when the button is pressed
    this.msgBox.getChildren().forEach(element => {
        element.destroy();
    });
    // this.msgBox.destroy();
    this.text1.destroy();
}

MessageBox.prototype.testing = function(){
    return 3;
}

},{}],2:[function(require,module,exports){
const Character = function(that, charInfo) {
    this.playGameScene = that;
    this.charID = charInfo.charID;
    this.team = charInfo.team;
    this.speed = 50;
    this.spriteAngle = charInfo.spriteAngle;
    this.bodySprite;
    this.charContainer = that.add.container(charInfo.x, charInfo.y).setSize(13, 13);
    this.charContainer.charID = this.charID;//change playerId to charID in charInfo objects everywhere
    this.charContainer.team = this.team;
    that.physics.world.enable(this.charContainer);
    this.charContainer.body.setCollideWorldBounds(true);
}

Character.prototype.testing = function(){
    console.log("called");
    return 3;
}

module.exports = Character;

},{}],3:[function(require,module,exports){
module.exports = Player;
const Character = require("./character.js");

function Player(that, playerInfo) {//extends Character in character.js
    Character.call(this, that, playerInfo);
    // this.playGameScene = that;//
    this.username = playerInfo.playerEmail;
    this.name = playerInfo.name;
    // this.speed = 50;//
    // angle is determined in searchForMatch method in the Net class
    // this.spriteAngle = playerInfo.spriteAngle;//
    
    // this.movement = that.movement.movingDirections.NONE;
    // this.lookingDirection = that.movement.lookingDirections.NONE;
    // this.bodySprite;//
    this.bodySprite = that.add.sprite(0, 0/* container/2 - bodySprite/2 */, 'soldier').setScale(0.4);//.setOrigin(0.5); //0.5 means middle of the sprite
    // this.charContainer;//
    
    //Score
    this.score = playerInfo.score;
    if (this.playGameScene.socket.id == playerInfo.charID){
        this.scoreText = this.playGameScene.add.text(584, 16, '', { fontSize: '32px', fill: '#FFFFFF' });
        this.scoreText.setText('wins: ' + this.score);
    }

    //locator
    this.locator = that.add.sprite(0, 0, 'locator').setAlpha(0.5);
    this.locatorBoundary = null;
    
    //to change the color of the locatorBoundary, depending on the team that was generated when we created our player info on the server.
    if (playerInfo.team === 'A') {
        this.locatorBoundary = that.add.sprite(0, 0, 'locator-1');
        // this.locator.setTint('ffef00');
    } 
    else if (playerInfo.team === 'B') {
        // this.bodySprite = that.add.sprite(0, 0/* container/2 - bodySprite/2 */, 'player2Sprite').setScale(0.4);//.setOrigin(0.5); //0.5 means middle of the sprite
        this.locatorBoundary = that.add.sprite(0, 0, 'locator-2');
        // this.locator.setTint('ffff66');            
    }
    else {
        console.log("wrong group name! for player ID " + playerInfo.charID);
    }
    
    //Animation
    that.animation.play('soldier-move', this.bodySprite);
    that.animation.play('locator', this.locator);
    
    //Created our player’s bodySprite by using the x and y coordinates that we generated in our server code.
    //Instead of just using self.add.image to create our player’s boySprite, we used  
    //self.physics.add.image in order to allow that game object to use the arcade physics.
    // this.charContainer = that.add.container(playerInfo.x, playerInfo.y).setSize(13, 13);//
    
    // this.charContainer.playerId = playerInfo.playerId;//
    
    //collisions
    // that.physics.world.enable(this.charContainer);//
    // this.charContainer.body.setCollideWorldBounds(true);//

    this.charContainer.add([this.locator]);
    this.charContainer.add([this.locatorBoundary]);
    this.charContainer.add([this.bodySprite]);

    that.players.add(this.charContainer);

}
    
//Actual inheritance logic
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Character;

Player.prototype.scoreUp = function() {
    this.playGameScene.socket.emit('scored', this.charContainer.charID);
    this.playGameScene.socket.on('scored', score => {
        //increase score
        console.log("I fucking scoreddddd!!!!");
        this.score = score;
        this.scoreText.setText('wins: ' + score);
    });
}

Player.prototype.get_xVelocity = function() {
    return this.charContainer.body.velocity.x;
}

Player.prototype.get_yVelocity = function() {
    return this.charContainer.body.velocity.y;
}

Player.prototype.getX = function() {
    return this.charContainer.x;
}

Player.prototype.getY = function() {
    return this.charContainer.y;
}
},{"./character.js":2}],4:[function(require,module,exports){
module.exports = BaseCollectable;

const Collectable = require('./collectable.js');
const MessageBox = require('../GUI/messageBox.js');

//stands for base collectable. i.e. the collectable in the opponent's base
function BaseCollectable(that, x, y, name){ // Extends Collectibe
    Collectable.call(this, that, x, y, name);
}

//Actual inheritance logic
BaseCollectable.prototype = Object.create(Collectable.prototype);
BaseCollectable.prototype.constructor = BaseCollectable;

BaseCollectable.prototype.playerCollision = function(that, charContainer, bodySprite){
// console.log("type of : " + typeof(this.players));
    let id = charContainer.charID;
    let ownTeam = that.player1.team;
    let oppTeam = that.opponent.team;
    // console.log("ownTeam : " + ownTeam);
    // console.log("charContainer.team : " + charContainer.team);
    // console.log(charContainer.team === ownTeam);
    // console.log("bodySprite.ownerTeam : " + bodySprite.ownerTeam);
    // console.log("ownTeam : " + ownTeam);
    // console.log(bodySprite.ownerTeam != ownTeam);
    if (charContainer.team === ownTeam && bodySprite.ownerTeam != ownTeam){
        that.player1.scoreUp();
        console.log("You won!");
        that.baseACollectable.bodySprite.destroy();
        delete that.baseACollectable;
        that.baseBCollectable.bodySprite.destroy();
        delete that.baseBCollectable;
        that.messageBox = new MessageBox(that, "You Won!");
        that.messageBox.addButton("PLAY AGAIN", () => {
            that.pause = true;
            that.messageBox.hideBox();
            that.scene.restart();
            console.log("clicked");
        });
    } else if (charContainer.team === oppTeam && bodySprite.ownerTeam != oppTeam){
        // console.log(that.playersList[id].username + " won!");
        let txt = that.opponent.name + " won!";
        //bodySprite.destroy();
        that.baseACollectable.bodySprite.destroy();
        that.baseBCollectable.bodySprite.destroy();
        that.messageBox = new MessageBox(that, txt);
        that.messageBox.addButton("PLAY AGAIN", () => {
            that.pause = true;
            that.messageBox.hideBox();
            that.scene.restart();
            console.log("clicked");
        });
    }
}


},{"../GUI/messageBox.js":1,"./collectable.js":5}],5:[function(require,module,exports){
module.exports = Collectable;

function Collectable(that, x, y, name){
  this.playGameScene = that;
  this.ownerTeam = null;
  this.bodySprite = that.add.sprite(x, y, name);
  this.bodySprite.ownerTeam = this.ownerTeam;
}
      
Collectable.prototype.enableBody = function(){
  this.playGameScene.physics.world.enableBody(this.bodySprite);
  this.bodySprite.body.moves = false;
}

Collectable.prototype.setOwnerTeam = function(team){
  this.ownerTeam = team;
  this.bodySprite.ownerTeam = this.ownerTeam;
}
},{}],6:[function(require,module,exports){
module.exports = Bullet;

const Explosive = require('./explosive.js');

function Bullet(that, x, y, name, owner){ // Extends Explosive 
    Explosive.call(this, that, x, y, name);
    this.bodySprite.setSize(4,4);
    this.owner = owner;
    this.bodySprite.owner = owner;
    this.speed = 500;
    that.bullets.add(this.bodySprite);
    // this.index = this.playGameScene.bulletList.length;
    // that.bulletList[this.index] = this;
    // this.bodySprite.setTint(0xffff00);
    
    this.enableBody();
    this.setCollideWorldBound(true);
    //NOTE: #1, #2, #3 work together
    this.bodySprite.body.onWorldBounds = true;//#1
}

// Actual inheritance logic
Bullet.prototype = Object.create(Explosive.prototype);
Bullet.prototype.constructor = Bullet;
   

//what to do when bullets collide the world bounds...
Bullet.prototype.onWorldBounds = function(bullet)//#3
{
    //NOTE: I'm not sure about this deallocation of the bullet.
    //      Must go through this topic in depth to make sure all the
    //      memory relevant to this bullet is freed after collision
    //      because by nature there's going to be a lot of bullets in the game.

    // console.log(bullet);
    // console.log(bullet.playGameScene.bulletList[bullet.index]);
    // console.log("triggered!");
    // bullet.setVelocity(0,0);
    console.log("bullet index : " + bullet.index);
    console.log(bullet.playGameScene.bulletList);
    // bullet.playGameScene.bulletList[bullet.index].bodySprite.destroy();
    // delete bullet.playGameScene.bulletList[bullet.index];
    // console.log(bullet);
    // console.log(bullet.playGameScene.bulletList[bullet.index]);
}
},{"./explosive.js":7}],7:[function(require,module,exports){
module.exports = Explosive;

function Explosive(that, x, y, name){
    this.playGameScene = that;
    this.ownerTeam = null;
    this.owner = null;
    this.bodySprite = that.physics.add.image(x, y, name);
    this.bodySprite.owner = this.owner;
    this.bodySprite.ownerTeam = this.ownerTeam;
}

Explosive.prototype.enableBody = function(){
    this.playGameScene.physics.world.enableBody(this.bodySprite);
}

Explosive.prototype.setCollideWorldBound = function(bool){
    if(bool && !this.bodySprite.body){
        this.enableBody();
        this.bodySprite.body.setCollideWorldBounds(bool);
    }
    else if (!bool && !this.bodySprite.body){
        console.log("Error: you can use setCollideWorldBound(false) only if the body has been enabled before!");
    }
    else {
        this.bodySprite.body.setCollideWorldBounds(bool);
    }
}

Explosive.prototype.setVelocity = function(xVelocity, yVelocity){
    this.bodySprite.body.setVelocity(xVelocity, yVelocity);
}
},{}],8:[function(require,module,exports){
let game;
window.onload = function() {
	//We created the configuration that will be used for our Phaser game.
	let config = {
		//we specify the width and height of the viewable area of our game.
		width: 800,//500,
		height: 600,//375,
	
		/*set the renderer type for our game
		The two main types are Canvas and WebGL. WebGL is a faster renderer and has better performance, but not all browsers support it. 
		By choosing AUTO for the type, Phaser will use WebGL if it is available, otherwise, it will use Canvas.*/
		type: Phaser.AUTO,

		/*  parent field is used to tell Phaser to render our game in an existing  <canvas>  element 
		with that id if it exists. If it does not exists, then Phaser will create a  <canvas>  element for us.
		*/
		parent: 'phaser-example',

		dom: {
			createContainer: true
		},
		
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,

		//we enabled the arcade physics that is available in Phaser, and we set the gravity to 0.
		physics: {
			default: 'arcade',
			arcade: {
				debug: false,
				// gravity: { x: 0, y: 0 }
			}
		},
	
		//we embedded a scene object which will use the  preload, update, and  create functions we defined.
		scene: [PreloadGame, PlayGame]
	};
	//we passed our config object to Phaser when we created the new game instance.
	game = new Phaser.Game(config);
}

//======================================================================================================//

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
}
PreloadGame.prototype.create = function(){
	this.scene.start("PlayGame");
}

//======================================================================================================//

function PlayGame(){
	Phaser.Scene.call(this, "PlayGame");
	this.clientNet = new ClientNet(this);
	this.socket = null;
	this.player1 = null;
	this.opponent = null;
	this.messageBox = null;
	this.baseACollectable = null;
	this.baseBCollectable = null;
	this.bullets = null;
	// this.bulletList = {};
	// to handle movement of everything which may move
	this.movement = new MovementHandler(this);
	// to handle collision of everything
	this.collisionHandler = new CollisionHandler(this);
	// to handle animation of everything
	this.animation = new AnimationHandler(this);
	// to handle keyboard events
	this.actionHandler = new ActionHandler(this);
	this.pause = false;


}

// Actual inheritence logic for PlayGame to extend Phaser.Scene
PlayGame.prototype = Object.create(Phaser.Scene.prototype);
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.create = function() {
	// this.graphics = this.add.graphics();
	// this.graphics.clear();
	// this.line = new Phaser.Geom.Line(300, 300, 400, 400);
	// this.graphics.lineStyle(5, 0x00ff00);
	// this.graphics.strokeLineShape(this.line);

	// set background color of the camera
	// this.cameras.main.setBackgroundColor('707070');
	// this.grid = this.add.grid(400, 300, 800, 600, 16, 16, null, null, 0xffffff, 0.3);
	this.socket = io().on('connect', () => {

		this.loadGame();
		//ask the user if tey are ready
		this.messageBox = new MessageBox(this, "Ready?");

		//if the user clicks on yes, the callback function is fired
		this.messageBox.addButton("YES", () => {
			this.messageBox.text1.setText("Searching...");
			//make the yes button disabled. Otherwise it can be pressed again.
			this.input.disable(this.messageBox.button);
			/* 	
				-client net sends a req to server to find a match.
				-server sends back player objects once found a match.
				-then the call back function which is defined below is fired.
			*/
			this.clientNet.searchForOpponent( (players) => {
				//we load the players after server responds
				this.loadPlayers(players);
				//we hide the message box
				this.messageBox.hideBox();
				//we ask clientNet to listen to further messages coming from the server
				this.clientNet.listenToServer();
				//we ask actionHandler to listen for keyboard messages of player1
				this.actionHandler.listenForAction();
				//now, if this.pause is true, we set it to false so the handleMoveEvent can work				
				if(this.pause){
					this.pause = false;
				}
			});
		});
	});
}


PlayGame.prototype.update = function() {
	if (this.player1) {
		this.handleMoveEvent(this);
		this.emitMovement(this);
	}
}

/*===============================   Functions used in create()	===============================*/
PlayGame.prototype.loadGame = function() {

	this.physics.world.on('worldbounds', this.actionHandler.onWorldBounds);

	// Message box for communicating with the user
	this.messageBox = null;
	
	//Groups in phaser are a way for us to manage similar game objects and control them as one unit. eg. for collision.
	this.players = this.add.group();
	this.physics.world.enableBody(this.players);
	
	this.bullets = this.add.group();
	// this.physics.world.enableBody(this.bullets);
	
	this.animation.createAnimations();

	
	
	//finish target
	// this.finishSprite = this.add.sprite(128, 50, 'finish');
	// this.finishSprite = this.add.sprite(672, 550, 'finish'); //debugging purpose
	// this.physics.world.enableBody(this.finishSprite);
	// this.baseACollectable = new BaseCollectable(this, 672, 580, 'finish');//debug
	this.baseACollectable = new BaseCollectable(this, 128, 50, 'finish');//nodebug
	this.baseACollectable.enableBody();
	this.baseACollectable.setOwnerTeam('A');
	
	this.baseBCollectable = new BaseCollectable(this, 672, 550, 'finish');
	this.baseBCollectable.enableBody();
	this.baseBCollectable.setOwnerTeam('B');

	/* 
		Add collider function takes 2 groups/objects which can collide as its first two arguments
		as the third argument, it takes a callback function which will be fired when they collide.
		*/
	// this.collisionHandler.addCollider(this.players, this.baseACollectable.bodySprite, this.baseACollectable.playerCollision);
	// this.collisionHandler.addCollider(this.players, this.baseBCollectable.bodySprite, this.baseBCollectable.playerCollision);
	this.collisionHandler.addOverlap(this.players, this.baseACollectable.bodySprite, this.baseACollectable.playerCollision);
	this.collisionHandler.addOverlap(this.players, this.baseBCollectable.bodySprite, this.baseBCollectable.playerCollision);

	this.collisionHandler.addCollider(this.players, this.bullets, this.collisionHandler.playerBulletCollision);

	//making a tilemap
	let map1 = this.make.tilemap({ key: "map1" }); /* , tileWidth: 40, tileHeight: 30 */
		//NOTE: here the first param is the name of the tileset layer in theTiled app and the 
		//		second is the name we gave to the png file thet we inported. If both were the same, 
		//		one param would be enough.
	let tileset = map1.addTilesetImage("terrain_atlas512x", "terrain");

		//layers
	let boundaryLayer = map1.createStaticLayer("boundary" , [tileset], 80, 60);
	let wallLayer = map1.createStaticLayer("wall", [tileset], 80, 60);

	wallLayer.setCollisionByProperty({collides: true});
	//collision by tile property
	boundaryLayer.setCollisionByProperty({collides: true});

	//player - map collision
	// this.physics.add.collider(this.players, wallLayer);
	this.collisionHandler.addCollider(this.players, wallLayer);
	// this.physics.add.collider(this.players, boundaryLayer);
	this.collisionHandler.addCollider(this.players, boundaryLayer);

	this.collisionHandler.addCollider(this.bullets, wallLayer, this.collisionHandler.bulletMapWallCollision);
	this.collisionHandler.addCollider(this.bullets, boundaryLayer, this.collisionHandler.bulletMapBoundCollision);
	
	/*
		Using Phaser’s built-in keyboard manager

		this will populate the cursors object with 
		our four main Key objects (up, down, left, and 
		right), which will bind to those arrows on the keyboard. 
		Then, we just need to see if these keys are being held down 
		in the  update function.
	*/
	this.cursors = this.input.keyboard.createCursorKeys();
}

//assigns the player objects which has recieved from server to player1 and opponent
PlayGame.prototype.loadPlayers = function(players){
	let that = this;
	//to loop through the players, we use Object.keys() to create an array of all the keys in the Object that is passed in
	//we use forEach() method to loop through each item in the array.
	Object.keys(players).forEach(
		function (id) {
			console.log("adding players");
			if (players[id].charID === that.socket.id) {
				//passes it the current player’s information, and a reference to the current scene.
				that.player1 = new Player(that, players[id]);
				console.log("Player calling testing functionin character: " + that.player1.testing());
				
			} else {//if players[id] is not the current player.			
				that.opponent = new Player(that, players[id]);
				that.opponent.charContainer.body.setAllowGravity(false);
			}
		}
	);			
		
}


PlayGame.prototype.playerCollidesTarget = function(self, charContainer, finishSprite) {
	// console.log("type of : " + typeof(this.players));
		let id = charContainer.charID;
		if (self.player1.charContainer.charID == id){
			this.playerWon();
			// self.player1.scoreUp();
			// console.log("You won!");
			// self.messageBox = new MessageBox(self, "You Won!");
			// self.messageBox.addButton("PLAY AGAIN", () => {
			// 	self.pause = true;
			// 	self.messageBox.hideBox();
			// 	self.scene.restart();
			// 	console.log("clicked");
			// });
		} else {
			this.playerLost();
			// console.log(self.playersList[id].username + " won!");
		// 	let txt = self.opponent.name + " won!";
		// 	self.messageBox = new MessageBox(self, txt);
		// 	self.messageBox.addButton("PLAY AGAIN", () => {
		// 		self.pause = true;
		// 		self.messageBox.hideBox();
		// 		self.scene.restart();
		// 		console.log("clicked");
		// 	});
		}
		self.finishSprite.destroy();		
}

PlayGame.prototype.playerWon = function(){
	this.player1.scoreUp();
	console.log("You won!");
	this.messageBox = new MessageBox(this, "You Won!");
	this.pause = true;
	this.messageBox.addButton("PLAY AGAIN", () => {
		this.messageBox.hideBox();
		this.scene.restart();
		console.log("clicked");
	});
}

PlayGame.prototype.playerLost = function(){
	let txt = this.opponent.name + " won!";
	this.messageBox = new MessageBox(this, txt);
	this.pause = true;
	this.messageBox.addButton("PLAY AGAIN", () => {
		this.messageBox.hideBox();
		this.scene.restart();
		console.log("clicked");
	});	
}

/*===============================   Functions used in update()	===============================*/
PlayGame.prototype.handleMoveEvent = function(self){
	if(self.pause){ return; }

	//The angular velocity will allow the soldier to rotate left and right.
	if (self.cursors.left.isDown) {
		self.movement.move('left', self.player1);
	} 
	else if (self.cursors.right.isDown) {
		self.movement.move('right', self.player1);
	} 
	else if (self.cursors.up.isDown) {
		self.movement.move('up', self.player1);
	} 
	else if (self.cursors.down.isDown) {
		self.movement.move('down', self.player1);
	}
	
	//when left or right is released the animation stops
	if (self.cursors.left.isUp && self.player1.movement === self.movement.movingDirections.LEFT) {
		self.movement.stop('left', self.player1);
	}
	else if (self.cursors.right.isUp && self.player1.movement === self.movement.movingDirections.RIGHT) {
		self.movement.stop('right', self.player1);
	}
	else if (self.cursors.up.isUp && self.player1.movement === self.movement.movingDirections.UP) {
		self.movement.stop('up', self.player1);
	}
	else if (self.cursors.down.isUp && self.player1.movement === self.movement.movingDirections.DOWN) {
		self.movement.stop('down', self.player1);
	}
	
	//if the player goes off screen we want it to appear on the other side of the screen.
	//we pass it the game object we want to wrap and an offset.
	//self.physics.world.wrap;	
}

PlayGame.prototype.emitMovement = function(self){

	//three new variables. We use them to store information about the player.
	let x = self.player1.getX();
	let y = self.player1.getY();
	//check to see if the player’s rotation or position has changed by comparing these variables to the player’s previous rotation and position.
	if (self.player1.oldPosition && 
			(x !== self.player1.oldPosition.x || y !== self.player1.oldPosition.y)) 
	{
		// emit player movement
		self.socket.emit('playerMovement', { x: self.player1.getX(), y: self.player1.getY(), 
			xVelocity: self.player1.get_xVelocity(), yVelocity: self.player1.get_yVelocity(), 
			spriteAngle: self.player1.spriteAngle});
	}
		
	// save old position data
	self.player1.oldPosition = {
		x: self.player1.getX(),
		y: self.player1.getY()
	};
}
	

const MovementHandler = require("./handlers/movementHandler.js");
const Player = require("./characters/player.js");
const AnimationHandler = require("./handlers/animationHandler.js");
const MessageBox = require("./GUI/messageBox.js");
const ClientNet = require("./handlers/clientNetHandler.js");
const CollisionHandler = require("./handlers/collisionHandler.js");
//stands for base collectable. i.e. the collectable in the opponent's base
const BaseCollectable = require("./collectables/baseCollectable.js"); 
const ActionHandler = require("./handlers/actionHandler.js");

module.exports = PlayGame;



},{"./GUI/messageBox.js":1,"./characters/player.js":3,"./collectables/baseCollectable.js":4,"./handlers/actionHandler.js":9,"./handlers/animationHandler.js":10,"./handlers/clientNetHandler.js":11,"./handlers/collisionHandler.js":12,"./handlers/movementHandler.js":13}],9:[function(require,module,exports){
module.exports = ActionHandler;

function ActionHandler(that) {
    this.playGameScene = that;
    //to make pressing down and releasing the key as a single shooting event
    this.spaceKeyReleased = true;
}

ActionHandler.prototype.listenForAction = function() {
    let self1 = this;
    let that = this.playGameScene;
    //Handling space key down and up for shooting
    //key down
    that.input.keyboard.on('keydown-SPACE', 
        function (event) {
            if (self1.spaceKeyReleased) {
                that.clientNet.emit('playerShoot');	
            }
        }
        );
    //key up
    that.input.keyboard.on('keyup-SPACE', 
        function (event) {
            self1.spaceKeyReleased = true;
        }
    );
}

ActionHandler.prototype.onWorldBounds = function(body){
    console.log(body.index);
    body.gameObject.destroy();
    // delete body.playGameScene.bulletList[body.index];
    console.log(body);
}

},{}],10:[function(require,module,exports){
module.exports = AnimationHandler;

function AnimationHandler(that) {
    this.playGameScene = that;
}

AnimationHandler.prototype.play = function(key, object){
    object.anims.play(key, true);
}

AnimationHandler.prototype.stop = function(key, object){
    object.anims.play(key, false);
}

AnimationHandler.prototype.createAnimations = function() {
    //Creating player animations
    this.playGameScene.anims.create({
        key: 'soldier-move',
        frames: this.playGameScene.anims.generateFrameNames('soldier', { prefix: 'survivor-move_handgun_', suffix: '.png', 
        end: 19, zeroPad: 2 }),
        frameRate: 10,
        repeat: -1
    });
    
    // this.playGameScene.anims.create({
    //     key: 'leftStatic',
    //     frames: [ { key: 'player', frame: 0 } ],
    //     frameRate: 20
    // });

    // this.playGameScene.anims.create({
    //     key: 'turn',
    //     frames: [ { key: 'player', frame: 4 } ],
    //     frameRate: 20
    // });

    // this.playGameScene.anims.create({
    //     key: 'right',
    //     frames: this.playGameScene.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });
    this.playGameScene.anims.create({
        key: 'locator',
        frames: this.playGameScene.anims.generateFrameNumbers('locator', { start: 0, end: 9 }),
        frameRate: 6,
        repeat: -1
    });
    
    // this.playGameScene.anims.create({
    //     key: 'rightStatic',
    //     frames: [ { key: 'player', frame: 7 } ],
    //     frameRate: 20
    // });

    //Creating bullet animations  (place holder)
    //...
    //...
}
},{}],11:[function(require,module,exports){
module.exports = ClientNet;

const MessageBox = require("../GUI/messageBox.js");
const Bullet = require("../explosives/bullet.js");

function ClientNet(that) { //in OOP terms, this is kinda constructor
    this.playGameScene = that;
}

// emits a message and an object to the server
ClientNet.prototype.emit = function(msg, obj){
    this.playGameScene.socket.emit(msg, obj);
}

ClientNet.prototype.searchForOpponent = function(callback) {
    let that = this.playGameScene;
    //sending the email of the logged in user in order to have 
    //it mapped to the player stored on the server side.
    this.emit('searching', sessionStorage.getItem('email'));
    that.socket.on('matched', players => {
        
        console.log("found match : " + players);
        callback(players);
    });
}

ClientNet.prototype.listenToServer = function (){
    let that = this.playGameScene;
    let self = this;

    //When the disconnect event is fired, we take that player’s id and we remove that player from the game.
    that.socket.on('disconnect', charID => {
        self.playerDisconnected(charID);
    });
    
    //when playerMoved event is emitted, we will need to update that player’s sprite in the game
    that.socket.on('playerMoved', function (opponentInfo) {
        self.moveOpponent(opponentInfo);
    });

    that.socket.on('shoot', bulletInfo => {
        let bullet = new Bullet(that, bulletInfo.x, bulletInfo.y, 'bullet', bulletInfo.owner);
        bullet.bodySprite.setAngle(bulletInfo.spriteAngle);
        bullet.setVelocity(bulletInfo.xDir * bullet.speed, bulletInfo.yDir * bullet.speed);
    });
}


ClientNet.prototype.playerDisconnected = function(charID) {
        console.log("disconnect");
        //The  getChildren() method will return an array of all the game objects that are in othePlayers group
        this.playGameScene.players.getChildren().forEach(
            function(player) {
                if (charID === player.charID) {
                    //to remove that game object from the game
                    player.destroy();
                }
            }
        );
}

ClientNet.prototype.moveOpponent = function(opponentInfo) {
    let opponent = this.playGameScene.opponent;
    let oppAngle = opponentInfo.spriteAngle;
    opponent.spriteAngle = oppAngle;
    opponent.charContainer.setAngle(oppAngle);
    opponent.charContainer.setPosition(opponentInfo.x, opponentInfo.y );
    opponent.xVelocity = opponentInfo.xVelocity;
    opponent.yVelocity = opponentInfo.yVelocity;
}
},{"../GUI/messageBox.js":1,"../explosives/bullet.js":6}],12:[function(require,module,exports){
module.exports = CollisionHandler;

function CollisionHandler(that){
    this.playGameScene = that;
}

CollisionHandler.prototype.addCollider = function(obj1, obj2, callback) {
    //Note: arrow function => doesn't create its own "this". That's why we can reference 
    //		this.playGameScene inside of it.
    this.playGameScene.physics.add.collider(obj1, obj2, (obj1A, obj2A) =>{
        if(callback){
            callback(this.playGameScene, obj1A, obj2A);
        }
    });
}
CollisionHandler.prototype.addOverlap = function(obj1, obj2, callback) {
    //Note: arrow function => doesn't create its own "this". That's why we can reference 
    //		this.playGameScene inside of it.
    this.playGameScene.physics.add.overlap(obj1, obj2, (obj1A, obj2A) =>{
        if(callback){
            callback(this.playGameScene, obj1A, obj2A);
        }
    });
}

CollisionHandler.prototype.playerBulletCollision = function(that, player, bullet){
    if(player.charID != bullet.owner.charID ){
        bullet.destroy();
        player.destroy();
        if(player.charID != that.player1.charID){
            that.playerWon();
        }
        else {
            that.playerLost();
        }
        // that.players.getChildren().forEach(
        //     function(p) {
        //         console.log("debug");
        //         console.log(player.charID);
        //         console.log(p.charID);
        //         if (player.charID === p.charID) {
        //             that.playerLost();
        //             //to remove that game object from the game
        //         }
        //         else {
        //             that.playerWon();
        //         }
        //     }
        // );
    }
}

CollisionHandler.prototype.bulletMapWallCollision = function(that, bullet, wall){
    bullet.destroy();
}

CollisionHandler.prototype.bulletMapBoundCollision = function(that, bullet, bound){
    bullet.destroy();
}
},{}],13:[function(require,module,exports){
module.exports = MovementHandler;

function MovementHandler(that) {        
    this.playGameScene = that;

    //using this instead of enum (there's no enum in js)
    this.movingDirections = {
        LEFT: 'left',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down',
        NONE: 'none'
    }
    
    // using this instead of enum (there's no enum in js)
    this.lookingDirections = {
        LEFT: 'left',
        RIGHT: 'right',
        NONE: 'none'
    }
}


MovementHandler.prototype.move = function(direction, object) {
    let that = this.playGameScene;

    if(object === this.playGameScene.player1){
        switch(direction){
            case 'left':
                object.movement = this.movingDirections.LEFT;
                object.charContainer.body.setVelocityX((-1)*object.speed);
                object.charContainer.setAngle(180);
                object.spriteAngle = 180;
                break;
            case 'right':
                object.movement = this.movingDirections.RIGHT;
                object.charContainer.body.setVelocityX(object.speed);
                object.charContainer.setAngle(0);
                object.spriteAngle = 0;
            break;
            case 'up':
                object.movement = this.movingDirections.UP;
                object.charContainer.body.setVelocityY((-1)*object.speed);
                object.charContainer.setAngle(270);
                object.spriteAngle = 270;
                break;
            case 'down':
                object.movement = this.movingDirections.DOWN;
                object.charContainer.body.setVelocityY(object.speed);
                object.charContainer.setAngle(90);
                object.spriteAngle = 90;
            break;
            }
    }
}

MovementHandler.prototype.stop = function(direction, object) {
    
    switch(direction){
        case 'left':
            object.charContainer.body.setVelocityX(0);
            break;
        case 'right':
            object.charContainer.body.setVelocityX(0);
            break;
        case 'up':
            object.charContainer.body.setVelocityY(0);
            break;
        case 'down':
            object.charContainer.body.setVelocityY(0);
            break;
        case 'none': //not sure about this!
            object.charContainer.body.setAcceleration(0);
            break;
    }
}
},{}]},{},[8]);
