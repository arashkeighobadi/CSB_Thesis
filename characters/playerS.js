const Character = require('./characterS.js');

//PlayerS is the server version of Player in the public folder
class PlayerS extends Character {
    constructor(charID){
        super(charID);
        // team will be determined when they find a match
        this.team = null;
        this.name = null;
        this.wins = null;
        this.opponentId = null;
    }
}

module.exports = PlayerS;
