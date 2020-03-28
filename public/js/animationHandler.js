export class AnimationHandler {

    constructor(that) {
        this.playGameScene = that;

    }
    
    play = function(key, object){
        object.anims.play(key, true);
    }

    stop = function(key, object){
        object.anims.play(key, false);
    }

    createAnimations = function() {
        //Creating player animations
        this.playGameScene.anims.create({
            key: 'soldier-move',
            frames: this.playGameScene.anims.generateFrameNames('soldier', { prefix: 'survivor-move_handgun_', suffix: '.png', 
            end: 19, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });
        
        // this.playGameScene.anims.create({
        //     key: 'leftStatic',
        //     frames: [ { key: 'player', frame: 0 } ],
        //     frameRate: 20
        // });

        // this.playGameScene.anims.create({
        //     key: 'turn',
        //     frames: [ { key: 'player', frame: 4 } ],
        //     frameRate: 20
        // });

        // this.playGameScene.anims.create({
        //     key: 'right',
        //     frames: this.playGameScene.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        this.playGameScene.anims.create({
            key: 'locator',
            frames: this.playGameScene.anims.generateFrameNumbers('locator', { start: 0, end: 9 }),
            frameRate: 6,
            repeat: -1
        });
        
        // this.playGameScene.anims.create({
        //     key: 'rightStatic',
        //     frames: [ { key: 'player', frame: 7 } ],
        //     frameRate: 20
        // });

        //Creating bullet animations  (place holder)
        //...
        //...
    }
};