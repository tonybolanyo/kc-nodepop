'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

        if (!user) {
            res.json({ ok: false, error: 'invalid credentials'});
            return;
        }

        // good credentials

        jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d'
        }, (err, token) => {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, token: token });
        });
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