import { MessageBox } from "./messageBox.js";

export class ClientNet {
    
    constructor(that) {
        this.playGameScene = that;
    }

    searchForOpponent(callback) {
        let that = this.playGameScene;
        //sending the email of the logged in user in order to have 
        //it mapped to the player stored on the server side.
        that.socket.emit('searching', sessionStorage.getItem('email'));
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