'use strict';

const db = require('./mongooseConnection');
const User = require('../models/User');

db.once('open', async function() {
    try {
        await installUsers();
    } catch(err) {
        console.error('Error creating users', err);
        process.exit(1);
    }
    conn.close();
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