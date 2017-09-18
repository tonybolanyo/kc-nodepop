var mongoose = require('mongoose');

var advertisementSchema = mongoose.Schema({
    name: String,
    isSale: Boolean, 
    price: Number,
    picture: String,
    tags: [String]
});

exports.Advertisement = mongoose.model('Advertisement', advertisementSchema);
