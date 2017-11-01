'use strict';

const User = require('../models/User');

class LoginController {
    index(req, res, next) {
        res.locals.email = '';
        res.locals.error = '';
        res.locals.title = 'NodePop';
        res.render('login');
    }

    async post(req, res, next) {
        const email = req.body.email;
        const password = User.hashPassword(req.body.password);
        res.locals.title = 'NodePop';

        const user = await User.findOne({ email: email, password: password });

        if (!user) {
            res.locals.email = email;
            res.locals.error = __('No user found with this email/password');
            res.render('login', { title: 'NodePop' });
            return;
        }

        // good credentials
        res.redirect('/');
    }
}

module.exports = new LoginController();