//CharacterS is the server version of Character in the public folder
class CharacterS {
    constructor(charInfo) {
        this.charID = charInfo.charID;
        this.spriteAngle = null;
        this.x = charInfo.x;//null;
        this.y = 580;
        this.xVelocity = 0;
        this.yVelocity = 0;
    }
}

module.exports = CharacterS;