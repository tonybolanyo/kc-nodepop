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
 *   CustomError:
 *     properties:
 *       status:
 *         description: status code (422)
 *         type: integer
 *       message:
 *         description: general validation message
 *         type: string
 *   ValidationError:
 *     properties:
 *       status:
 *         description: status code (422)
 *         type: integer
 *       message:
 *         description: general validation message
 *         type: string
 *       errors:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             field:
 *               description: field name
 *               type: string
 *             message:
 *               description: error message
 *               type: string
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
 *          description: 
 *            filter by first characters of name (case insensitive)
 *          required: false
 *          type: string
 *        - name: tag
 *          in: query
 *          description:
 *            filter by tag. You can use multiple tag params to specify multiple
 *            tag values. Results must contain articles with *ALL* tags (*and* operator).
 *          required: false
 *          type: array
 *          items:
 *            type: string
 *          collectionFormat: multi
 *        - name: sale
 *          in: query
 *          description: 
 *            filter by sale/search. Use sale=true for sale and sale=false for buy
 *          required: false
 *          type: boolean
 *        - name: price
 *          in: query
 *          description:
 *            price range in the format [min. price]-[max. price].
 *            You can use *price=XX* to find articles which *EXACT* price is *XX*.
 *          required: false
 *          type: string
 *        - name: offset
 *          in: query
 *          description:
 *            offset number of records for pagination. If you don't pass any offset
 *            value, API asumes value 0, i.e., from the very first article.
 *          required: false
 *          default: 0
 *          type: integer
 *        - name: limit
 *          in: query
 *          description:
 *            maximum records for each page in pagination.
 *          default: 10
 *          required: false
 *          type: integer
 *      responses:
 *        '200':
 *          description: list of advertisements
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/definitions/Advertisement'
 *        '500':
 *          description: any server related error when querying database
 *          schema:
 *            $ref: '#/definitions/CustomError'
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
 *           $ref: '#/definitions/ValidationError'
 */
router.post('/', async (req, res, next) => {
    const advertisement = new Advertisement(req.body);
    let created;
    try {
        created = await advertisement.save();
    } catch(err) {
        err.devMessage = err.message;
        err.message = __('Can\'t create advertisement');
        next(err);
        return;
    };
    console.log(__('Advertisement created'), created);
    res.status(201).json({
        status: 'ok',
        created: created
    });
});

/**
 * Helper function to create filter for query advertisement coollection
 * from query parameters.
 * Accepted tags: tag, sale, price, name.
 * See API documentation at http://<server_domain>:<server_port>/docs/api for details.
 * @param {*} req The request
 */
function createFilter(req) {
    const tag = req.query.tag;
    const isSale = req.query.sale;
    const price = req.query.price;
    const name = req.query.name;

    let filter = {};
    
    if (tag) {
        // must have ALL tags
        filter.tags = {$all: tag};
    }
    if (isSale) {
        // true for sale, false for buy
        filter.isSale = isSale;
    }
    if (price) {
        // price range can be <min>-<max>
        // if no min or max specified then from 0 or no max limit
        // if proce has no -, then find exact price value
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
        // first letters of name, case insensitive
        filter.name = new RegExp('^' + name, 'i');
    }
    return filter;
}

module.exports = router;
