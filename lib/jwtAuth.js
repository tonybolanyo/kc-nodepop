'use strict';

const jwt = require('jsonwebtoken');

const isApiCall = require('./utils').isApiCall;

module.exports = function() {
    return function(req, res, next) {
        // if not authenticated user return error
        const token = req.body.token || req.query.token || req.get('x-access-token');
        if (!token) {
            if (isApiCall(req)) {
                console.log('IS API CALL');
                const error = new Error('No token provided');
                error.status = 403;
                next(error);
                return;
            } else {
                console.log('NO API CALL => Redirecting');
                return res.redirect('/unauthorized');
            }
        }
        // if authenticated, continue
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                err.status = 403;
                return next(err);
            }
            req.userId = decoded._id;
            next();
        });
    };
};