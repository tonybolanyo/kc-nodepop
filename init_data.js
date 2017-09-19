const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Configuration data
const dataFilePath = './sample_data.json';
const mongoServer = {
    url: 'vvddtvins01',
    port: '27017',
    database: 'nodepop'
}
const advCollection = 'advertisements';
// End of configuration data

const connectionString = `mongodb://${mongoServer.url}:${mongoServer.port}/${mongoServer.database}`;

fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading sample data file:", err);
        process.exit(1);
    }
    const sampleAdvertisements = JSON.parse(data);
    MongoClient.connect(connectionString, (err, db) => {
        const advertisements = db.collection(advCollection);
        advertisements.insertMany(sampleAdvertisements, (err, result) => {
            if (err) {
                console.error("Error:", err);
                process.exit(2);
            }
            console.log("Docs inserted count:", result.insertedCount);
            db.close();
        });
    });    
});
