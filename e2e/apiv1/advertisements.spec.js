const request = require('supertest');
const expect = require('chai').expect;

// before load mongoose we must configure i18n
// because we use i18n to translate validation messages
const i18n = require('../../config/i18n')();

const Mockgoose = require('mockgoose').Mockgoose
const mongoose = require('mongoose');
const mockgoose = new Mockgoose(mongoose);
const mongodbFixtures = require('./mongodb.fixtures');

const endpoint = '/apiv1/advertisements';

let app;

describe('GET ' + endpoint, function() {
    
    
    // Since we aren't going to modify database in any test case
    // we can preserve database between tests
    before(async function () {
        await mockgoose.prepareStorage();
        mongoose.Promise = global.Promise;
        await mongoose.connect('mongodb://mockurl/testingDB', {
            useMongoClient: true
        });
        app = require('../../app');
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

    it('can filter by tag', function(done) {
        const url = endpoint + '?tag=lifestyle';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('can filter by name (containing a word)', function(done) {
        const url = endpoint + '?name=phone';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(1);
                done();
            });
    });

    it('can filter by sale flag', function(done) {
        const url = endpoint + '?sale=true';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(1);
                done();
            });
    });
    it('can filter by sale flag false', function(done) {
        const url = endpoint + '?sale=false';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('can filter by price (min)', function(done) {
        const url = endpoint + '?price=20-';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('can filter by price (max)', function(done) {
        const url = endpoint + '?price=-200';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('can filter by price (range)', function(done) {
        const url = endpoint + '?price=20-100';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(1);
                done();
            });
    });

    it('can filter by price (equal)', function(done) {
        const url = endpoint + '?price=15.5';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(1);
                done();
            });
    });

    it('can paginate, first page', function(done) {
        const url = endpoint + '?limit=2';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('can paginate, second page', function(done) {
        const url = endpoint + '?offset=2&limit=2';
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(1);
                done();
            });
    });

});
