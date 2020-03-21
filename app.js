const express = require('express');
const expressLayouts = require('express-ejs-layouts'); //to use for building UI
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/User');

const app = express();
var siteVisitorNumber = 0;

//+
//supplied the app to the HTTP server, which will allow express to handle the HTTP requests.
var server = require('http').Server(app);

//+
//referenced the socket.io module and had it listen to our server object.
var io = require('socket.io').listen(server);

//+
//to keep track of all the players that are currently in the game.
var players = {};

//confidential list of all players where we store emails and ID's
//!!! DO NOT SEND IT TO THE CLIENTS !!!
var confidentialPlayers = {};

//+
//to store the position of our star collectible
var star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
  };
  
//+  
//to keep track of both team’s score
var scores = {
team1: 0,
team2: 0
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

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//this could be gone in User.js and be part of a class
function getUsers(query={}, project={}, limit=10) {
	// userss = ['hi'];
	return User.find(query, project).limit(limit).exec();
	// .then( users => {
	// 	users.forEach((user) => {
	// 		while(!user.name){};
	// 		console.log(user);
	// 		userss.push(user);
	// 		console.log("pushed " + userss);

	// 	})
	// }).catch( err => {
	// 	throw err;
	// });
}

// userss = ['hi'];
// getUsers({name: 'test5'}).then( users => {
// 	users.forEach((user) => {
// 		while(!user.name){};
// 		console.log(user);
// 		userss.push(user);
// 		console.log("pushed " + userss);

// 	})
// 	console.log("hello " + userss );
// }).catch( err => {
// 	throw err;
// });


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

		//increase the number of people visited the site by one
		siteVisitorNumber++;

		// create a new player and add it to our players object
		players[socket.id] = {
			playerId: socket.id,
			playerNumber: siteVisitorNumber,
			// the x value of the middle of the entrance is 672 so +/- 50 makes starting fair
			x: (siteVisitorNumber % 2 == 0) ? 622 : 722,
			y: /* Math.floor(Math.random() * 300) + */ 550,
			xVelocity: 0,
			yVelocity: 0,
			//players with odd number go to team1 and the ones with even numbers go to team2
			team: (siteVisitorNumber % 2 == 0) ? 'team2' : 'team1'

			// team: (Math.floor(Math.random() * 2) == 0) ? 'team1' : 'team2'
		};

		socket.on("playerEmail", function (playerEmail) {
			// players[socket.id].playerEmail = playerEmail;
			// console.log("email : " + players[socket.id].playerEmail);
			confidentialPlayers[socket.id] = {playerEmail: playerEmail};
			//accessing DB and getting the name of the player who just got connected, using their email
			getUsers({ email: playerEmail}).then( users => {
				users.forEach(user => {
					players[socket.id].name = user.name;
					players[socket.id].score = user.wins;
					console.log("score : " + user.wins);
				});
				//the following call are inside then because they need to wait for the 
				//query result and then be executed
				// send the players object to the new player (to this particular socket)
				socket.emit('currentPlayers', players);
				// send the star object to the new player
				socket.emit('starLocation', star);
				// send the current scores
				socket.emit('scoreUpdate', scores);
				// update all other players about the new player (to all other sockets)
				socket.broadcast.emit('newPlayer', players[socket.id]);
			}).catch (err => {
				throw err;
			});
		});

	  
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

		socket.on('scored', id => {
			console.log('scoreeeed! ' + id);
			let email = confidentialPlayers[id].playerEmail;
			User.findOneAndUpdate({email: email}, {$inc : {'wins' : 1}})
			//immediately querying the field that we updated and sending the result to the client
			//to make sure they will get the up to date result
			.then( () => {
				getUsers({email: email}).then( users => {
					socket.emit('scored', users[0].wins );
					console.log("wins : " + users[0].wins);
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

server.listen(PORT, console.log(`Server started on port ${PORT}`));