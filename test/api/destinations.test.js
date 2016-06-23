import { loadFixtures, getAllElements } from '../helpers';
import { describe } from 'ava-spec';
import _ from 'lodash';
import request from 'supertest-as-promised';
import app from '../../src/app';

const fixtures = [
    'users',
    'destinations'
];

const mockDest = { name: 'AdaNora' };
let dbObjects;

describe.serial('Destination API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllElements('Destination'))
            .then(response => {
                dbObjects = response;
            })
    );

    it('should retrieve a list of all destinations', async t => {
        const response = await request(app)
            .get('/destinations')
            .expect(200)
            .then(res => res.body);
        t.is(response.length, dbObjects.length);
    });

    it('should be able to create a new destination ', async t => {
        const response = await request(app)
            .post('/destinations')
            .send(mockDest)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDest.name);
    });

    it('should not be able to create a new destination with no name ', async () => {
        const mockEmptyString = mockDest;
        mockEmptyString.name = '';
        return await request(app)
            .post('/destinations', mockEmptyString)
            .expect(400);
    });


    it('should be able to update a destination with a new name', async t => {
        const fixture = dbObjects[0];
        const changedFixture = fixture;
        changedFixture.name = 'changedName';
        const response = await request(app)
            .put(`/destinations/${fixture.id}`)
            .send(changedFixture)
            .expect(204)
            .then(() => request(app).get('/destinations'))
            .then(res => _.find(res.body, obj => obj.id === fixture.id));
        t.is(response.name, changedFixture.name);
    });

    it('should not be able to update destinations that does not exist', async () => {
        await request(app)
            .put('/destinations/100')
            .send(mockDest)
            .expect(404);
    });

    it('should be able to delete a destination', async t => {
        const response = await request(app)
            .delete(`/destinations/${dbObjects[0].id}`)
            .expect(200)
            .then(() => request(app).get('/destinations'))
            .then(res => res.body);
        t.is(response.length, dbObjects.length - 1);
    });

    it('should return 404 when you try to delete an item that does not exist', async () => {
        await request(app)
            .delete('/destinations/100')
            .expect(404);
    });
});
