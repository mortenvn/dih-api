import { loadFixtures, getAllUserElements } from '../helpers';
import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import app from '../../src/app';
import jwt from 'jsonwebtoken';
import { createJWT } from '../../src/components/auth';

const fixtures = [
    'users',
    'destinations'
];

let dbObjects;

const validJwt = createJWT({ id: 1 });
const validJwtNoUser = createJWT({ id: 1000 });
const invalidJwt = jwt.sign({}, 'invalidsecret');

describe.serial('Account API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllUserElements())
            .then(response => {
                dbObjects = response;
            })
    );

    it('should return AuthenticationError when no jwt is passed', async t => {
        const response = await request(app)
            .get('/account')
            .expect(401);
        t.is(response.body.name, 'AuthenticationError');
        t.is(response.body.message, 'You need to authenicate to access this resource');
    });

    it('should return AuthenticationError when an invalid jwt is passed', async t => {
        const response = await request(app)
            .get('/account')
            .set('Authorization', `Bearer ${invalidJwt}`)
            .expect(401);
        t.is(response.body.name, 'AuthenticationError');
        t.is(response.body.message, 'invalid signature');
    });

    it('should retrieve current jwt user', async t => {
        const response = await request(app)
            .get('/account')
            .set('Authorization', `Bearer ${validJwt}`)
            .expect(200);
        t.is(response.body.email, dbObjects[0].email);
    });

    it('should not be able to retrieve non existing jwt user', async t => {
        const response = await request(app)
            .get('/account')
            .set('Authorization', `Bearer ${validJwtNoUser}`)
            .expect(404);
        t.is(response.body.name, 'ResourceNotFoundError');
        t.is(response.body.message, 'Could not find resource of type user');
    });
});
