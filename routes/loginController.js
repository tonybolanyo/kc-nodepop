'use strict';

const User = require('../models/User');

class LoginController {
    index(req, res, next) {
        res.locals.email = '';
        res.locals.error = '';
        res.locals.title = 'NodePop';
        console.log('LoginController.index');
        res.render('login');
    }

    async post(req, res, next) {
        const email = req.body.email;
        const password = User.hashPassword(req.body.password);
        res.locals.title = 'NodePop';

        const user = await User.findOne({ email: email, password: password });
        console.log('user:', user);

        if (!user) {
            console.log('NOT Valid User');
            res.locals.email = email;
            res.locals.error = __('No user found with this email/password');
            res.render('login', { title: 'NodePop' });
            return;
        }
        console.log('Valid User');

        // good credentials

        req.session.authUser = { _id: user._id };
        res.redirect('/');
    }

    logout(req, res, next) {
        delete(req.session.authUser);
        req.session.regenerate(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    }
}

module.exports = new LoginController();