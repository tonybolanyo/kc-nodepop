const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Configuration data
const dataFilePath = './data/sample_data.json';
const mongoServer = {
    url: '127.0.0.1',
    port: '27017',
    database: 'nodepop'
};
// End of configuration data

const advCollection = 'advertisements';
const connectionString = `mongodb://${mongoServer.url}:${mongoServer.port}/${mongoServer.database}`;

// Allows access to database in every promise after connect to mongodb
let database;

fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading sample data file:', err);
        process.exit(1);
    }
    const sampleAdvertisements = JSON.parse(data);

    MongoClient.connect(connectionString)
        .then((db) => {
            console.log('  Connected ...');
            database = db;
        })
        .then(() => {
            const advertisements = database.collection(advCollection);
            console.log('  removing previous advertisements ...');
            return advertisements.remove();
        })
        .then(() => {
            console.log('  inserting sample data ...');
            const advertisements = database.collection(advCollection);
            return advertisements.insertMany(sampleAdvertisements);
        })
        .then(() => {
            console.log('  closing database connection ...');
            return database.close();
        })
        .then(() => {
            console.log('  advertisements collection initialized.');
        })
        .catch(err => {
            console.error('[ERROR] Can\'t setup initial data in database:', err);
            process.exit(2);
        });
});
