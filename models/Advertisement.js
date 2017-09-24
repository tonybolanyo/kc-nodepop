const mongoose = require('mongoose');

// Note on localization
// here i18n use defaultLocale for messages because schema
// compiles on init. You must use 18n translation
// when showing messages to show localized messages based on
// current user language. You must leave here i18n __ function
// so autoupdate of language files works.
const advertisementSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, __('You must provide a name for your advertisement')],
        index: true
    },
    isSale: {
        type: Boolean,
        required: [true, __('You must define your announcement as sale or search')],
        index: true
    },
    price: {
        type: Number,
        required: [true, __('You must define a price')],
        min: [0, __('Price must be a positive number or 0 (free)')],
        index: true
    },
    picture: String,
    tags: [{
        type: String,
        enum: {
            values: ['work', 'lifestyle', 'mobile', 'motor'],
            message: __('`{VALUE}` is not a valid tag')
        },
        index: true
    }]
});

exports.Advertisement = mongoose.model('Advertisement', advertisementSchema);
