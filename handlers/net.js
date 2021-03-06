//it's the counter part of the Player class in the front-end
const PlayerS = require("../characters/playerS.js");

function Net(that){
    this.application = that;
    //referenced the socket.io module and had it listen to our server object.
    this.io = require('socket.io').listen(that.server);

    //each group contains two players. the first player's id will be the index of the group.
    // this.groups = {};

    this.siteVisitorNumber = 0;
}

//the message to be sent, the object to be sent, the socket id of the target
Net.prototype.outgoingHandler = function(msg, obj, charID) {
    this.io.to(`${charID}`).emit(msg, obj);
}

//this is called from app.js
Net.prototype.listen = function() {
    let self = this;
    let application = this.application;
    
    //added logic to listen for connections and disconnections.
    this.io.on('connection', 
        function (socket) {		
            console.log('a user connected. id: ' + socket.id);

            //increase the number of people visited the site by one
            self.siteVisitorNumber++;

            console.log('visitor number : ' + self.siteVisitorNumber);
            
            // create a new player and add it to our players object
            application.players[socket.id] = new PlayerS(socket.id);

            socket.on("searching", function (playerEmail) {
                application.confidentialPlayers[socket.id] = {playerEmail: playerEmail};
                //accessing DB and getting the name of the player who just got connected, using their email
                application.getUsers({ email: playerEmail}).then( users => {
                    users.forEach(user => {
                        application.players[socket.id].name = user.name;
                        application.players[socket.id].score = user.wins;
                        console.log("score : " + user.wins);
                    });
                    console.log("here : " + playerEmail); //debug
                    
                    //the following call are inside then because they need to wait for the 
                    //query result and then be executed
                    application.waiting.unshift(application.players[socket.id]);
                    self.searchForMatch(socket);
                }).catch (err => {
                    throw err;
                });
            });

        
            socket.on('disconnect', 
                function () {
                    console.log('user disconnected');
                    let opponentId = application.players[socket.id].opponentId;
                    // emit a message to the opponent to remove this player
                    self.outgoingHandler('disconnect', socket.id, opponentId);
                    // remove this player from our players object
                    delete application.players[socket.id];
                    delete application.confidentialPlayers[socket.id];
                }
            );
            // when a player moves, update the player data
            socket.on('playerMovement', 
                function (movementData) {
                    let player = application.players[socket.id];
                    let opponentId = player.opponentId;

                    player.spriteAngle = movementData.spriteAngle;
                    player.x = movementData.x;
                    player.y = movementData.y;
                    player.xVelocity = movementData.xVelocity;
                    player.yVelocity = movementData.yVelocity;
                    // emit a message to the other player about the player that moved
                    self.outgoingHandler('playerMoved', player, opponentId);
                }
            );

            socket.on('scored', id => {
                let email = application.confidentialPlayers[id].playerEmail;
                let player = application.players[socket.id];
                application.User.findOneAndUpdate({email: email}, {$inc : {'wins' : 1}})
                //immediately querying the field that we updated and sending the result to the client
                //to make sure they will get the up to date result
                .then( () => {
                    application.getUsers({email: email}).then( users => {
                        self.outgoingHandler('scored', users[0].wins, socket.id);
                        self.outgoingHandler('opponentScored', users[0].wins, player.opponentId);
                    }).catch(err => {
                        throw err;
                    });
                }).catch(err => {
                    throw err;
                });
            });

            socket.on('playerShoot', (gunZonePosition) => {
                let player = application.players[socket.id];
                let direction = {
                    x: null,
                    y: null
                }
                switch (player.spriteAngle) {
                    case 0:
                        direction.x = 1;
                        direction.y = 0;
                        break;
                    case 90:
                        direction.x = 0;
                        direction.y = 1;
                        break;
                    case 180:
                        direction.x = -1;
                        direction.y = 0;
                        break;
                    case 270:
                        direction.x = 0;
                        direction.y = -1;
                        break;
                    default:
                        console.log("Error: " + player.name + " has a wrong spriteAngle!")
                        break;
                }
                let bulletInfo = {
                    x: gunZonePosition.x,
                    y: gunZonePosition.y,
                    xDir: direction.x,
                    yDir: direction.y,
                    owner: player,
                    spriteAngle: player.spriteAngle
                };
                self.outgoingHandler('shoot', bulletInfo, player.opponentId);
                self.outgoingHandler('shoot', bulletInfo, socket.id);
            });
                    
        }
    );
    const PORT = process.env.PORT || 5000;
    this.application.server.listen(PORT, console.log(`Server started on port ${PORT}`));
}

Net.prototype.searchForMatch = function(socket) {
    let application = this.application;

    console.log("waiting list length : " + application.waiting.length);
    if(application.waiting.length > 1){
        console.log("searchingggggg for match");
        let opponent = application.waiting.pop();
        let searcher = application.waiting.shift();
        let players = {searcher, opponent};

        searcher.team = 'A';
        // searcher.x = 622;//debug
        searcher.x = 128;//nodebug
        searcher.y = 60;//nodebug
        searcher.spriteAngle = 0;
        opponent.team = 'B';
        opponent.x = 722;
        opponent.spriteAngle = 180;

        opponent.opponentId = searcher.charID;
        searcher.opponentId = opponent.charID;
        this.outgoingHandler('matched', players, opponent.charID);
        this.outgoingHandler('matched', players, searcher.charID);
    }
    else {
        this.application.players[socket.id].opponentId = null;
    }
    // send the players object to the new player (to this particular socket)
    // update all other players about the new player (to all other sockets)
}

module.exports = Net;

