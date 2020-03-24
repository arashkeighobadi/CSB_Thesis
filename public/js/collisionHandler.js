export class CollisionHandler {
    constructor(that){
        this.playGameScene = that;
    }

    addCollider(obj1, obj2, callback) {
        this.playGameScene.physics.add.collider(obj1, obj2, (obj1A, obj2A) =>{
            callback(this.playGameScene, obj1A, obj2A);
        });
    }
    
}