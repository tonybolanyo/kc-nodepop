const request = require('supertest');
const expect = require('chai').expect;

// before load mongoose we must configure i18n
// because we use i18n to translate validation messages
require('../../config/i18n')();

const Mockgoose = require('mockgoose').Mockgoose;
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

describe('POST ' + endpoint, function() {
    
    let token = null;
    let agent;

    before(async function() {
        await mockgoose.prepareStorage();
        mongoose.Promise = global.Promise;
        await mongoose.connect('mongodb://mockurl/testingDB', {
            useMongoClient: true
        });
        app = require('../../app');
        mongoose.models = {};
        mongoose.modelSchemas = {};
        await mongodbFixtures.initUsers();
        agent = request.agent(app);
        agent
            .post('/apiv1/login')
            .send({ email: 'user@example.com', password: '1234' })
            .expect(200)
            .then((res) => {
                token = res.body.token;
            }).catch(err => {
                console.log('/apiv1/login error\n', err);
            });
    });

    it('should reject request when user is not authenticated', function(done) {
        const newAdvertisement = {
            name: 'Mobile phone repairing kit',
            price: 30.00,
            isSale: false,
            picture: 'mobile-phone-2510529_640.jpg',
            tags: ['work', 'mobile']
        };
        agent
            .post(endpoint)
            .send(newAdvertisement)
            .expect(403, done);
    });

    it('should create a new advertisement', function(done) {
        const newAdvertisement = {
            name: 'Mobile phone repairing kit',
            price: 30.00,
            isSale: false,
            picture: 'mobile-phone-2510529_640.jpg',
            tags: ['work', 'mobile']
        };
        agent
            .post(endpoint)
            .set('x-access-token', token)
            .send(newAdvertisement)
            .expect(201)
            .end((err, res) => {
                console.log(res);
                expect(res.body.status).to.be.eql('ok');
                expect(res.body.created).to.have.property('_id');
                done();
            });
    });

    it('should fail if no name provided', function(done) {
        const newAdvertisement = {
            price: 30.00,
            isSale: false,
            picture: 'mobile-phone-2510529_640.jpg',
            tags: ['work', 'mobile']
        };
        agent
            .post(endpoint)
            .set('x-access-token', token)
            .send(newAdvertisement)
            .expect(422)
            .end((err, res) => {
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.a('array');
                expect(res.body.errors[0]).to.have.property('field');
                expect(res.body.errors[0].field).to.be.eql('name');
                done();
            });
    });

    it('should fail if no isSale value provided', function(done) {
        const newAdvertisement = {
            name: 'Mobile phone repairing kit',
            price: 30.00,
            picture: 'mobile-phone-2510529_640.jpg',
            tags: ['work', 'mobile']
        };
        agent
            .post(endpoint)
            .set('x-access-token', token)
            .send(newAdvertisement)
            .expect(422)
            .end((err, res) => {
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.a('array');
                expect(res.body.errors[0]).to.have.property('field');
                expect(res.body.errors[0].field).to.be.eql('isSale');
                done();
            });
    });

    it('should fail if no price value provided', function(done) {
        const newAdvertisement = {
            name: 'Mobile phone repairing kit',
            isSale: false,
            picture: 'mobile-phone-2510529_640.jpg',
            tags: ['work', 'mobile']
        };
        agent
            .post(endpoint)
            .set('x-access-token', token)
            .send(newAdvertisement)
            .expect(422)
            .end((err, res) => {
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.a('array');
                expect(res.body.errors[0]).to.have.property('field');
                expect(res.body.errors[0].field).to.be.eql('price');
                done();
            });
    });
});