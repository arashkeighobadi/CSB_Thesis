class Application {
    constructor() {
        const express = require('express');
        const expressLayouts = require('express-ejs-layouts'); //to use for building UI
        this.mongoose = require('mongoose');
        const flash = require('connect-flash');
        const session = require('express-session');
        const passport = require('passport');
        
        const Net = require('./net.js');
        
        const app = express();
        
        //DB users model
        this.User = require('./models/User');
        
        //supplied the app to the HTTP server, which will allow express to handle the HTTP requests.
        this.server = require('http').Server(app);
        
        //updated the server to render our static files using express.static built-in middleware function in Express. 
        app.use(express.static(__dirname + '/public'));
        
        this.net = new Net(this);

        // Passport config
        require('./config/passport')(passport);

        this.setupDatabase();
                
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

        this.net.listen();
    }
    
    setupDatabase() {
        // DB config
        const db = require('./config/keys').MongoURI;
        // Connect to Mongo
        this.mongoose.connect(db, { useNewUrlParser: true}) //returns a promise so we handle it in the following.
            .then(() => console.log('MongoDB Connected...'))
            .catch(err => console.log(err));
        
        this.mongoose.set('useNewUrlParser', true);
        this.mongoose.set('useFindAndModify', false);
        this.mongoose.set('useCreateIndex', true);
        this.mongoose.set('useUnifiedTopology', true);
    }

    //this could be gone in User.js and be part of a class
    getUsers(query={}, project={}, limit=10) {
        return this.User.find(query, project).limit(limit).exec();
    }

}

application = new Application();