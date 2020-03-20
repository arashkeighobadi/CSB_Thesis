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

        if(object === this.playGameScene.player1){
            switch(direction){
                case 'left':
                    object.movement = this.movingDirections.LEFT;
                    object.playerContainer.body.setVelocityX((-1)*object.speed);
                    break;
                case 'right':
                    object.movement = this.movingDirections.RIGHT;
                    object.playerContainer.body.setVelocityX(object.speed);
                    break;
                case 'up':
                    object.movement = this.movingDirections.UP;
                    object.playerContainer.body.setVelocityY((-1)*object.speed);
                    break;
                case 'down':
                    object.movement = this.movingDirections.DOWN;
                    object.playerContainer.body.setVelocityY(object.speed);
                    break;
                }
        }
    }

    stop = function(direction, object) {
        
        switch(direction){
            case 'left':
                object.playerContainer.body.setVelocityX(0);
                break;
            case 'right':
                object.playerContainer.body.setVelocityX(0);
                break;
            case 'up':
                object.playerContainer.body.setVelocityY(0);
                break;
            case 'down':
                object.playerContainer.body.setVelocityY(0);
                break;
            case 'none': //not sure about this!
                object.playerContainer.body.setAcceleration(0);
                break;
        }
    }
};