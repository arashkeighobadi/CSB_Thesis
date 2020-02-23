// this is to insure the user is logged in when they visit dashboard.
// So  if they are not logged in, by typing in localhost:5000/dashboard in the browser, 
// they shouldn't be able to access the dashboard page.

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) { //we have a method provided by passport attached to the req object called isAuthenticated
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');
    }
}

// Now, we can bring in this auth.js to other files and add ensureAuthenticated 
// middleware to any rout that we need to protect.