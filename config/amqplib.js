'use strict';

require('dotenv').config();

const amqplib = require('amqplib');

const url = process.env.AMQP_URL;
const connectionPromise = amqplib.connect(url)
    .catch(err => {
        console.error('[AMQP]', err);
    });

module.exports = connectionPromise;