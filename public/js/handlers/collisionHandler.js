export class CollisionHandler {
    constructor(that){
        this.playGameScene = that;
    }

    addCollider(obj1, obj2, callback) {
        //Note: arrow function => doesn't create its own "this". That's why we can reference 
		//		this.playGameScene inside of it.
        this.playGameScene.physics.add.collider(obj1, obj2, (obj1A, obj2A) =>{
            if(callback){
                callback(this.playGameScene, obj1A, obj2A);
            }
        });
    }
    addOverlap(obj1, obj2, callback) {
        //Note: arrow function => doesn't create its own "this". That's why we can reference 
		//		this.playGameScene inside of it.
        this.playGameScene.physics.add.overlap(obj1, obj2, (obj1A, obj2A) =>{
            if(callback){
                callback(this.playGameScene, obj1A, obj2A);
            }
        });
    }

    playerBulletCollision(that, player, bullet){
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

    bulletMapWallCollision(that, bullet, wall){
        bullet.destroy();
    }
    
    bulletMapBoundCollision(that, bullet, bound){
        bullet.destroy();
    }
    
}