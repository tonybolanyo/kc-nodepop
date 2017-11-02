'use strict';

const mongoose = require('mongoose');
const hash = require('hash.js');

const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

userSchema.statics.hashPassword = function(password) {
    return hash.sha256().update(password).digest('hex');
};

var User = mongoose.model('User', userSchema);

module.exports = User;