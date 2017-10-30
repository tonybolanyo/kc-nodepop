const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
    const locale = req.params.locale;
    const redirTo = req.query.next || req.get('referer');
    res.cookie('lang', locale, { maxAge: 24 * 3600000, httpOnly: true });
    res.redirect(redirTo);
});

module.exports = router;