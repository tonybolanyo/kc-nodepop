'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const multer = require('multer');

const uploadPath = path.join(__dirname, '..', process.env.NODEPOP_UPLOAD_FOLDER);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadPath);
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;