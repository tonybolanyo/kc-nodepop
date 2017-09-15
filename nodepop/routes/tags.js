var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.json({ todo: 'List of tags' });
});

module.exports = router;
