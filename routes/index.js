//for routes like "/" or "/home"

const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth'); //we use this to protect dashboard route. 

// Welcome Page
router.get("/", (req, res) => res.render("dashboard")); //renders welcome.ejs

// Dashboard - renders dashboard.ejs
// Note: this route is protected by ensureAuthenticated parameter.
router.get("/dashboard",ensureAuthenticated , (req, res) => 
    res.render("dashboard", {name: req.user.name} ) //when we are logged in we have access to req.user.name 
);

module.exports = router;