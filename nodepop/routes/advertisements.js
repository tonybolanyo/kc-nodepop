const express = require('express');
const router = express.Router();
const logger = require('morgan');

router.get('/', (req, res) => {
    const tag = req.query.tag;
    const isSale = req.query.sale;
    let filter = {}
    if (tag) {
        filter.tag = tag;
    }
    if (isSale) {
        filter.sale = isSale;
    }
    console.log(req.query);
    res.json({
        todo: 'List of advertisements ',
        filter: filter
    });
});

router.post('/', (req, res) => {
    res.json({ todo: 'Create article' });
});

module.exports = router;
