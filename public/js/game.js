//We created the configuration that will be used for our Phaser game.
var config = {
  
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

	//we specify the width and height of the viewable area of our game.
	width: 800,
	height: 600,


	//we enabled the arcade physics that is available in Phaser, and we set the gravity to 0.
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 300 }
		}
	},
  
	//we embedded a scene object which will use the  preload, update, and  create functions we defined.
	scene: {
		preload: preload,
		create: create,
		update: update
  	}
};
 
//we passed our config object to Phaser when we created the new game instance.
var game = new Phaser.Game(config);
 
function preload() {
	this.load.spritesheet('soldier', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
	this.load.image('bullet', 'assets/bomb.png', { frameWidth: 30, frameHeight: 30 });
	this.load.image('aim', 'assets/aim.png', { frameWidth: 30, frameHeight: 30 });
	this.load.image('ground', '/assets/platform.png');

	//to make pressing down and releasing the key as a single shooting event
	var spaceKeyReleased = true;
}
 
function create() {
	
	// to handle movement of everything which may move
	this.movement = new MovementHandler(this);

	
	//otherPlayers group will be used to manage all of the other players in our game.
	//Groups in phaser are a way for us to manage similar game objects and control them as one unit. eg. for collision.
	this.otherPlayers = this.add.group();
	this.physics.world.enableBody(this.otherPlayers);
	
	//all the bullets belong to this group
	this.bullets = this.add.group();
	this.physics.world.enableBody(this.bullets);

	//this.bullets.body.collideWorldBounds = true;
	//action listener for collision with the world bounds
	this.physics.world.on('worldbounds', onWorldBounds);
	
	//creating platforms
	this.platforms = this.physics.add.staticGroup();
	this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
	this.platforms.create(50, 200, 'ground').setScale(0.5,1).refreshBody();
	this.platforms.create(750, 200, 'ground').setScale(0.5,1).refreshBody();
	this.platforms.create(400, 400, 'ground').refreshBody();
	this.physics.add.collider(this.platforms, this.bullets, function(bullet, platform){
		bullet.destroy();
	});
	// this.movingPlatform = this.physics.add.image(400, 400, 'ground');
    // this.movingPlatform.setImmovable(true);
    // this.movingPlatform.body.allowGravity = false;
	// this.movingPlatform.setVelocityX(50);
	// this.physics.add.collider(this.movingPlatform, this.bullets, function(platform, bullet){
	// 		bullet.destroy();
	// });
	

	var self = this;
	
	listenToServer(self);
	
	// to handle animation of everything
	this.animation = new AnimationHandler(this);
	this.animation.createAnimations();

	handleShootEvent(self);

	this.physics.add.collider(this.otherPlayers, this.bullets, function(otherSoldier,bullet){
		if(bullet.bulletId != otherSoldier.playerId){
			self.socket.emit('playerGotShot', otherSoldier.playerId);
			if(bullet.bulletId == self.player1.soldierContainer.playerId){
				scoreUp(self);
			}
			bullet.destroy();
		}
	});
	
}
 
function update() {
	var self = this;
	if (self.player1 && self.player1.aim) {
		handleMoveEvent(self);

		emitMovement(self);

	}

	handleOtherPlayersAnim(self);
	
}



/*===============================   Functions used in create()	===============================*/
function listenToServer(self){
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
						addPlayer(self, players[id]);
					} else {//if players[id] is not the current player.
						addOtherPlayers(self, players[id]);
					}
				}
			);
		}
	);

	//add the new player to our game when newPlayer event is fired.
	self.socket.on('newPlayer',
		function(playerInfo) {
			addOtherPlayers(self, playerInfo);
		}
	);
	//When the disconnect event is fired, we take that player’s id and we remove that player’s soldier from the game.
	self.socket.on('disconnect', 
		function (playerId) {
			//The  getChildren() method will return an array of all the game objects that are in othePlayers group
			self.otherPlayers.getChildren().forEach(
				function(otherSoldier) {
					if (playerId === otherSoldier.playerId) {
						//to remove that game object from the game
						otherSoldier.destroy();
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
	  self.otherPlayers.getChildren().forEach(function (otherSoldier) {
		  
		if (playerInfo.playerId === otherSoldier.playerId) {
			//Set the position
			otherSoldier.setPosition(playerInfo.x, playerInfo.y +8); //hacky way of synchronizing Y location
			//Setting velocity info for generating animation:
			//NOTE: 
			//At the moment I'm handling otherPlayers animation by sending the velocity info
			//over the network and depending on xVelocity's sign I'm handling the animation in the update
			//function
			//IMPROVEMENT OPPORTUNITY:
			//There seem to be some delay in the animation. Perhaps it's better to handle
			//animation of otherPlayers based on change of location of their sprite in the client side
			//and not to send velocity info over the network
			otherSoldier.xVelocity = playerInfo.xVelocity;
			otherSoldier.yVelocity = playerInfo.yVelocity;
		}
	  });
	});

	//when we recieve a shooting msg from the server (can be this player's bullet or someone else's)
	self.socket.on('shoot',
		function (bulletInfo) {
			addOtherPlayersBullet(self, bulletInfo);
		}
	);

	self.socket.on('playerGotShotImpact',
		function (playerInfo){
		// console.log("HERE2:" + playerInfo);
			if (playerInfo == self.player1.soldierContainer.playerId){
				//self.soldier.destroy();
				self.physics.pause();
				self.player1.scoreText.setText('Game Over');
			}else{
				self.otherPlayers.getChildren().forEach(function (otherSoldier) {

					if (playerInfo == otherSoldier.playerId) {
						// console.log("HERE3:" + playerInfo );
						otherSoldier.destroy();
						//bullet.destroy();
					}
				});
			}
		}
	);

}

function scoreUp(self) {
	self.player1.score++;
	self.player1.scoreText.setText(self.player1.score);
	self.socket.emit("scored", self.player1.username);
}

/*==============  Sub-Functions  ==============*/
function addPlayer(self, playerInfo) {
	
	self.player1 = new Player(self, playerInfo);
	self.player1.createAim();
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

	//collision with world boundaries
	// self.soldier.body.collideWorldBounds = true;
	//soldier.setCollideWorldBounds(true);
}

function addOtherPlayers(self, playerInfo) {
	
	const otherPlayer = new Player(self, playerInfo);
	otherPlayer.soldierContainer.body.setAllowGravity(false)
	self.otherPlayers.add(otherPlayer.soldierContainer);
}

function addOtherPlayersBullet(self, bulletInfo) {
	
	// const bullet = self.bullets.create(bulletInfo.x, bulletInfo.y, 'bullet').setScale(2);
	const bullet = self.add.sprite(bulletInfo.x, bulletInfo.y, 'bullet').setScale(2);

	//you must enable body before setting the velocity and gravity!
	self.physics.world.enableBody(bullet);
	bullet.body.setCollideWorldBounds(true);
	//for triggering onWorldBounds function (when bullet collides with the world bounds)
	bullet.body.onWorldBounds = true;
	bullet.body.setVelocity(bulletInfo.xVelocity, bulletInfo.yVelocity);
	bullet.body.setAllowGravity(false);
	bullet.bulletId = bulletInfo.bulletId;
	self.bullets.add(bullet);
}

function handleShootEvent(self){
	self.input.keyboard.on('keydown-D', function (event) {
		Phaser.Actions.RotateAround([self.player1.aim], {x: 0, y: 0}, 0.2);
	}, self);

	self.input.keyboard.on('keydown-A', function (event) {
		Phaser.Actions.RotateAround([self.player1.aim], {x: 0, y: 0}, -0.2);
	}, self);

	//Handling space key down and up for shooting
	//key down
	self.input.keyboard.on('keydown-SPACE', function (event) {
		if (self.spaceKeyReleased) {
			self.socket.emit('playerShoot', {bulletId: self.player1.soldierContainer.playerId, 
				x: self.player1.soldierContainer.x, y: self.player1.soldierContainer.y, 
				xVelocity: 20 * self.player1.aim.x, yVelocity: 20 * self.player1.aim.y});	
				self.spaceKeyReleased = false;		
		}
	}, self);
	//key up
	self.input.keyboard.on('keyup-SPACE', function (event) {
		self.spaceKeyReleased = true;
	}, self);
}

//what to do when bullets collide the world bounds...
function onWorldBounds (bullet)
{
	console.log("triggered!");
    bullet.gameObject.destroy();
}

/*===============================   Functions used in update()	===============================*/
function handleMoveEvent(self){
	//The angular velocity will allow the soldier to rotate left and right.
	if (self.cursors.left.isDown) {
		self.movement.move('left', self.player1);
	} else if (self.cursors.right.isDown) {
		self.movement.move('right', self.player1);
	} 
	
	//when left or right is released the animation stops
	if (self.cursors.left.isUp && self.player1.movement === self.movement.movingDirections.LEFT) {
		self.movement.stop('left', self.player1);
	}
	else if (self.cursors.right.isUp && self.player1.movement === self.movement.movingDirections.RIGHT) {
		self.movement.stop('right', self.player1);
	}
	//commented out because: we want to aim with keyboard (w-s) and the direction they're looking at.
	/* 
	else {
		//If neither the left or right keys are pressed, then we reset the angular velocity back to 0.
		self.soldier.setAngularVelocity(0);
		self.soldier.anims.play('turn');
	}
	*/
	
	//If the up key is pressed, then we update the soldier’s velocity, otherwise, we set it to 0.
	if (self.cursors.up.isDown) {
		self.movement.move('up', self.player1);
	} else if (self.cursors.down.isDown) {
		self.movement.move('down', self.player1);
	} else {
		self.movement.stop('none', self.player1);
	}
	//if the soldier goes off screen we want it to appear on the other side of the screen.
	//we pass it the game object we want to wrap and an offset.
	//self.physics.world.wrap;	
}

function emitMovement(self){
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

function handleOtherPlayersAnim(self){
	self.otherPlayers.getChildren().forEach(function (otherSoldier) {
		if (otherSoldier.xVelocity < 0) {
			otherSoldier.lookingDirection = self.movement.lookingDirections.LEFT;
			self.animation.play('left', otherSoldier.getAt(0));
		}
		else if (otherSoldier.xVelocity > 0) {
			otherSoldier.lookingDirection = self.movement.lookingDirections.RIGHT;
			self.animation.play('right', otherSoldier.getAt(0));
		}
		
		if (otherSoldier.lookingDirection === self.movement.lookingDirections.LEFT 
			&& otherSoldier.xVelocity == 0) {
			self.animation.stop('left', otherSoldier.getAt(0));
		}
		else if (otherSoldier.lookingDirection === self.movement.lookingDirections.RIGHT
			&& otherSoldier.xVelocity == 0) {
			self.animation.stop('right', otherSoldier.getAt(0));
		}
		// else {
		// 	otherPlayer.anims.play('turn', true);
		// }
	});
}