'use strict';

const mongoose = require('mongoose');
const Advertisement = require('../../models/Advertisement');
const User = require('../../models/User');

module.exports.initAdvertisement = async function() {
    await Advertisement.deleteMany();
    await Advertisement.insertMany([{
        "name": "Leather belt",
        "price": 15.50,
        "isSale": true,
        "picture": "belts-2160265_640.jpg",
        "tags": ["lifestyle"]
    }, {
        "name": "Mobile phone repairing kit",
        "price": 30.00,
        "isSale": false,
        "picture": "mobile-phone-2510529_640.jpg",
        "tags": ["work", "mobile"]
    }, {
        "name": "Spanish guitar",
        "price": 250.00,
        "isSale": false,
        "picture": "guitar-2276181_640.jpg",
        "tags": ["lifestyle"]
    }]);
}

module.exports.initUsers = async function() {
    await User.deleteMany();
    await User.insertMany([{
        name: 'Test User', email: 'user@example.com', password: User.hashPassword('1234')
    }]);
}