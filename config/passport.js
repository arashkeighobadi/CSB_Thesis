const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true); //in order to get rid of the deprecated error
const bcrypt = require('bcryptjs');
// We pass in passport from app.js file so we don't import it here

// Load User Model
const User = require('../models/User');

// we gonna export our strategy
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match User
            User.findOne({ email:email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password is incorrect'});
                        }

                    });
                })
                .catch( err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

