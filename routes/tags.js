var express = require('express');
var router = express.Router();

// load mongoose and Advertisement model
const mongoose = require('mongoose');
const Advertisement = mongoose.model('Advertisement');

router.get('/', (req, res, next) => {
    Advertisement.distinct('tags', (err, data) => {
        if (err) {
            console.error('Error listing tags', err);
            res.status(500).json({
                error: "Error listing tags",
                details: err
            });
        }
        console.log(data);
        res.json({
            tags: data
        });
    });
});

module.exports = router;
