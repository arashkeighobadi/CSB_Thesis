export class Player {

    constructor(that, playerInfo) {
        this.playGameScene = that;
    
        this.username = null;
        this.speed = 100;
    
        this.movement = that.movement.movingDirections.NONE;
        this.lookingDirection = that.movement.lookingDirections.NONE;
        this.bodySprite;
        this.playerContainer;
        
        //to change the color of the bodySprite game object, depending on the team that was generated when we created our player info on the server.
        if (playerInfo.team === 'team1') {
            this.bodySprite = that.add.sprite(0, 0/* container/2 - bodySprite/2 */, 'player1Sprite');//.setOrigin(0.5); //0.5 means middle of the sprite
            // this.bodySprite.setTint(0x0000ff);
        } 
        else if (playerInfo.team === 'team2') {
            this.bodySprite = that.add.sprite(0, 0/* container/2 - bodySprite/2 */, 'player2Sprite');//.setOrigin(0.5); //0.5 means middle of the sprite
            this.bodySprite.setTint(0x00ff00);
        }
        else {
            console.log("wrong group name! for player ID " + playerInfo.playerId);
        }
        // console.log("bodySprite sprite dimension: " + this.bodySprite.width + " " + this.bodySprite.height);
        
        //Created our player’s bodySprite by using the x and y coordinates that we generated in our server code.
        //Instead of just using  self.add.image to create our player’s boySprite, we used  
        //self.physics.add.image in order to allow that game object to use the arcade physics.
        this.playerContainer = that.add.container(playerInfo.x, playerInfo.y).setSize(this.bodySprite.width, this.bodySprite.height);
        
        // this.bodySprite.enableBody=true;	
        this.playerContainer.playerId = playerInfo.playerId;
        
        //collisions
        that.physics.world.enable(this.playerContainer);
        // this.playerContainer.body.setCollideWorldBounds(true);
        // that.physics.add.collider(this.playerContainer, that.platforms);

        this.playerContainer.add([this.bodySprite]);

        that.players.add(this.playerContainer);
    }

    creatScore = function() {
        this.score = 0;
        this.scoreText = this.playGameScene.add.text(584, 16, '', { fontSize: '32px', fill: '#FFFFFF' });
        this.scoreText.setText(this.score);
    }

    get_xVelocity = function() {
        return this.playerContainer.body.velocity.x;
    }

    get_yVelocity = function() {
        return this.playerContainer.body.velocity.y;
    }

    getX = function() {
        return this.playerContainer.x;
    }

    getY = function() {
        return this.playerContainer.y;
    }
};