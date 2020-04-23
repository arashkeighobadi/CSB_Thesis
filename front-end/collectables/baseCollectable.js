module.exports = BaseCollectable;

const Collectable = require('./collectable.js');
const MessageBox = require('../GUI/messageBox.js');

//stands for base collectable. i.e. the collectable in the opponent's base
function BaseCollectable(that, x, y, name){ // Extends Collectibe
    Collectable.call(this, that, x, y, name);
}

//Actual inheritance logic
BaseCollectable.prototype = Object.create(Collectable.prototype);
BaseCollectable.prototype.constructor = BaseCollectable;

BaseCollectable.prototype.playerCollision = function(that, charContainer, bodySprite){
// console.log("type of : " + typeof(this.players));
    let id = charContainer.charID;
    let ownTeam = that.player1.team;
    let oppTeam = that.opponent.team;
    // console.log("ownTeam : " + ownTeam);
    // console.log("charContainer.team : " + charContainer.team);
    // console.log(charContainer.team === ownTeam);
    // console.log("bodySprite.ownerTeam : " + bodySprite.ownerTeam);
    // console.log("ownTeam : " + ownTeam);
    // console.log(bodySprite.ownerTeam != ownTeam);
    if (charContainer.team === ownTeam && bodySprite.ownerTeam != ownTeam){
        that.player1.scoreUp();
        console.log("You won!");
        that.baseACollectable.bodySprite.destroy();
        delete that.baseACollectable;
        that.baseBCollectable.bodySprite.destroy();
        delete that.baseBCollectable;
        that.messageBox = new MessageBox(that, "You Won!");
        that.messageBox.addButton("PLAY AGAIN", () => {
            that.pause = true;
            that.messageBox.hideBox();
            that.scene.restart();
            console.log("clicked");
        });
    } else if (charContainer.team === oppTeam && bodySprite.ownerTeam != oppTeam){
        // console.log(that.playersList[id].username + " won!");
        let txt = that.opponent.name + " won!";
        //bodySprite.destroy();
        that.baseACollectable.bodySprite.destroy();
        that.baseBCollectable.bodySprite.destroy();
        that.messageBox = new MessageBox(that, txt);
        that.messageBox.addButton("PLAY AGAIN", () => {
            that.pause = true;
            that.messageBox.hideBox();
            that.scene.restart();
            console.log("clicked");
        });
    }
}

