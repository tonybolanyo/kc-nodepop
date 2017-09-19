const express = require('express');
const router = express.Router();
const logger = require('morgan');
const mongoose = require('mongoose');
const Advertisement = mongoose.model('Advertisement');

/**
 * @swagger
 * definitions:
 *   Advertisement:
 *     properties:
 *       _id:
 *         description: ObjectId
 *         type: string
 *       name:
 *         description: name of the article to sale or search.
 *         type: string
 *       isSale:
 *         description: true for sale / false for search.
 *         type: boolean
 *       price:
 *         description: in sales, price to sale. In search, max. price
 *         type: number
 *       picture:
 *         description: filename of advertisement picture
 *         type: string
 *       tags:
 *         description: array of tags. Must be one of work, mobile, motor, lifestyle
 *         type: array
 *         items: 
 *           type: string
 */

/**
 * @swagger
 * /advertisements:
 *   get:
 *      description: Returns a list of advertisements
 *      summary: List advertisements
 *      operationId: getAdvertisements
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: tag
 *          in: query
 *          description: filter by tag
 *          required: false
 *          type: array
 *          items:
 *            type: string
 *          collectionFormat: multi
 *        - name: sale
 *          in: query
 *          description: filter by sale/search
 *          required: false
 *          type: boolean
 *        - name: offset
 *          in: query
 *          description: offset number of records for pagination
 *          required: false
 *          default: 0
 *          type: integer
 *        - name: limit
 *          in: query
 *          description: maximum records for each page in pagination
 *          default: 6
 *          type: integer
 *      responses:
 *          '200':
 *              description: list of advertisements
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Advertisement'
 */
router.get('/', (req, res) => {
    const tag = req.query.tag;
    const isSale = req.query.sale;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    let filter = {}
    if (tag) {
        filter.tags = tag;
    }
    if (isSale) {
        filter.isSale = isSale;
    }
    console.log(req.query);
    const advertisementsQuery = Advertisement.find(filter);

    // add pagination
    advertisementsQuery.skip(offset).limit(limit);

    advertisementsQuery.exec((err, docs) => {
        if (err) {
            console.error("Can't retrieve list of advertisements", err);
            res.json({
                error: "Can't retrieve advertisements",
                errorDetails: err
            });
        }
        console.log("advertisements count", docs.length);
        res.json(docs);

    });
});

/**
 * @swagger
 * /advertisements:
 *   post:
 *     summary: Create a new advertisement
 *     operationId: createAdvertisement
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: advertisement
 *         description: advertisement object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Advertisement'
 *     responses:
 *       201:
 *         description: advertisement succesfully created
 */
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
