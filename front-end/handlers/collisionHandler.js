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

CollisionHandler.prototype.playerBulletCollision = function(that, playerCharContainer, bulletBodySprite){
    
    let player = playerCharContainer.player;
    let bullet = bulletBodySprite.bullet;
    // if the player of this client got shot it will be true else, false
    let ownPlayerGotShot = true;
    if(player.charID != that.player1.charID){
        ownPlayerGotShot = false;
    }

    if(player.charID != bullet.owner.charID ){
        bulletBodySprite.destroy();
        if(!that.soundMuted){
            that.sound.play('player_got_shot');
        }

        player.decreaseHealth(bullet.damage);

        if(ownPlayerGotShot){
            that.player1HealthBar.removePoints(bullet.damage);
        }
        else {
            that.opponentHealthBar.removePoints(bullet.damage);
        }

        if(player.health <= 0){
            // if(that.music.audio){
            //     that.music.stop();
            // }
            console.log("player's health <= 0: " + player.health);
            playerCharContainer.destroy();
            if(ownPlayerGotShot){
                that.playerLost();
            }
            else {
                that.playerWon();
            }
        }
    }
}

CollisionHandler.prototype.bulletMapWallCollision = function(that, bullet, wall){
    bullet.destroy();
}

CollisionHandler.prototype.bulletMapBoundCollision = function(that, bullet, bound){
    bullet.destroy();
}