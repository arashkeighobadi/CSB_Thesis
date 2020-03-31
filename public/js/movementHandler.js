export class MovementHandler {
    constructor(that){
        
        this.playGameScene = that;

        //using this instead of enum (there's no enum in js)
        this.movingDirections = {
            LEFT: 'left',
            RIGHT: 'right',
            UP: 'up',
            DOWN: 'down',
            NONE: 'none'
        }
        
        // using this instead of enum (there's no enum in js)
        this.lookingDirections = {
            LEFT: 'left',
            RIGHT: 'right',
            NONE: 'none'
        }
    }


    move = function(direction, object) {
        let that = this.playGameScene;

        if(object === this.playGameScene.player1){
            switch(direction){
                case 'left':
                    object.movement = this.movingDirections.LEFT;
                    object.charContainer.body.setVelocityX((-1)*object.speed);
                    object.charContainer.setAngle(180);
                    object.spriteAngle = 180;
                    break;
                case 'right':
                    object.movement = this.movingDirections.RIGHT;
                    object.charContainer.body.setVelocityX(object.speed);
                    object.charContainer.setAngle(0);
                    object.spriteAngle = 0;
                break;
                case 'up':
                    object.movement = this.movingDirections.UP;
                    object.charContainer.body.setVelocityY((-1)*object.speed);
                    object.charContainer.setAngle(270);
                    object.spriteAngle = 270;
                    break;
                case 'down':
                    object.movement = this.movingDirections.DOWN;
                    object.charContainer.body.setVelocityY(object.speed);
                    object.charContainer.setAngle(90);
                    object.spriteAngle = 90;
                break;
                }
        }
    }

    stop = function(direction, object) {
        
        switch(direction){
            case 'left':
                object.charContainer.body.setVelocityX(0);
                break;
            case 'right':
                object.charContainer.body.setVelocityX(0);
                break;
            case 'up':
                object.charContainer.body.setVelocityY(0);
                break;
            case 'down':
                object.charContainer.body.setVelocityY(0);
                break;
            case 'none': //not sure about this!
                object.charContainer.body.setAcceleration(0);
                break;
        }
    }
};