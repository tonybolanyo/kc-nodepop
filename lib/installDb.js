'use strict';

require('../config/i18n')();

const fs = require('fs');
const path = require('path');

const db = require('./mongooseConnection');
const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

// Configuration data
const dataFilePath = './data/sample_data.json';
// End of configuration data

const resize = require('./resize');

db.once('open', async function() {
    try {
        await installUsers();
        await installAdvertisements();
        await installPictures();
    } catch(err) {
        console.error('Error installing sample data', err);
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
            console.error('Error inserting advertisements:', err);
            process.exit(2);
        }
    });
}

async function installPictures() {
    const srcFolder = path.join(__dirname, '..', 'data', 'images');
    const thumbsFolder = path.join(__dirname, '..', 'public', 'images', 'advertisements');
    
    if (fs.existsSync(thumbsFolder)) {
        fs.unlinkSync(thumbsFolder);
    }
    fs.mkdirSync(thumbsFolder);

    fs.readdir(srcFolder, (err, files) => {
        for(let file of files) {
            resize(file, srcFolder);
        }
    });
}
