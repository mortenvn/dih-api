import { loadFixtures } from '../helpers';
import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import app from '../../src/app';

const fixtures = [
    'users'
];

describe('User api', it => {
    it.beforeEach(() => loadFixtures(fixtures));

    it.serial('should reitrieve a list of all users', async t => {
        const response = await request(app)
            .get('/users')
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 3);
    });

    it.serial('should add a new user', async t => {
        const response = await request(app)
            .post('/users')
            .send({
                email: 'eric@example.com',
                firstname: 'Eric',
                lastname: 'Cartman',
                birth: '1990-07-01T12:42:00.196Z',
                role: 'USER'
            })
            .expect(201);

        t.is(response.body.email, 'eric@example.com');
    });

    it.serial('should set USER as standard role when noe given', async t => {
        const response = await request(app)
            .post('/users')
            .send({
                email: 'kyle@example.com',
                firstname: 'Kyle',
                lastname: 'Broflovski',
                birth: '1999-07-01T12:42:00.196Z'
            })
            .expect(201);

        t.is(response.body.role, 'USER');
    });

    it.serial('should not add a new user without valid email', async t => {
        const response = await request(app)
            .post('/users')
            .send({
                email: 'eric.example.com',
                firstname: 'Eric',
                lastname: 'Cartman',
                birth: '1990-07-01T12:42:00.196Z',
                role: 'USER'
            })
            .expect(400);

        t.is(response.body.message, 'Validation isEmail failed');
    });

    it.serial('should not add a new user with duplicate email', async t => {
        const response = await request(app)
            .post('/users')
            .send({
                email: 'user@test.test',
                firstname: 'User',
                lastname: 'Test',
                birth: '1999-07-01T12:42:00.196Z',
                role: 'USER'
            })
            .expect(400);

        t.is(response.body.message, 'email must be unique');
    });
});
