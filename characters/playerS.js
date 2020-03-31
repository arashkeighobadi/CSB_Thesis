const Character = require('./characterS.js');

//PlayerS is the server version of Player in the public folder
class PlayerS extends Character {
    constructor(){
        super(playerInfo);
        this.team = null;
    }
}

module.exports = PlayerS;
