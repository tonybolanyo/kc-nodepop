// Configure i18n
const i18n = require('i18n');
const path = require('path');

module.exports = function(defaultLocale = 'en') {
    i18n.configure({
        locales:['en', 'es'],
        defaultLocale: defaultLocale,
        directory: path.join(__dirname, '..', '/locales'),
        queryParameter: 'lang',
        autoReload: true,
        syncFiles: true,
        register: global,
        cookie: 'lang'
    });        
    i18n.setLocale(defaultLocale);
    return i18n;
}
