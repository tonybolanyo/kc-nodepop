'use strict';

require('dotenv').config();

module.exports = {
    mongodb: {
        host: process.env.NODEPOP_DBHOST || '127.0.0.1',
        port: process.env.NODEPOP_PORT || '27017',
        database: 'nodepop'
    }
};