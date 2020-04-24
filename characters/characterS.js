//CharacterS is the server version of Character in the public folder
function CharacterS(charID){
    this.charID = charID;
    // Angle is determined in searchForMatch method
    this.spriteAngle = null;
    this.x = null;
    this.y = 580;
    this.xVelocity = 0;
    this.yVelocity = 0;
}

module.exports = CharacterS;