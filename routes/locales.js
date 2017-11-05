'use strict';

const express = require('express');
const router = express.Router();

// makes JSON for language available on public URL
router.get('/:lang', (req, res, next) => {
    res.json(req.getCatalog(req.params.lang));
});

module.exports = router;