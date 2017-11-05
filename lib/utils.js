'use strict';

module.exports.isApiCall = (req) => {
    console.log('Probing API Call:', req.originalUrl.indexOf('/api') === 0);
    return req.originalUrl.indexOf('/api') === 0;
};