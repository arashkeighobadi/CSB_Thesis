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
		// this.playersList = {};
		this.opponent = null;
	}
	create() {
		this.socket = io().on('connect', () => {
			this.messageBox = new MessageBox(this, "Ready?");
			this.messageBox.addButton("YES", () => {
				this.messageBox.text1.setText("Searching...");
				//sending the email of the logged in user in order to have 
				//it mapped to the player stored on the server side.
				this.socket.emit('searching', sessionStorage.getItem('email'));
				this.socket.on('matched', players => {
					console.log("found match" );					
					this.loadGame(players)
				});

				// this.messageBox.hideBox();
				console.log("clicked");
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
	loadGame = function(players) {
		this.messageBox.hideBox();

		
		// to handle movement of everything which may move
		this.movement = new MovementHandler(this);
		
		//Groups in phaser are a way for us to manage similar game objects and control them as one unit. eg. for collision.
		this.players = this.add.group();
		this.physics.world.enableBody(this.players);
		
		
		// to handle animation of everything
		this.animation = new AnimationHandler(this);
		this.animation.createAnimations();
		
		//finish target
		// this.finishSprite = this.add.sprite(128, 50, 'finish');
		this.finishSprite = this.add.sprite(672, 550, 'finish'); //debugging purpose
		this.physics.world.enableBody(this.finishSprite);

		//Note: arrow function => doesn't create its own "this". That's why we can reference 
		//		this.finishSprite inside of it.
		this.physics.add.collider(this.players, this.finishSprite,  (playerContainer, finishSprite) => {
			// console.log(player);
			let id = playerContainer.playerId;
			if (this.player1.playerContainer.playerId == id){
				this.player1.scoreUp();
				console.log("You won!");
				this.messageBox = new MessageBox(this, "You Won!");
				this.messageBox.addButton("OK", () => {
					this.messageBox.hideBox();
					console.log("clicked");
				});
			} else {
				// console.log(this.playersList[id].username + " won!");
				let txt = this.opponent.name + " won!";
				this.messageBox = new MessageBox(this, txt);
				this.messageBox.addButton("OK", () => {
					this.messageBox.hideBox();
					console.log("clicked");
				});
			}
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

		// Message box for communicating with the user
		this.messageBox = null;

		this.listenToServer(players);

	}

	listenToServer = function (players){

		let self = this;
		//to loop through the players, we use Object.keys() to create an array of all the keys in the Object that is passed in
		//we use forEach() method to loop through each item in the array.
		console.log("listen to server " + players);
		Object.keys(players).forEach(
			function (id) {
				console.log("adding players");
				if (players[id].playerId === self.socket.id) {
					console.log("adding self");
					//passes it the current player’s information, and a reference to the current scene.
					self.player1 = new Player(self, players[id]);
				} else {//if players[id] is not the current player.
					console.log("adding other");
					self.addOtherPlayers(self, players[id]);
				}
			}
		);
	
		//When the disconnect event is fired, we take that player’s id and we remove that player from the game.
		self.socket.on('disconnect', 
			function (playerId) {
				console.log("disconnect");
				//The  getChildren() method will return an array of all the game objects that are in othePlayers group
				self.players.getChildren().forEach(
					function(player) {
						if (playerId === player.playerId) {
							//to remove that game object from the game
							player.destroy();
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
			let player = self.opponent;
			player.playerContainer.setPosition(playerInfo.x, playerInfo.y ); //hacky way of synchronizing Y location
			player.xVelocity = playerInfo.xVelocity;
			player.yVelocity = playerInfo.yVelocity;
			
		//   self.players.getChildren().forEach(function (player) {
			  
		// 	if (playerInfo.playerId === player.playerId && playerInfo.playerId != self.player1.playerId) {
		// 		//Set the position
		// 		player.setPosition(playerInfo.x, playerInfo.y ); //hacky way of synchronizing Y location
		// 		//Setting velocity info for generating animation:
		// 		//NOTE: 
		// 		//At the moment I'm handling otherPlayers animation by sending the velocity info
		// 		//over the network and depending on xVelocity's sign I'm handling the animation in the update
		// 		//function
		// 		//IMPROVEMENT OPPORTUNITY:
		// 		//There seem to be some delay in the animation. Perhaps it's better to handle
		// 		//animation of otherPlayers based on change of location of their sprite in the client side
		// 		//and not to send velocity info over the network
		// 		player.xVelocity = playerInfo.xVelocity;
		// 		player.yVelocity = playerInfo.yVelocity;
		// 	}
		//   });
		});
	
	}
	
	/*==============  Sub-Functions  ==============*/			
	addOtherPlayers = function(self, playerInfo) {
		
		const otherPlayer = new Player(self, playerInfo);
		otherPlayer.playerContainer.body.setAllowGravity(false);
		self.opponent = otherPlayer;
		// self.otherPlayers.add(otherPlayer.playerContainer);
		// self.players.add(otherPlayer.playerContainer);
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
import { MessageBox } from "./messageBox.js";


