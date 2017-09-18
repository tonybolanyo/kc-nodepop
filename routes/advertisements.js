const express = require('express');
const router = express.Router();
const logger = require('morgan');
const mongoose = require('mongoose');
const Advertisement = mongoose.model('Advertisement');

router.get('/', (req, res) => {
    const tag = req.query.tag;
    const isSale = req.query.sale;
    let filter = {}
    if (tag) {
        filter.tags = tag;
    }
    if (isSale) {
        filter.isSale = isSale;
    }
    console.log(req.query);
    const advertisementsQuery = Advertisement.find(filter);
    advertisementsQuery.exec((err, docs) => {
        console.log("query exec");
        if (err) {
            console.error("Can't retrieve list of advertisements", err);
            res.json({
                error: "Can't retrieve advertisements",
                errorDetails: err
            });
        }
        console.log("advertisements", docs);
        res.json(docs);

    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    const advertisement = new Advertisement({
        name: req.body.name,
        isSale: req.body.isSale,
        price: req.body.price,
        picture: req.body.picture,
        tags: req.body.tags
    });
    advertisement.save((err, created) => {
        if (err) {
            console.error('Error creating advertisement', advertisement);
            res.json({
                status: 'error',
                message: 'Error creating advertisement',
                data: advertisement
            });
        }
        console.log('Advertisement created', created);
        res.status(201).json({
            status: 'ok',
            created: created
        });
    });
});
module.exports = router;
