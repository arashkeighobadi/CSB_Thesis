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
				debug: true,
				// gravity: { x: 0, y: 0 }
			}
		},
	
		//we embedded a scene object which will use the  preload, update, and  create functions we defined.
		scene: [preloadGame, playGame]
		// {
		// 	preload: preload,
		// 	create: create,
		// 	update: update
		// }
	};
	//we passed our config object to Phaser when we created the new game instance.
	game = new Phaser.Game(config);
}

class preloadGame extends Phaser.Scene{
	constructor(){
		super("PreloadGame");
	}
	preload(){
		this.load.spritesheet('player1Sprite', 'assets/p1.jpg', { frameWidth: 14, frameHeight: 14 });
		this.load.spritesheet('player2Sprite', 'assets/p2.jpg', { frameWidth: 14, frameHeight: 14 });
		this.load.image('finish', 'assets/game/sprites/star_gold.png');
		// this.load.image('ground', '/assets/platform.png');

		this.load.image("terrain", "assets/game/maps/terrain_atlas512x.png");
		this.load.tilemapTiledJSON("map1", "assets/game/maps/map2-uncompressed-40x30-16px.json");
		// this.load.tilemapCSV("map1", "assets/game/maps/map1-40x30._wall.csv");
	}
	create(){
		this.scene.start("PlayGame");
	}
}

class playGame extends Phaser.Scene{
	constructor(){
		super("PlayGame");
	}
	create() {
		
		// to handle movement of everything which may move
		this.movement = new MovementHandler(this);
	
		//Groups in phaser are a way for us to manage similar game objects and control them as one unit. eg. for collision.
		this.players = this.add.group();
		this.physics.world.enableBody(this.players);

		this.otherPlayers = this.add.group();
		
		//action listener for collision with the world bounds
		// this.physics.world.on('worldbounds', onWorldBounds);
		
		//creating platforms
		// this.platforms = this.physics.add.staticGroup();
		// this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
		// this.platforms.create(50, 200, 'ground').setScale(0.5,1).refreshBody();
		// this.platforms.create(750, 200, 'ground').setScale(0.5,1).refreshBody();
		// this.platforms.create(400, 400, 'ground').refreshBody();
			
		this.listenToServer(this);
		
		// to handle animation of everything
		this.animation = new AnimationHandler(this);
		this.animation.createAnimations();

		//finish target
		this.finishSprite = this.add.sprite(128, 50, 'finish');
		// this.finishSprite = this.add.sprite(672, 550, 'finish'); //debugging purpose
		this.physics.world.enableBody(this.finishSprite);
		//Note: arrow function => doesn't create its own "this". That's why we can reference 
		//		this.finishSprite inside of it.
		this.physics.add.collider(this.players, this.finishSprite,  () => {
			this.finishSprite.destroy();
		});

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
		//map collision
		this.physics.add.collider(this.players, wallLayer);
		this.physics.add.collider(this.players, boundaryLayer);
			//collision by tile property
		boundaryLayer.setCollisionByProperty({collides: true});
	}

	update() {
		if (this.player1) {
			this.handleMoveEvent(this);
			this.emitMovement(this);
		}
	}
	
	/*===============================   Functions used in create()	===============================*/
	listenToServer = function (self){
		self.socket = io();
		//listens for the currentPlayers event
		self.socket.on('currentPlayers', 
			function (players) {
				//to loop through the players, we use Object.keys() to create an array of all the keys in the Object that is passed in
				//we use forEach() method to loop through each item in the array.
				Object.keys(players).forEach(
					function (id) {
						if (players[id].playerId === self.socket.id) {
							//passes it the current player’s information, and a reference to the current scene.
							self.addPlayer(self, players[id]);
						} else {//if players[id] is not the current player.
							self.addOtherPlayers(self, players[id]);
						}
					}
				);
			}
		);
	
		//add the new player to our game when newPlayer event is fired.
		self.socket.on('newPlayer',
			function(playerInfo) {
				self.addOtherPlayers(self, playerInfo);
			}
		);
	
		//When the disconnect event is fired, we take that player’s id and we remove that player from the game.
		self.socket.on('disconnect', 
			function (playerId) {
				//The  getChildren() method will return an array of all the game objects that are in othePlayers group
				self.otherPlayers.getChildren().forEach(
					function(otherPlayer) {
						if (playerId === otherPlayer.playerId) {
							//to remove that game object from the game
							otherPlayer.destroy();
						}
					}
				);
			}
		);
		//using Phaser’s built-in keyboard manager
		/*
		this will populate the cursors object with 
		our four main Key objects (up, down, left, and 
		right), which will bind to those arrows on the keyboard. 
		Then, we just need to see if these keys are being held down 
		in the  update function.
		*/
		self.cursors = self.input.keyboard.createCursorKeys();
		
		//when playerMoved event is emitted, we will need to update that player’s sprite in the game
		self.socket.on('playerMoved', function (playerInfo) {
		  self.otherPlayers.getChildren().forEach(function (otherPlayer) {
			  
			if (playerInfo.playerId === otherPlayer.playerId) {
				//Set the position
				otherPlayer.setPosition(playerInfo.x, playerInfo.y ); //hacky way of synchronizing Y location
				//Setting velocity info for generating animation:
				//NOTE: 
				//At the moment I'm handling otherPlayers animation by sending the velocity info
				//over the network and depending on xVelocity's sign I'm handling the animation in the update
				//function
				//IMPROVEMENT OPPORTUNITY:
				//There seem to be some delay in the animation. Perhaps it's better to handle
				//animation of otherPlayers based on change of location of their sprite in the client side
				//and not to send velocity info over the network
				otherPlayer.xVelocity = playerInfo.xVelocity;
				otherPlayer.yVelocity = playerInfo.yVelocity;
			}
		  });
		});
	
	}
	
	scoreUp(self) {
		self.player1.score++;
		self.player1.scoreText.setText(self.player1.score);
		self.socket.emit("scored", self.player1.username);
	}
	
	/*==============  Sub-Functions  ==============*/
	addPlayer(self, playerInfo) {
		
		self.player1 = new Player(self, playerInfo);
		// self.player1.createAim();
		self.player1.creatScore();
		
		/*
		to modify how the game object reacts to the arcade physics. 
		Both  setDrag and  setAngularDrag are used to control the amount of resistance the object will face when it is moving.  
		setMaxVelocity is used to control the max speed the game object can reach.
		*/
		/*
		soldier.setDrag(100);
		soldier.setAngularDrag(100);
		soldier.setMaxVelocity(200);
		*/
	}
	
	addOtherPlayers = function(self, playerInfo) {
		
		const otherPlayer = new Player(self, playerInfo);
		otherPlayer.playerContainer.body.setAllowGravity(false);
		self.otherPlayers.add(otherPlayer.playerContainer);
	}
	
	/*===============================   Functions used in update()	===============================*/
	handleMoveEvent(self){
	
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
				xVelocity: self.player1.get_xVelocity(), yVelocity: self.player1.get_yVelocity()});
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
 

