var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/unauthorized', (req, res, next) => {
    res.render('unauthorized');
});

module.exports = router;
