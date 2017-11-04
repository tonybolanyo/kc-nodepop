'use strict';

const db = require('./mongooseConnection');
const mongoose = require('mongoose');

db.on('error', (error) => {
    console.error('\n\n[ERROR] Connection test failure:\n\n', error);
    process.exit(1);
});

db.once('open', () => {
    console.info('Connection details:');
    console.info('  - host:', mongoose.connection.host);
    console.info('  - port:', mongoose.connection.port);
    console.info('  - db:  ', mongoose.connection.name);
    console.info('  - user:', mongoose.connection.user);
    db.close();
});