var MovementHandler = function(that) {

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

    this.move = function(direction, object) {

        if(object === that.player1){
            switch(direction){
                case 'left':
                    object.movement = this.movingDirections.LEFT;
                    object.soldierContainer.body.setVelocityX((-1)*object.speed);
                    that.animation.play(direction, object.soldier);
                    break;
                case 'right':
                    object.movement = this.movingDirections.RIGHT;
                    object.soldierContainer.body.setVelocityX(object.speed);
                    that.animation.play(direction, object.soldier);
                    break;
                case 'up':
                    object.soldierContainer.body.setVelocityY((-1)*object.speed);
                    break;
                case 'down':
                    object.soldierContainer.body.setVelocityY(object.speed);
                    break;
                }
        }
    }

    this.stop = function(direction, object) {
        
        switch(direction){
            case 'left':
                that.animation.stop(direction, object.soldier);
                object.soldierContainer.body.setVelocityX(0);
                that.animation.play('leftStatic', object.soldier);
                break;
            case 'right':
                that.animation.stop(direction, object.soldier);
                object.soldierContainer.body.setVelocityX(0);
                that.animation.play('rightStatic', object.soldier);
                break;
            case 'none': //not sure about this!
                object.soldierContainer.body.setAcceleration(0);
                break;
            }
    }

    


};