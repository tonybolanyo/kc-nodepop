'use strict';

require('dotenv').config();

module.exports = {
    mongodb: {
        host: process.env.NODEPOP_DBHOST || '127.0.0.1',
        port: process.env.NODEPOP_DBPORT || '27017',
        user: process.env.NODEPOP_DBUSER || '',
        password: process.env.NODEPOP_DBPASSWORD || '',
        database: 'nodepop'
    }
};