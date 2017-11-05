'use strict';

module.exports.isApiCall = (req) => {
    return req.originalUrl.indexOf('/api') === 0;
};