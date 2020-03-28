export class Player {

    constructor(that, playerInfo) {
        this.playGameScene = that;
        this.username = playerInfo.playerEmail;
        this.name = playerInfo.name;
        this.speed = 50;
        // angle is determined in searchForMatch method in the Net class
        this.spriteAngle = playerInfo.spriteAngle;
        
        this.movement = that.movement.movingDirections.NONE;
        this.lookingDirection = that.movement.lookingDirections.NONE;
        this.bodySprite;
        this.playerContainer;
        
        //Score
        this.score = playerInfo.score;
        if (this.playGameScene.socket.id == playerInfo.playerId){
            this.scoreText = this.playGameScene.add.text(584, 16, '', { fontSize: '32px', fill: '#FFFFFF' });
            this.scoreText.setText('wins: ' + this.score);
        }

        //locator
        this.locator = that.add.sprite(0, 0, 'locator').setAlpha(0.5);
        this.locatorBoundary = null;
        
        //to change the color of the bodySprite game object, depending on the team that was generated when we created our player info on the server.
        if (playerInfo.team === 'team1') {
            this.bodySprite = that.add.sprite(0, 0/* container/2 - bodySprite/2 */, 'soldier').setScale(0.4);//.setOrigin(0.5); //0.5 means middle of the sprite
            this.locatorBoundary = that.add.sprite(0, 0, 'locator-1');
            // this.locator.setTint('ffef00');
        } 
        else if (playerInfo.team === 'team2') {
            this.bodySprite = that.add.sprite(0, 0/* container/2 - bodySprite/2 */, 'player2Sprite').setScale(0.4);//.setOrigin(0.5); //0.5 means middle of the sprite
            this.locatorBoundary = that.add.sprite(0, 0, 'locator-2');
            // this.locator.setTint('ffff66');            
        }
        else {
            console.log("wrong group name! for player ID " + playerInfo.playerId);
        }
        // console.log("bodySprite sprite dimension: " + this.bodySprite.width + " " + this.bodySprite.height);
        
        //Animation
        that.animation.play('soldier-move', this.bodySprite);
        that.animation.play('locator', this.locator);
        
        //Created our player’s bodySprite by using the x and y coordinates that we generated in our server code.
        //Instead of just using  self.add.image to create our player’s boySprite, we used  
        //self.physics.add.image in order to allow that game object to use the arcade physics.
        this.playerContainer = that.add.container(playerInfo.x, playerInfo.y).setSize(13, 13);
        
        // this.bodySprite.enableBody=true;	
        this.playerContainer.playerId = playerInfo.playerId;
        
        //collisions
        that.physics.world.enable(this.playerContainer);
        this.playerContainer.body.setCollideWorldBounds(true);
        // that.physics.add.collider(this.playerContainer, that.platforms);

        this.playerContainer.add([this.locator]);
        this.playerContainer.add([this.locatorBoundary]);
        this.playerContainer.add([this.bodySprite]);

        that.players.add(this.playerContainer);
    }

    scoreUp() {
        this.playGameScene.socket.emit('scored', this.playerContainer.playerId);
        this.playGameScene.socket.on('scored', score => {
            //increase score
            console.log("I fucking scoreddddd!!!!");
            this.score = score;
            this.scoreText.setText('wins: ' + score);
        });
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