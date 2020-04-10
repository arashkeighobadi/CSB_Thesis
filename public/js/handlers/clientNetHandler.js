import { MessageBox } from "../GUI/messageBox.js";
import { Bullet } from "../explosives/bullet.js";

export class ClientNet {
    
    constructor(that) {
        this.playGameScene = that;
    }

    // emits a message and an object to the server
    emit(msg, obj){
        this.playGameScene.socket.emit(msg, obj);
    }

    searchForOpponent(callback) {
        let that = this.playGameScene;
        //sending the email of the logged in user in order to have 
        //it mapped to the player stored on the server side.
        this.emit('searching', sessionStorage.getItem('email'));
        that.socket.on('matched', players => {
            
            console.log("found match : " + players);
            callback(players);
        });
    }

    listenToServer = function (){
        let that = this.playGameScene;
        let self = this;
	
		//When the disconnect event is fired, we take that player’s id and we remove that player from the game.
		that.socket.on('disconnect', charID => {
			self.playerDisconnected(charID);
		});
		
		//when playerMoved event is emitted, we will need to update that player’s sprite in the game
		that.socket.on('playerMoved', function (opponentInfo) {
			self.moveOpponent(opponentInfo);
		});

        that.socket.on('shoot', bulletInfo => {
            let bullet = new Bullet(that, bulletInfo.x, bulletInfo.y, 'bullet', bulletInfo.owner);
            bullet.bodySprite.setAngle(bulletInfo.spriteAngle);
	        bullet.setVelocity(bulletInfo.xDir * bullet.speed, bulletInfo.yDir * bullet.speed);
		});
	}


    playerDisconnected(charID) {
            console.log("disconnect");
            //The  getChildren() method will return an array of all the game objects that are in othePlayers group
            this.playGameScene.players.getChildren().forEach(
                function(player) {
                    if (charID === player.charID) {
                        //to remove that game object from the game
                        player.destroy();
                    }
                }
            );
    }

    moveOpponent(opponentInfo) {
        let opponent = this.playGameScene.opponent;
        let oppAngle = opponentInfo.spriteAngle;
        opponent.spriteAngle = oppAngle;
        opponent.charContainer.setAngle(oppAngle);
        opponent.charContainer.setPosition(opponentInfo.x, opponentInfo.y );
        opponent.xVelocity = opponentInfo.xVelocity;
        opponent.yVelocity = opponentInfo.yVelocity;
    }

}