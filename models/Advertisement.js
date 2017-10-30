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

advertisementSchema.statics.getList = function(filter, offset, limit, callback) {
    const query = Advertisement.find(filter);
    query.skip(offset);
    query.limit(limit);
    // run query and return result to callback function
    return query.exec(callback);
};

/**
 * Helper function to create filter for query advertisement coollection
 * from query parameters.
 * Accepted tags: tag, sale, price, name.
 * See API documentation at http://<server_domain>:<server_port>/docs/api for details.
 * @param {*} req The request
 */
advertisementSchema.statics.createFilter = function createFilter(req) {
    const tag = req.query.tag;
    const isSale = req.query.sale;
    const price = req.query.price;
    const name = req.query.name;

    let filter = {};
    
    if (tag) {
        // must have ALL tags
        filter.tags = {$all: tag};
    }
    if (isSale) {
        // true for sale, false for buy
        filter.isSale = isSale;
    }
    if (price) {
        // price range can be <min>-<max>
        // if no min or max specified then from 0 or no max limit
        // if proce has no -, then find exact price value
        if (price.indexOf('-') >= 0) {
            const range = price.split('-');
            const pmin = parseInt(range[0]);
            filter.price = {};
            if (pmin) {
                filter.price.$gte = pmin;
            }
            const pmax = parseInt(range[1]);
            if (pmax) {
                filter.price.$lte = pmax;
            }
        } else {
            filter.price = parseInt(price);
        }
    }
    if (name) {
        // first letters of name, case insensitive
        filter.name = new RegExp('^' + name, 'i');
    }
    return filter;
}

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
exports.Advertisement = Advertisement;
