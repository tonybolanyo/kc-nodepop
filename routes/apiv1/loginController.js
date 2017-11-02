'use strict';

const User = require('../../models/User');
const jwt = require('jsonwebtoken');

class LoginController {
    async post(req, res, next) {
        const email = req.body.email;
        const password = User.hashPassword(req.body.password);
        res.locals.title = 'NodePop';

        const user = await User.findOne({ email: email, password: password });

        if (!user) {
            const error = new Error('Invalid credentials');
            error.status = 403;
            console.log('!user', error);
            next(error);
            return;
        }

        // good credentials

        jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, token: token });
        });
    }
}

module.exports = new LoginController();