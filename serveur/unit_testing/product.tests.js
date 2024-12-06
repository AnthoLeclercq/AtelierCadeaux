require('dotenv').config({ path: '../.env' });

const request = require('supertest')
const assert = require('assert')

const app = require('../index.js');

//#region _REGISTER
//Test POST /product/artisan_id OK
describe('POST /product/:artisan_id', function () {
    let authToken;

    before(function (done) {
        const credentials = {
            email: 'test@gmail.com',
            password: 'test'
        };
        request(app)
            .post('/auth/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) return done(err);
                //console.log('Response from API:', res.body);
                authToken = res.body.data.token;
                done();
            });
    });

    it('create product with the given artisan_id and responds with a success message', function (done) {
        const artisanId = "5"; //adapt if int or string
        const createProduct = {
            artisan_id: artisanId,
            name: "Ananas",
            description: "bio",
            price: 2,
            category: "fruit",
            sub_category: "tropical"
        };
        request(app)
            .post(`/product/${artisanId}`)
            .send(createProduct)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.status, 201, 'Response status should be a success!');
                assert.strictEqual(res.body.message, `Product added with success!`, 'User must be authenticate and admin or an artisan who create himself the product');
                assert.strictEqual(res.body.data.artisan_id, artisanId, 'Artisan ID must match requested ID');

                done();
            });
    });
});
//#endregion

//#region _GET_ALL_PRODUCTS
// Test GET ALL /product OK
describe('GET /product', function () {
    it('Get all users and responds with a success message', function (done) {
        request(app)
            .get('/product')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, 'Get all products with success!', 'Response message should indicate success');
                assert(Array.isArray(res.body.data), 'Response data should be an array');
                assert.strictEqual(res.body.status, 200, 'Response status should indicate success');

                done();
            });
    });
});
//#endregion

//#region _GET_PRODUCT_ID
// Test GET /product/:id
describe('GET /product/:id', function () {
    it('Get user details for the given ID', function (done) {
        const productId = 6;
        request(app)
            .get(`/product/${productId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.status, 200, 'Response status should indicate success');
                assert.strictEqual(res.body.message, 'Get product with success!', 'Response message should indicate success');
                assert.strictEqual(res.body.data.product_id, productId, 'Product ID should match requested ID');

                done();
            });
    });

    it('Get errors for invalid user ID', function (done) {
        const productId = 999999;
        request(app)
            .get(`/product/${productId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.status, 404, 'Response status should indicate not found');
                assert.strictEqual(res.body.message, `Product not found!`, 'Error message should indicate product not found');

                done();
            });
    });
});
//#endregion

//#region _UNAUTHORIZE_PUT
// Test unauthorize PUT /product/:id
describe('PUT unauthorize /product/:id', function () {
    it('updates the product with the given ID and responds with a unauthrorized message', function (done) {
        const productId = 6;
        const updatedProduct = {
            name: 'Updated Bananaaaa'
        };
        request(app)
            .put(`/product/${productId}`)
            .send(updatedProduct)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, `Authorization token missing`, 'User must be authenticate and admin or update himself');

                done();
            });
    });
});
//#endregion 

//#region _PUT_OK
// Test OK PUT /product/:id
describe('PUT OK /product/:id', function () {
    let authToken;

    before(function (done) {
        const credentials = {
            email: 'test@gmail.com',
            password: 'test'
        };
        request(app)
            .post('/auth/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) return done(err);
                //console.log('Response from API:', res.body);
                authToken = res.body.data.token;
                done();
            });
    });

    it('updates the product with the given ID and responds with a success message', function (done) {
        const productId = 7;
        const updatedProduct = {
            description: 'Updated Pokitooooo'
        };
        request(app)
            .put(`/product/${productId}`)
            .send(updatedProduct)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.status, 200, 'Response status should be a success!');
                assert.strictEqual(res.body.message, `Product with ID ${productId} updated successfully`, 'Must be authenticated and admin or creator of the product');
                assert.strictEqual(res.body.data.product_id, productId, 'Product ID should match requested ID');

                done();
            });
    });
});
//#endregion

//#region _UNAUTHORIZE_DELETE
//Test unauthorize DELETE /product/:id
describe('DELETE unauthorize /product/:id', function () {
    it('deletes the user with the given ID and responds with anauthorize message', function (done) {
        const productId = 6;
        request(app)
            .delete(`/product/${productId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, `Authorization token missing`, 'User must be authenticate and admin or update himself');

                done();
            });
    });
});
//#endregion

//#region _DELETE_OK
// Test OK DELETE /product/:id
describe('DELETE OK /product/:id', function () {
    let authToken;

    before(function (done) {
        const credentials = {
            email: 'test@gmail.com',
            password: 'test'
        };
        request(app)
            .post('/auth/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) return done(err);
                //console.log('Response from API:', res.body);
                authToken = res.body.data.token;
                done();
            });
    });

    it('deletes the product with the given ID and responds with a success message', function (done) {
        const productId = 6;
        request(app)
            .delete(`/product/${productId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, `Product with ID ${productId} deleted successfully`, 'User should be logged and be admin or delete himself');
                assert.strictEqual(res.body.status, 200, 'Response status should indicate success');

                done();
            });
    });
});
//#endregion