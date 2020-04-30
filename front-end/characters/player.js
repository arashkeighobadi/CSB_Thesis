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

    //gun zone
    this.gunZone = that.add.zone(5, 5, 5, 5);
    that.physics.world.enable(this.gunZone);
    
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
    this.charContainer.add([this.gunZone]);


    that.players.add(this.charContainer);

}
    
//Actual inheritance logic
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

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

Player.prototype.getGunZoneAbsX = function() {
    //note: when you use body.x you get the x value reletive to the world otherwise, 
    //      gunZone.x gives relative to the container
    return (this.gunZone.body.x + this.gunZone.width/2);
}

Player.prototype.getGunZoneAbsY = function() {
    //note: when you use body.y you get the x value reletive to the world otherwise, 
    //      gunZone.y gives relative to the container
    return (this.gunZone.body.y + this.gunZone.height/2);
}