const mongoose = require('mongoose');
const db = mongoose.connection;
const dbConfig = require('../config/database').mongodb;

const connectionString = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

db.on('error', () => {
    console.error.bind(console, 'mongodb connection error:');
});
db.once('open', () => {
    console.info('Connected to MongoDB on ', mongoose.connection.name);
});

mongoose.connect(connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

// export connection to use in our external scripts (installDb, for example)
module.exports = db;