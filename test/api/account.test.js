import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import { loadFixtures, getAllElements, createValidJWT, createInvalidJWT } from '../helpers';
import app from '../../src/app';

const fixtures = [
    'users'
];

const URI = '/account';

let dbObjects;

describe.serial('Account API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllElements('User'))
            .then(response => {
                dbObjects = response;
            })
    );

    it('should return AuthenticationError when no jwt is passed', async t => {
        const response = await request(app)
            .get(URI)
            .expect(401);
        t.is(response.body.name, 'AuthenticationError');
        t.is(response.body.message, 'You need to authenicate to access this resource');
    });

    it('should return AuthenticationError when an invalid jwt is passed', async t => {
        const invalidJwt = createInvalidJWT({ id: 1 });

        const response = await request(app)
            .get(URI)
            .set('Authorization', `Bearer ${invalidJwt}`)
            .expect(401);
        t.is(response.body.name, 'AuthenticationError');
        t.is(response.body.message, 'invalid signature');
    });

    it('should retrieve current jwt user', async t => {
        const validJwt = createValidJWT(dbObjects[0]);

        const response = await request(app)
            .get(URI)
            .set('Authorization', `Bearer ${validJwt}`)
            .expect(200);
        t.is(response.body.email, dbObjects[0].email);
    });

    it('should not be able to retrieve non existing jwt user', async t => {
        const validJwtNoUser = createValidJWT({ id: 1000 });

        const response = await request(app)
            .get(URI)
            .set('Authorization', `Bearer ${validJwtNoUser}`)
            .expect(404);
        t.is(response.body.name, 'ResourceNotFoundError');
        t.is(response.body.message, 'Could not find resource of type user');
    });

    it('should update the password of the current user', async () => {
        const validJwt = createValidJWT(dbObjects[0]);
        await request(app)
            .put(URI)
            .send({ password: '1234password' })
            .set('Authorization', `Bearer ${validJwt}`)
            .expect(204);
    });
});
