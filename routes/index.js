var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/unauthorized', (req, res, next) => {
    res.render('unauthorized');
});

router.get('/invalid-credentials', (req, res, next) => {
    res.render('invalid-credentials');
});

module.exports = router;
