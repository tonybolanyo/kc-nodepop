'use strict';

export default class Translations {

    constructor(defaultLang = 'en') {
        this.defaultLang = defaultLang;
        this.currentLanguage = defaultLang;
        this.locales = ['en', 'es'];
    }

    init() {
        this.loadLocaleJson().then(
            console.log('locale loaded:', this.localeJson)
        ).catch(err =>{
            console.error(err);
        });
    }

    getLocales() {
        return this.locales;
    }

    setCurrentLanguage(locale) {
        if (locale in this.locales) {
            this.currentLanguage = locale;
        } else {
            this.currentLanguage = this.defaultLocale;
        }
    }

    loadLocaleJson() {
        return new Promise(function(resolve, reject) {
            const request = new XMLHttpRequest();
            request.open('GET', '/locales/es');
            request.onload = function() {
                if (request.status === 200) {
                    this.localeJson = JSON.parse(request.response);
                    console.log('RESPONSE------------------------------------', this.localeJson);
                    // If successful, resolve the promise by passing back
                    // the request response
                    resolve(request.response);
                } else {
                    // If it fails, reject the promise with a error message
                    reject(Error('Can\'t load locale; error code:' + request.statusText));
                }
            };
            request.onerror = function() {
                // Also deal with the case when the entire request fails to begin with
                // This is probably a network error, so reject the promise with an appropriate message
                reject(Error('There was a network error.'));
            };
            
            // Send the request
            request.send();
        });
    }

    translate(key) {
        if (key === '') {
            throw new Error('You mus provide a key to translate');
        }
        return '';// this.localeJson[key];
    }

}