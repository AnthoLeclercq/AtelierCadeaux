require('dotenv').config({ path: '../.env' });

const request = require('supertest')
const assert = require('assert')

const app = require('../index.js');

//#region _REGISTER
//Test POST /register OK
describe('POST /auth/register', function () {
    it('Creates a new user and responds with a success message', function (done) {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'client'
            //address: '123 Test St',
            //city: 'Test City',
            //zipcode: '12345'
        };
        request(app)
            .post('/auth/register')
            .send(newUser)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.data.msg, 'User added with success!');
                assert.strictEqual(typeof res.body.data, 'object', 'Response data should be an object');
                assert.strictEqual(res.body.data.status, 201, 'Response status should indicate success');

                done();
            });
    });
});
//#endregion

//#region _LOGIN
//Test POST /login OK
describe('POST /auth/login', function () {
    it('Login after register and responds with a success message', function (done) {
        const user = {
            email: 'test@example.com',
            password: 'password123'
        };
        request(app)
            .post('/auth/login')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, 'Login with success!', 'User should be logged');
                assert.strictEqual(typeof res.body.data, 'object', 'Response data should be an object');
                assert.strictEqual(res.body.status, 201, 'Response status should indicate success');

                done();
            });
    });
});
//#endregion

//#region _GET_ALL_USERS
// Test GET ALL /user OK
describe('GET /user', function () {
    it('Get all users and responds with a success message', function (done) {
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, 'Get all users with success!', 'Response message should indicate success');
                assert(Array.isArray(res.body.data), 'Response data should be an array');
                assert.strictEqual(res.body.status, 200, 'Response status should indicate success');

                done();
            });
    });
});
//#endregion

//#region _GET_USER_ID
// Test GET /user/:id
describe('GET /user/:id', function () {
    it('Get user details for the given ID', function (done) {
        const userId = 3;
        request(app)
            .get(`/user/${userId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                // Vérifier la structure de la réponse JSON
                assert.strictEqual(res.body.status, 200, 'Response status should indicate success');
                assert.strictEqual(res.body.message, 'Get user with success!', 'Response message should indicate success');
                assert.strictEqual(res.body.data.user_id, userId, 'User ID should match requested ID');

                done();
            });
    });

    it('Get errors for invalid user ID', function (done) {
        const invalidUserId = 999999; // Supposons un ID utilisateur invalide pour les tests
        request(app)
            .get(`/user/${invalidUserId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.status, 404, 'Response status should indicate not found');
                assert.strictEqual(res.body.message, `User with ID ${invalidUserId} not found!`, 'Error message should indicate user not found');

                done();
            });
    });
});
//#endregion

//#region _UNAUTHORIZE_PUT
// Test unauthorize PUT /user/:id
describe('PUT unauthorize /user/:id', function () {
    it('updates the user with the given ID and responds with a unauthrorized message', function (done) {
        const userId = 3;
        const updatedUser = {
            name: 'Updated Test User'
        };
        request(app)
            .put(`/user/${userId}`)
            .send(updatedUser)
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
// Test OK PUT /user/:id
describe('PUT OK /user/:id', function () {
    let authToken;

    before(function (done) {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
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

    it('updates the user with the given ID and responds with a success message', function (done) {
        const userId = 3;
        const updatedUser = {
            name: 'Updated Test User'
        };
        request(app)
            .put(`/user/${userId}`)
            .send(updatedUser)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.status, 200, 'Response status should be a success!');
                assert.strictEqual(res.body.message, `User with ID ${userId} updated successfully`, 'User must be authenticate and admin or update himself');
                assert.strictEqual(res.body.data.user_id, userId, 'User ID should match requested ID');

                done();
            });
    });
});
//#endregion

//#region _UNAUTHORIZE_DELETE
//Test unauthorize DELETE /user/:id
describe('DELETE unauthorize /user/:id', function () {
    it('deletes the user with the given ID and responds with anauthorize message', function (done) {
        const userId = 3;
        request(app)
            .delete(`/user/${userId}`)
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
// Test OK DELETE /user/:id
describe('DELETE OK /user/:id', function () {
    let authToken;

    before(function (done) {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
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

    it('deletes the user with the given ID and responds with a success message', function (done) {
        const userId = 3;
        request(app)
            .delete(`/user/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                //console.log('Response from API:', res.body);

                assert.strictEqual(res.body.message, `User with ID ${userId} deleted successfully`, 'User should be logged and be admin or delete himself');
                assert.strictEqual(res.body.status, 200, 'Response status should indicate success');

                done();
            });
    });
});
//#endregion