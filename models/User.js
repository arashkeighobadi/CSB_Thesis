const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    wins: {
        type: Number,
        default: 0
    }
});

// we create a model from our schema and assign it to the User variable
const User = mongoose.model('User', UserSchema);

// we export User model to be able to use it elsewhere in our program
module.exports = User;