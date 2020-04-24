const CharacterS = require('./characterS.js');

//PlayerS is the server version of Player in the public folder
function PlayerS(charID) { //Extends Character
    CharacterS.call(this, charID);
    // team will be determined when they find a match
    this.team = null;
    this.name = null;
    this.wins = null;
    this.opponentId = null;
}

// Actual inheritence logic
PlayerS.prototype = Object.create(CharacterS.prototype);
PlayerS.prototype.constructor = PlayerS

module.exports = PlayerS;
