const express = require('express');
const expressLayouts = require('express-ejs-layouts'); //to use for building UI
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//+
//supplied the app to the HTTP server, which will allow express to handle the HTTP requests.
var server = require('http').Server(app);

//+
//referenced the socket.io module and had it listen to our server object.
var io = require('socket.io').listen(server);

//+
//to keep track of all the players that are currently in the game.
var players = {};

//+
//to store the position of our star collectible
var star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
  };
  
//+  
//to keep track of both team’s score
var scores = {
blue: 0,
red: 0
};

//+
//updated the server to render our static files using express.static built-in middleware function in Express. 
app.use(express.static(__dirname + '/public'));


// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true}) //returns a promise so we handle it in the following.
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS - note: use() comes before set()
app.use(expressLayouts); // using this middleware
app.set('view engine', "ejs"); // setting EJS as our view engine

// Bodyparser (it used to be a separate module, but now it's a part of express)
app.use(express.urlencoded({ extended: false })); // now we can get data from form with req.body

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars - Here, we're designing a middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'); //now we should be able to call success_msg. See usage in users.js
    res.locals.error_msg = req.flash('error_msg'); //now we should be able to call error_msg
    res.locals.error = req.flash('error'); 
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//+
//added logic to listen for connections and disconnections.
io.on('connection', 
	function (socket) {		
		console.log('a user connected. id: ' + socket.id);
	  
		// create a new player and add it to our players object
		players[socket.id] = {
			playerId: socket.id,
			x: Math.floor(Math.random() * 700) + 50,
			y: Math.floor(Math.random() * 300) + 50,
			xVelocity: 0,
			yVelocity: 0,
			team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
		};

		// send the players object to the new player (to this particular socket)
		socket.emit('currentPlayers', players);
		// send the star object to the new player
		socket.emit('starLocation', star);
		// send the current scores
		socket.emit('scoreUpdate', scores);
		
		// update all other players about the new player (to all other sockets)
		socket.broadcast.emit('newPlayer', players[socket.id]);
	  
		socket.on('disconnect', 
			function () {
				console.log('user disconnected');
				
				// remove this player from our players object
				delete players[socket.id];
				
				// emit a message to all players to remove this player
				io.emit('disconnect', socket.id);
			}
		);
		// when a player moves, update the player data
		socket.on('playerMovement', 
			function (movementData) {
				players[socket.id].x = movementData.x;
				players[socket.id].y = movementData.y;
				players[socket.id].xVelocity = movementData.xVelocity;
				players[socket.id].yVelocity = movementData.yVelocity;
				// emit a message to all players about the player that moved
				socket.broadcast.emit('playerMoved', players[socket.id]);
				// console.log('playerID: ' + players[socket.id].playerId + 'socketID: ' + socket.id);
			}
		);
		
		// // will be triggered when a player collects a point
		// socket.on('scored', 
		// 	function (username) {
		// 		collection.find({}).sort({ highScore: -1}).toArray((error, result) => {
		// 			if(error) {
		// 				return response.status(500).send(error);
		// 			}
		// 			for(i=0;i<result.length;i++){
		// 				if(result[i].name === loginInfo.username){
		// 					socket.emit('loginApproved', loginInfo.username);
		// 					approved = true;
		// 				}
		// 			}
		// 			if(!approved){
		// 				socket.emit('loginFailed', loginInfo.username);
		// 			}
		// 		});
		// 	}
		// );

		//player wanna shoot, send shoot to all clients
		socket.on('playerShoot', 
			function (bulletData) {
				// emit a message to all players about the player that moved
				io.emit('shoot', bulletData);
				console.log(bulletData);
			}
		);

		socket.on('playerGotShot',
			function (id){
				// if(id != socket.id) {
					io.emit('playerGotShotImpact', players[id].playerId);
					// console.log('playerGotShotImpact: ' + players[id].playerId + ' socket.id: ' + socket.id);
				// }

			});
		
		socket.on('loginPressed',
			function (loginInfo){
				collection.find({}).sort({ highScore: -1}).toArray((error, result) => {
					if(error) {
						return response.status(500).send(error);
					}
					let approved = false;
					for(i=0;i<result.length;i++){
						// console.log(result[i].name + " " + result[i].password);
						// console.log(loginInfo.username + " " + loginInfo.password + "\n");
						if(result[i].name === loginInfo.username && result[i].password === loginInfo.password){
							socket.emit('loginApproved', loginInfo.username);
							approved = true;
						}
					}
					if(!approved){
						socket.emit('loginFailed', loginInfo.username);
					}
				});
			}
		);
				
	}
);

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));