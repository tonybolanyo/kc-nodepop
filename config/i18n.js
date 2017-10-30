// Configure i18n
const i18n = require('i18n');
const path = require('path');

module.exports = function() {
    i18n.configure({
        locales:['en', 'es'],
        defaultLocale: 'en',
        directory: path.join(__dirname, '..', '/locales'),
        queryParameter: 'lang',
        autoReload: true,
        syncFiles: true,
        register: global,
        cookie: 'lang'
    });        
    i18n.setLocale('en');
    return i18n;
}
