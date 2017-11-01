const request = require('supertest');
const expect = require('chai').expect;

/*
const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales:['en', 'es'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '..', '..', '/locales'),
    queryParameter: 'lang',
    autoReload: true,
    syncFiles: true,
    register: global,
    cookie: 'lang'
});        
i18n.setLocale('en');
*/

const Mockgoose = require('mockgoose').Mockgoose
const mongoose = require('mongoose');
const mockgoose = new Mockgoose(mongoose);
const mongodbFixtures = require('./mongodb.fixtures');

const endpoint = '/apiv1/advertisements';


describe('GET ' + endpoint, function() {
    
    let app;

    before(function() {
        })

    beforeEach(async function () {
        await mockgoose.prepareStorage();
        mongoose.Promise = global.Promise;
        app = require('../../app');
        await mongoose.connect('mongodb://mockurl/testingDB', {
            useMongoClient: true
        });
        mongoose.models = {};
        mongoose.modelSchemas = {};
        await mongodbFixtures.initAdvertisement();
    });

    it('responds with JSON array of advertisements', function(done) {
        request(app)
            .get(endpoint)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200).end((err, response) => {
                expect(response.body).to.be.a('array');
                expect(response.body.length).to.be.eql(3);
                done();
            });
    });

});
