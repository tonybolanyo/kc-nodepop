'use strict';

const fs = require('fs');

const i18n = require('../config/i18n')();

const db = require('./mongooseConnection');
const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

// Configuration data
const dataFilePath = './data/sample_data.json';
// End of configuration data

db.once('open', async function() {
    try {
        await installUsers();
        await installAdvertisements();
    } catch(err) {
        console.error('Error creating users', err);
        process.exit(1);
    }
    db.close();
});

async function installUsers() {
    const deleted = await User.deleteMany();
    console.log(`${deleted.result.n} users deleted`);

    const inserted = await User.insertMany([
        { name: 'tony', email: 'tonybolanyo@gmail.com', password: User.hashPassword('1234') },
        { name: 'test user', email: 'user@example.com', password: User.hashPassword('1234') }
    ]);
    console.log(`${inserted.length} users inserted`);
}

async function installAdvertisements() {
    const deleted = await Advertisement.deleteMany();
    console.log(`${deleted.result.n} advertisements deleted`);
    
    fs.readFile(dataFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading sample data file:', err);
            process.exit(1);
        }
        
        const sampleAdvertisements = JSON.parse(data);

        try {
            const inserted = await Advertisement.insertMany(sampleAdvertisements);
            console.log(`${inserted.length} advertisements inserted`);
        } catch(err) {
            console.error('Error inserting advertisements:', error);
            process.exit(2);
        }
    });
}