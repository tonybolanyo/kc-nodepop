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
 *         type: array
 *         items: 
 *           description: Must be one of 'work', 'mobile', 'motor', 'lifestyle'
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
 *        - name: name
 *          in: query
 *          description: filter by first characters of name
 *          required: false
 *          type: string
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
 *          required: false
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
 *          default: 10
 *          required: false
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
    
    Advertisement.getList(filter, offset, limit).then(items => {
        res.json(items);
    }).catch(err => {
        err.devMessage = err.message;
        err.message = __('Can\'t get advertisements list');
        next(err);
        return;
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
 *           properties:
 *             name:
 *               description: name of the article to sale or search.
 *               type: string
 *             isSale:
 *               description: true for sale / false for search.
 *               type: boolean
 *             price:
 *               description: in sales, price to sale. In search, max. price
 *               type: number
 *             picture:
 *               description: filename of advertisement picture
 *               type: string
 *             tags:
 *               type: array
 *               items: 
 *                 description: Must be one of 'work', 'mobile', 'motor', 'lifestyle'
 *                 type: string
 *     responses:
 *       201:
 *         description: advertisement succesfully created
 *         schema:
 *           $ref: '#/definitions/Advertisement'
 *       422:
 *         description: validation error, advertisemment not created
 *         schema:
 *           properties:
 *             status:
 *               description: status code (422)
 *               type: integer
 *             message:
 *               description: general validation message
 *               type: string
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     description: field name
 *                     type: string
 *                   message:
 *                     description: error message
 *                     type: string
 */
router.post('/', (req, res, next) => {
    const advertisement = new Advertisement(req.body);
    advertisement.save((err, created) => {
        if (err) {
            err.devMessage = err.message;
            err.message = __('Can\'t create advertisement');
            next(err);
            return;
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
    const name = req.query.name;

    let filter = {};
    
    if (tag) {
        filter.tags = {$all: tag};
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
        } else {
            filter.price = parseInt(price);
        }
    }
    if (name) {
        filter.name = new RegExp('^' + name, 'i');
    }
    return filter;
}

module.exports = router;
