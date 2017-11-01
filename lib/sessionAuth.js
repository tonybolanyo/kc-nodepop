'use strict';

module.exports = function() {
    return function(req, res, next) {
        // if not authenticated user redirect to login page
        if (!req.session.authUser) {
            console.log('redirecting');
            res.redirect('/login');
            return;
        }
        // if authenticated, continue
        next();
    }
}