module.exports = ActionHandler;

function ActionHandler(that) {
    this.playGameScene = that;
    //to make pressing down and releasing the key as a single shooting event
    this.spaceKeyReleased = true;
}

ActionHandler.prototype.listenForAction = function() {
    let self1 = this;
    let that = this.playGameScene;
    //Handling space key down and up for shooting
    //key down
    that.input.keyboard.on('keydown-SPACE', 
        function (event) {
            if (self1.spaceKeyReleased) {
                let gunZonePosition = { 
                    x: that.player1.getGunZoneAbsX(), 
                    y: that.player1.getGunZoneAbsY()
                };
                that.clientNet.emit('playerShoot', gunZonePosition);	
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

ActionHandler.prototype.onWorldBounds = function(body){
    console.log(body.index);
    body.gameObject.destroy();
    // delete body.playGameScene.bulletList[body.index];
    console.log(body);
}
