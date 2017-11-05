'use strict';

require('dotenv').config();

const amqpConnection = require('../config/amqplib');
const queueName = process.env.NODEPOP_THUMB_QUEUE || 'resize';

const sendToQueue = async function (picture) {
    const conn = await amqpConnection;
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, {
        durable: true
    });
    const result = channel.sendToQueue(queueName, new Buffer(picture), {
        persistent: true
    });
    if (result) {
        console.log('Picture queued for resize');
    } else {
        console.log('Queue error! You must resize image manually!');
    }
};

module.exports.sendToQueue = sendToQueue;