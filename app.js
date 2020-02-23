const express = require('express');
const expressLayouts = require('express-ejs-layouts'); //to use for building UI
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));