require('dotenv').config();

const path = require('path');

const jimp = require('jimp');

const resize = async function(file, folder) {
    const maxWidth = 550;
    const maxHeight = 550;

    const uploadFolderName = process.env.NODEPOP_UPLOAD_FOLDER || 'uploads';
    const srcFolder = folder || path.join(__dirname, '..', uploadFolderName); 
    const srcFile = path.join(srcFolder, file);
    
    const thumbsFolder = path.join(__dirname, '..', 'public', 'images', 'advertisements');
    const dstFile = path.join(thumbsFolder, file);
    
    console.log('\nCreating thumbnail:');
    console.log('  - src:', srcFile);
    console.log('  - dst:', dstFile);
    
    try {
        const img = await jimp.read(srcFile);
        img.cover(maxWidth, maxHeight) // resize
            //.quality(60)              // set JPEG quality
            .write(dstFile);            // save
    } catch(err) {
        console.error(err);
        throw new Error('Error creating thumbnail');
    }
};

module.exports = resize;