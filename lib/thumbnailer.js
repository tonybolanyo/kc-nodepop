'use strict';

require('dotenv').config();

const fse = require('fs-extra');
const path = require('path');

const amqpConnection = require('../config/amqplib');
const queueName = process.env.NODEPOP_THUMB_QUEUE || 'resize';

const resize = require('./resize');

(async () => {
    const thumbsFolder = path.join(__dirname, '..', 'public', 'images', 'advertisements');
    // check if thumbs folder exists
    // and creates it if not exists
    await fse.ensureDir(thumbsFolder);
    
    const conn = await amqpConnection;
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName);
    channel.prefetch(1);
    console.info('[THUMB] Waiting messages...');

    await channel.consume(queueName, function(msg) {
        const filename = msg.content.toString();
        console.log('recibido', filename);
        resize(filename);
        channel.ack(msg);
    });
})().catch(err => console.error('[THUMB]', err));