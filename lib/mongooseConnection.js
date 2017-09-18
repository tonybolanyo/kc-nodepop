var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', () => {
    console.error.bind(console, 'mongodb connection error:');
});
db.once('open', () => {
    console.info('Connected to mongodb.');
});

mongoose.connect('mongodb://vvddtvins01/nodepop');