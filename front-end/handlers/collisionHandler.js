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