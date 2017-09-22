var mongoose = require('mongoose');

var advertisementSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    isSale: {
        type: Boolean,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    picture: String,
    tags: {
        type: [String],
        enum: ['work', 'lifestyle', 'mobile', 'motor'],
        index: true
    }
});

exports.Advertisement = mongoose.model('Advertisement', advertisementSchema);
