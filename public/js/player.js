var Player = function(that, playerInfo) {

    this.username = null;
    this.speed = 100;

    this.movement = that.movement.movingDirections.NONE;
    this.lookingDirection = that.movement.lookingDirections.NONE;

    this.soldier = that.add.sprite(0, 0/* container/2 - soldier/2 */, 'soldier');//.setOrigin(0.5); //0.5 means middle of the sprite
    // console.log("soldier sprite dimension: " + this.soldier.width + " " + this.soldier.height);
    
    //Created our player’s soldier by using the x and y coordinates that we generated in our server code.
	//Instead of just using  self.add.image to create our player’s soldier, we used  
	//self.physics.add.image in order to allow that game object to use the arcade physics.
	this.soldierContainer = that.add.container(playerInfo.x, playerInfo.y).setSize(this.soldier.width, this.soldier.height);
	// self.setOrigin([self.soldierContainer],0,0);

	// this.soldier.enableBody=true;	
	this.soldierContainer.playerId = playerInfo.playerId;
	// console.log(self.soldierContainer.width);
    
    //collisions
	that.physics.world.enable(this.soldierContainer);
    this.soldierContainer.body.setCollideWorldBounds(true);
    that.physics.add.collider(this.soldierContainer, that.platforms);
    // that.physics.add.collider(this.soldierContainer, that.movingPlatform);

    this.soldierContainer.add([this.soldier]);

	//to change the color of the soldier game object, depending on the team that was generated when we created our player info on the server.
	if (playerInfo.team === 'blue') {
		// self.soldier.setTint(0x0000ff);
	} else {
		this.soldier.setTint(0x00ff00);
    }
    
    this.createAim = function () {
        //aim pointer
        this.aim = that.add.image(50, 0, 'aim');
        /*
        var aim = self.add.graphics(0,0);
        aim.fillStyle(0x0000ff, 1);
        
        aim = aim.fillTriangle(25, 5, 25, - 5, 35, 0);
        */
        this.soldierContainer.add([this.aim]);
    }

    this.creatScore = function() {
        this.score = 0;
        this.scoreText = that.add.text(584, 16, '', { fontSize: '32px', fill: '#FFFFFF' });
        this.scoreText.setText(this.score);
    }

    // this.getMovement = function() {
    //     return this.movement;
    // }

    this.get_xVelocity = function() {
        return this.soldierContainer.body.velocity.x;
    }

    this.get_yVelocity = function() {
        return this.soldierContainer.body.velocity.y;
    }

    this.getX = function() {
        return this.soldierContainer.x;
    }
    this.getY = function() {
        return this.soldierContainer.y;
    }


};