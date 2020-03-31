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
    
}