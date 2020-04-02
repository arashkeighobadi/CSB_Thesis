export class ActionHandler {
    constructor(that) {
        this.playGameScene = that;
	    //to make pressing down and releasing the key as a single shooting event
        this.spaceKeyReleased = true;
    }

    listenForAction() {
        let self1 = this;
        let that = this.playGameScene;
        //Handling space key down and up for shooting
        //key down
        that.input.keyboard.on('keydown-SPACE', 
            function (event) {
                if (self1.spaceKeyReleased) {
                    that.clientNet.emit('playerShoot');	
                }
            }
            );
        //key up
        that.input.keyboard.on('keyup-SPACE', 
            function (event) {
                self1.spaceKeyReleased = true;
            }
        );
    }

    onWorldBounds(body){
        console.log(body.index);
        body.gameObject.destroy();
        // delete body.playGameScene.bulletList[body.index];
        console.log(body);
    }
}