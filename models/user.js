const mongoose = require('mongoose');

// Mongoose connection with success/fail logs

// Schema
const userschema = new mongoose.Schema({
    useremail: String,
    password: String,
    repassword: String,
});

// Export model
module.exports = mongoose.model('user', userschema);
