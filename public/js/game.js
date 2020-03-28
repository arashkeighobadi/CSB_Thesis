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

class PreloadGame extends Phaser.Scene{
	constructor(){
		super("PreloadGame");
	}
	preload(){
		this.load.spritesheet('player1Sprite', 'assets/p1.jpg', { frameWidth: 14, frameHeight: 14 });
		this.load.spritesheet('player2Sprite', 'assets/p2.jpg', { frameWidth: 14, frameHeight: 14 });
		this.load.spritesheet('locator', 'assets/game/sprites/soldier/locator.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('locator-1', 'assets/game/sprites/soldier/locator-1.png');
		this.load.image('locator-2', 'assets/game/sprites/soldier/locator-2.png');
		this.load.image('finish', 'assets/game/sprites/star_gold.png');
		this.load.atlas('soldier', 'assets/game/sprites/soldier/soldier-move.png', 'assets/game/sprites/soldier/soldier-move.json');
		// this.load.image('ground', '/assets/platform.png');

		this.load.image("terrain", "assets/game/maps/terrain_atlas512x.png");
		this.load.tilemapTiledJSON("map1", "assets/game/maps/map2-uncompressed-40x30-16px.json");
		// this.load.tilemapCSV("map1", "assets/game/maps/map1-40x30._wall.csv");
	}
	create(){
		this.scene.start("PlayGame");
	}
}

class PlayGame extends Phaser.Scene{
	constructor(){
		super("PlayGame");
		this.clientNet = new ClientNet(this);
		this.socket = null;
		this.player1 = null;
		this.opponent = null;
		this.messageBox = null;
		// to handle movement of everything which may move
		this.movement = new MovementHandler(this);
		// to handle collision of everything
		this.collisionHandler = new CollisionHandler(this);
		// to handle animation of everything
		this.animation = new AnimationHandler(this);
		this.pause = false;


	}
	create() {
		// set background color of the camera
		// this.cameras.main.setBackgroundColor('707070');

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
					//now, if this.pause is true, we set it to false so the handleMoveEvent can work				
					if(this.pause){
						this.pause = false;
					}
				});
			});
		});
	}

	
	update() {
		if (this.player1) {
			this.handleMoveEvent(this);
			this.emitMovement(this);
		}
	}
	
	/*===============================   Functions used in create()	===============================*/
	loadGame = function() {

		// Message box for communicating with the user
		this.messageBox = null;
		
		//Groups in phaser are a way for us to manage similar game objects and control them as one unit. eg. for collision.
		this.players = this.add.group();
		this.physics.world.enableBody(this.players);
		
		this.animation.createAnimations();

		
		
		//finish target
		this.finishSprite = this.add.sprite(128, 50, 'finish');
		// this.finishSprite = this.add.sprite(672, 550, 'finish'); //debugging purpose
		this.physics.world.enableBody(this.finishSprite);

		/* 
			Add collider function takes 2 groups/objects which can collide as its first two arguments
			as the third argument, it takes a callback function which will be fired when they collide.
		 */
		this.collisionHandler.addCollider(this.players, this.finishSprite, this.playerCollidesTarget);

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

		//map collision
		// this.physics.add.collider(this.players, wallLayer);
		this.collisionHandler.addCollider(this.players, wallLayer);
		// this.physics.add.collider(this.players, boundaryLayer);
		this.collisionHandler.addCollider(this.players, boundaryLayer);

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
	loadPlayers(players){
		let that = this;
		//to loop through the players, we use Object.keys() to create an array of all the keys in the Object that is passed in
		//we use forEach() method to loop through each item in the array.
		Object.keys(players).forEach(
			function (id) {
				console.log("adding players");
				if (players[id].playerId === that.socket.id) {
					//passes it the current player’s information, and a reference to the current scene.
					that.player1 = new Player(that, players[id]);
				} else {//if players[id] is not the current player.			
					that.opponent = new Player(that, players[id]);
					that.opponent.playerContainer.body.setAllowGravity(false);
				}
			}
		);				
	}

	playerCollidesTarget(self, playerContainer, finishSprite) {
		// console.log("type of : " + typeof(this.players));
			let id = playerContainer.playerId;
			if (self.player1.playerContainer.playerId == id){
				self.player1.scoreUp();
				console.log("You won!");
				self.messageBox = new MessageBox(self, "You Won!");
				self.messageBox.addButton("PLAY AGAIN", () => {
					self.pause = true;
					self.messageBox.hideBox();
					self.scene.restart();
					console.log("clicked");
				});
			} else {
				// console.log(self.playersList[id].username + " won!");
				let txt = self.opponent.name + " won!";
				self.messageBox = new MessageBox(self, txt);
				self.messageBox.addButton("PLAY AGAIN", () => {
					self.pause = true;
					self.messageBox.hideBox();
					self.scene.restart();
					console.log("clicked");
				});
			}
			self.finishSprite.destroy();		
	}

	/*===============================   Functions used in update()	===============================*/
	handleMoveEvent(self){
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
	
	emitMovement(self){

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
	
}

import { MovementHandler } from "./movementHandler.js";
import { Player } from "./player.js";
import { AnimationHandler } from "./animationHandler.js";
import { MessageBox } from "./messageBox.js";
import { ClientNet } from "./clientNet.js";
import { CollisionHandler } from "./collisionHandler.js";


