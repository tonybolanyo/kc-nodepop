'use strict';

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

class AdvertisementController {
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
    get(req, res, next) {

        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const filter = Advertisement.createFilter(req);
        
        Advertisement.getList(filter, offset, limit).then(items => {
            res.json(items);
        }).catch(err => {
            err.devMessage = err.message;
            err.message = __('Can\'t get advertisements list');
            next(err);
            return;
        });
    }

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
    async post (req, res, next) {
        const advertisement = new Advertisement(req.body);
        advertisement.picture = req.file.filename;
        let created;
        try {
            created = await advertisement.save();
        } catch(err) {
            err.devMessage = err.message;
            err.message = __('Can\'t create advertisement');
            next(err);
            return;
        }
        res.status(201).json({
            status: 'ok',
            created: created
        });
    }
}


module.exports = new AdvertisementController();
