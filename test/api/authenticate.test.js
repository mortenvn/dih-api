import { loadFixtures, getAllElements, createValidJWT, validateJwt } from '../helpers';
import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import sinon from 'sinon';
import app from '../../src/app';
import { updateTransport } from '../../src/components/mail';


const fixtures = [
    'users'
];
const URI = '/authenticate';
const password = 'password';
let dbObjects;
let transport;

describe.serial('Authenticate API', it => {
    it.beforeEach(() => {
        transport = {
            name: 'testsend',
            version: '1',
            send(data, callback) {
                callback();
            },
            logger: false
        };
        updateTransport(transport);

        return loadFixtures(fixtures)
            .then(() => getAllElements('User'))
            .then(response => {
                dbObjects = response;
            });
    });

    it('should return 200 and jwt when a user enter correct email / password', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                password,
                email: dbObjects[0].email
            })
            .expect(200)
            .then(res => res.body);

        t.pass(response.jwt);
    });

    it('the jwt should contain all the information about the user', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                password,
                email: dbObjects[0].email
            })
            .expect(200)
            .then(res => validateJwt(res.body.jwt));

        t.notDeepEqual(dbObjects[0], response);
    });

    it('Should return an error informing that both email and password is needed', async t => {
        const response = await request(app)
            .post(URI)
            .send({ password })
            .expect(400)
            .then(res => res.body);

        t.is(response.name, 'ValidationError');
        t.is(response.message, 'Authentication requires email and password');
    });

    it('Should return an authentication error if wrong password', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                password: 'incorrectpassword',
                email: dbObjects[0].email
            })
            .expect(401)
            .then(res => res.body);


        t.is(response.name, 'AuthenticationError');
        t.is(response.message, 'Invalid credentials provided');
    });

    it('Should return an authentication error if the user is not found', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                password,
                email: 'incorrect@email.com'
            })
            .expect(401)
            .then(res => res.body);

        t.is(response.name, 'AuthenticationError');
        t.is(response.message, 'Invalid credentials provided');
    });

    it('should return 200 and jwt when a user enter correct email / password', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                password,
                email: dbObjects[0].email
            })
            .expect(200)
            .then(res => res.body);

        t.pass(response.jwt);
    });

    it('should return 400 not a valid token', async t => {
        const response = await request(app)
            .post(`${URI}/password`)
            .set('Authorization', `Bearer ${createValidJWT(dbObjects[0])}`)
            .send({})
            .expect(400)
            .then(res => res.body);

        t.is(response.name, 'ValidationError');
        t.is(response.message, 'Token not valid');
    });

    it('should return 400 not a valid token', async t => {
        const token = createValidJWT({ ...dbObjects[0], setPassword: true });
        const response = await request(app)
            .post(`${URI}/password`)
            .set('Authorization', `Bearer ${token}`)
            .send({})
            .expect(400)
            .then(res => res.body);

        t.is(response.name, 'ValidationError');
        t.is(response.message, 'not a valid password');
    });

    it('should update the password and return a jwt', async t => {
        const token = createValidJWT({ ...dbObjects[0], setPassword: true });
        const response = await request(app)
            .post(`${URI}/password`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password })
            .expect(200)
            .then(res => res.body);

        t.pass(response.jwt);
    });

    it('should update the password and return a jwt', async t => {
        const token = createValidJWT({ ...dbObjects[0], setPassword: true });
        const response = await request(app)
            .post(`${URI}/password`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password })
            .expect(200)
            .then(res => validateJwt(res.body.jwt));

        t.notDeepEqual(dbObjects[0], response);
    });

    it('should update the password and return a jwt', async t => {
        const response = await request(app)
            .post(`${URI}/password`)
            .send({ password })
            .expect(401)
            .then(res => res.body);

        t.is(response.name, 'AuthenticationError');
        t.is(response.message, 'You need to authenicate to access this resource');
    });

    it('should send an reset passwor email to user', async t => {
        sinon.stub(transport, 'send').yields(null);
        await request(app)
            .put(`${URI}/password`)
            .send({ email: dbObjects[0].email })
            .expect(200);
        t.is(transport.send.callCount, 1);
    });

    it('should return a 404', async () => {
        await request(app)
            .put(`${URI}/password`)
            .send({ email: 'kyle@example.com' })
            .expect(404);
    });
});
