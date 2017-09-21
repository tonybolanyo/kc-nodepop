var express = require('express');
var router = express.Router();

// load mongoose and Advertisement model
const mongoose = require('mongoose');
const Advertisement = mongoose.model('Advertisement');

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: List all used different tags
 *     description: Return an array of strings with all tags in no particular order
 *     operationId: listTags
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: list of tags
 *         schema:
 *           type: array
 *           items: 
 *             type: string
 */
router.get('/', (req, res, next) => {
    Advertisement.distinct('tags', (err, data) => {
        if (err) {
            err.devMessage = err.message;
            err.message = localizedError('CANT_GET_TAGS_LIST');
            next(err);
        }
        res.json({
            tags: data
        });
    });
});

module.exports = router;
