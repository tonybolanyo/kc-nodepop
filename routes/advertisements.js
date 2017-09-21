const express = require('express');
const router = express.Router();
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
 *        - name: price
 *          in: query
 *          description: price range in the format [min. price]-[max. price].
 *          type: string
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
router.get('/', (req, res, next) => {

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const filter = createFilter(req);
    
    const advertisementsQuery = Advertisement.find(filter);

    // add pagination
    advertisementsQuery.skip(offset).limit(limit);

    advertisementsQuery.exec((err, docs) => {
        if (err) {
            err.devMessage = err.message;
            err.message = __('Can\'t get advertisements list');
            next(err);
        }
        console.log('Original URL:', req.originalUrl);
        const nextOffset = offset + limit;
        res.set('Link', req.originalUrl + '?offset=' + nextOffset + '&limit=' + limit);
        res.set('-');
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
router.post('/', (req, res, next) => {
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
            err.devMessage = err.message;
            err.message = __('Can\'t create advertisement');
            next(err);
        }
        console.log(__('Advertisement created'), created);
        res.status(201).json({
            status: 'ok',
            created: created
        });
    });
});

function createFilter(req) {
    const tag = req.query.tag;
    const isSale = req.query.sale;
    const price = req.query.price;

    let filter = {};
    
    if (tag) {
        filter.tags = tag;
    }
    if (isSale) {
        filter.isSale = isSale;
    }
    if (price) {
        if (price.indexOf('-') >= 0) {
            const range = price.split('-');
            const pmin = parseInt(range[0]);
            filter.price = {};
            if (pmin) {
                filter.price.$gte = pmin;
            }
            const pmax = parseInt(range[1]);
            if (pmax) {
                filter.price.$lte = pmax;
            }
        }
    }
    return filter;
}

module.exports = router;
