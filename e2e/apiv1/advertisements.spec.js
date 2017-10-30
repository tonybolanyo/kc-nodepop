const request = require('supertest');

const Mockgoose = require('mockgoose').Mockgoose
const mongoose = require('mongoose');
const mockgoose = new Mockgoose(mongoose);


const endpoint = '/apiv1/advertisements';


describe('GET ' + endpoint, function() {
    
    let app;

    beforeEach(async function () {
        await mockgoose.prepareStorage();
        mongoose.Promise = global.Promise;
        await mongoose.connect('mongodb://mockurl/testingDB', {
            useMongoClient: true
        });
        app = require('../../app');
        mongoose.models = {};
        mongoose.modelSchemas = {};
    });

    it('respond with JSON', function(done) {
        request(app)
        .get(endpoint)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

});
