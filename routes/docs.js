var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res, next) {
    // Allow the docs.html template to 'include' markdown files
    var marked = require('marked');

    var md = function (filename) {
        var path = __dirname + '/../views/docs/' + filename;
        var include = fs.readFileSync(path, 'utf8');
        var html = marked(include);

        return html;
    };

    res.render('docs', {
        'md': md,
        title: 'Nodepop'
    });
});

module.exports = router;