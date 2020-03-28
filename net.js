module.exports = class Net {
    constructor(that) {
        this.application = that;
        //referenced the socket.io module and had it listen to our server object.
        this.io = require('socket.io').listen(that.server);
        //to keep track of all the players that are currently in the game.
        this.players = {};

        //array of players who are waiting for an opponent. First one has waited the longest.
        this.waiting = [];

        //confidential list of all players where we store emails and ID's
        //!!! DO NOT SEND IT TO THE CLIENTS !!!
        this.confidentialPlayers = {};

        //each group contains two players. the first player's id will be the index of the group.
        this.groups = {};

        this.siteVisitorNumber = 0;
    }

    //the message to be sent, the object to be sent, the socket id of the target
    outgoingHandler(msg, obj, playerID) {
        this.io.to(`${playerID}`).emit(msg, obj);
    }

    //this is called from app.js
    listen() {
        let that = this;
        //added logic to listen for connections and disconnections.
        this.io.on('connection', 
            function (socket) {		
                console.log('a user connected. id: ' + socket.id);

                //increase the number of people visited the site by one
                that.siteVisitorNumber++;

                console.log('visitor number : ' + that.siteVisitorNumber);
                
                // create a new player and add it to our players object
                that.players[socket.id] = {
                    playerId: socket.id,
                    playerNumber: that.siteVisitorNumber,
                    // Angle is determined in searchForMatch method
                    spriteAngle: null,
                    // the x value of the middle of the entrance is 672 so +/- 50 makes starting fair
                    // x will be determined when they find a match. i.e. in searchForMatch method
                    x: null/* (that.siteVisitorNumber % 2 == 0) ? 622 : 722 */,
                    y: /* Math.floor(Math.random() * 300) + */ 550,
                    xVelocity: 0,
                    yVelocity: 0,
                    // team will be determined when they find a match
                    team: null /* (that.siteVisitorNumber % 2 == 1) ? 'team1' : 'team2' */
                };
    
                if(that.siteVisitorNumber % 2 == 1){
                    that.groups[that.siteVisitorNumber] = {
                        firstPlayer: that.players[socket.id]
                    };
                }
                else {
                    that.groups[that.siteVisitorNumber-1].secondPlayer = that.players[socket.id];
                }
    
                socket.on("searching", function (playerEmail) {
                    that.confidentialPlayers[socket.id] = {playerEmail: playerEmail};
                    //accessing DB and getting the name of the player who just got connected, using their email
                    that.application.getUsers({ email: playerEmail}).then( users => {
                        users.forEach(user => {
                            that.players[socket.id].name = user.name;
                            that.players[socket.id].score = user.wins;
                            console.log("score : " + user.wins);
                        });
                        console.log("here : " + playerEmail); //debug
                        
                        //the following call are inside then because they need to wait for the 
                        //query result and then be executed
                        that.waiting.unshift(that.players[socket.id]);
                        that.searchForMatch(socket);
                    }).catch (err => {
                        throw err;
                    });
                });
    
            
                socket.on('disconnect', 
                    function () {
                        console.log('user disconnected');
                        let opponentId = that.players[socket.id].opponentId;
                        // emit a message to the opponent to remove this player
                        that.outgoingHandler('disconnect', socket.id, opponentId);
                        // remove this player from our players object
                        delete that.players[socket.id];
                        delete that.confidentialPlayers[socket.id];
                    }
                );
                // when a player moves, update the player data
                socket.on('playerMovement', 
                    function (movementData) {
                        let player = that.players[socket.id];
                        let opponentId = player.opponentId;

                        player.spriteAngle = movementData.spriteAngle;
                        player.x = movementData.x;
                        player.y = movementData.y;
                        player.xVelocity = movementData.xVelocity;
                        player.yVelocity = movementData.yVelocity;
                        // emit a message to the other player about the player that moved
                        that.outgoingHandler('playerMoved', player, opponentId);
                    }
                );
    
                socket.on('scored', id => {
                    let email = that.confidentialPlayers[id].playerEmail;
                    that.application.User.findOneAndUpdate({email: email}, {$inc : {'wins' : 1}})
                    //immediately querying the field that we updated and sending the result to the client
                    //to make sure they will get the up to date result
                    .then( () => {
                        that.application.getUsers({email: email}).then( users => {
                            that.outgoingHandler('scored', users[0].wins, socket.id)
                        }).catch(err => {
                            throw err;
                        });
                    }).catch(err => {
                        throw err;
                    });
                });
                        
            }
        );
        const PORT = process.env.PORT || 5000;
        this.application.server.listen(PORT, console.log(`Server started on port ${PORT}`));
    }

    searchForMatch(socket) {
        console.log("waiting list length : " + this.waiting.length);
        if(this.waiting.length > 1){
            console.log("searchingggggg for match");
            let opponent = this.waiting.pop();
            let searcher = this.waiting.shift();
            let players = {searcher, opponent};

            searcher.team = "team1";
            searcher.x = 622;
            searcher.spriteAngle = 0;
            opponent.team = "team2";
            opponent.x = 722;
            opponent.spriteAngle = 180;

            opponent.opponentId = searcher.playerId;
            searcher.opponentId = opponent.playerId;
            this.outgoingHandler('matched', players, opponent.playerId);
            this.outgoingHandler('matched', players, searcher.playerId);
        }
        else {
            this.players[socket.id].opponentId = null;
        }
        // send the players object to the new player (to this particular socket)
        // update all other players about the new player (to all other sockets)
    }
}

