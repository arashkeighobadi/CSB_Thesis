//for routes like "/login" or  "/register"

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// login page
router.get("/login", (req, res) => res.render("login")); //renders login.ejs

// register page
router.get("/register", (req, res) => res.render("register")); //renders register.ejs

// Handle Register
router.post('/register', (req, res) => {
    const { name, email, password, password2} = req.body;
    let errors = [];

    // Check required fields
    if( !name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields"});
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: "Passwords do not match" })
    }

    // Check pass length
    if(password.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters"});
    }

    if (errors.length > 0) { 
        //we render register.ejs page again, and we pass the info so they won't have to enter everything again
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email }) // we search for a user with this email
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    // User doesn't exist
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => // we generate a salt and use it to hash the password
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save() //this returns a prommise so we use <<then>> in the following
                                .then(user => {
                                    // creating a flash msg before redirecting. 
                                    // success_msg is defined in app.js and is handled in messages.ejs 
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    //we redirect the user to the login page after the registration is completed
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
            
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout(); //passport middleware gives us the logout() function
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;