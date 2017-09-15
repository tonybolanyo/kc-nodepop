var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({ todo: 'List of advertisements '});
});

router.post('/', (req, res) => {
    res.json({ todo: 'Create article' });
});

module.exports = router;
