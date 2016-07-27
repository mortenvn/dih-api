import { getAllElements, loadFixtures } from '../helpers';
import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import { updateTransport } from '../../src/components/mail';
import app from '../../src/app';

let transport;
const fixtures = [
    'users'
];

const URI = '/users';

let dbObjects;

describe.serial('User API', it => {
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

    it('should reitrieve a list of all users', async t => {
        const response = await request(app)
            .get(URI)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 3);
    });

    it('should return a single existing user', async t => {
        const fixture = dbObjects[0];
        const response = await request(app)
            .get(`${URI}/${fixture.id}`)
            .expect(200);
        t.is(response.body.email, fixture.email);
    });

    it('should return ResourceNotFound when retrieving nonexisting user', async t => {
        const fixture = dbObjects[0];
        const response = await request(app)
            .get(`${URI}/${fixture.id + 10000}`)
            .expect(404);
        t.is(response.body.name, 'ResourceNotFoundError');
        t.is(response.body.message, 'Could not find resource of type user');
    });

    it('should add a new user', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                email: 'eric@example.com',
                firstname: 'Eric',
                lastname: 'Cartman',
                role: 'USER'
            })
            .expect(201);

        t.is(response.body.email, 'eric@example.com');
    });

    it('should set USER as standard role when noe given', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                email: 'kyle@example.com',
                firstname: 'Kyle',
                lastname: 'Broflovski'
            })
            .expect(201);

        t.is(response.body.role, 'USER');
    });

    it('should not add a new user without valid email', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                email: 'eric.example.com',
                firstname: 'Eric',
                lastname: 'Cartman',
                role: 'USER'
            })
            .expect(400);

        t.is(response.body.message, 'Validation isEmail failed');
    });

    it('should not add a new user with duplicate email', async t => {
        const response = await request(app)
            .post(URI)
            .send({
                email: 'test-user@dih.capra.me',
                firstname: 'User',
                lastname: 'Test',
                role: 'USER'
            })
            .expect(400);

        t.is(response.body.message, 'email must be unique');
    });
});
