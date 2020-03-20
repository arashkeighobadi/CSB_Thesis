export class AnimationHandler {

    constructor(that) {
        this.playGameScene = that;

        this.play = function(key, object){
            object.anims.play(key, true);
        };
    
        this.stop = function(key, object){
            object.anims.play(key, false);
        };
    }

    createAnimations = function() {
        //Creating player animations
        this.playGameScene.anims.create({
            key: 'left',
            frames: this.playGameScene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.playGameScene.anims.create({
            key: 'leftStatic',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });

        this.playGameScene.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });

        this.playGameScene.anims.create({
            key: 'right',
            frames: this.playGameScene.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.playGameScene.anims.create({
            key: 'rightStatic',
            frames: [ { key: 'player', frame: 7 } ],
            frameRate: 20
        });

        //Creating bullet animations  (place holder)
        //...
        //...
    }
};