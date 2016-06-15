import { loadFixtures } from '../helpers';
import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import app from '../../src/app';

const fixtures = [
    'users'
];

describe('User api', it => {
    it.beforeEach(() => loadFixtures(fixtures));

    it('should reitrieve a list of all users', async t => {
        const response = await request(app)
            .get('/users')
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 3);
    });
});
