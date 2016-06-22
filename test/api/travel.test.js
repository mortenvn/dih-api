import { loadFixtures, getAllElements } from '../helpers';
import { describe } from 'ava-spec';
import _ from 'lodash';
import request from 'supertest-as-promised';
import app from '../../src/app';

const fixtures = [
    'users',
    'destinations',
    'travels'
];

const URI = '/travels';
let travelObjects;
let userObjects;
let destinationObjects;
const mockTravel = { status: 'PENDING' };

describe.serial('Travel API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllElements('Travel'))
            .then(response => {
                travelObjects = response;
            })
            .then(() => getAllElements('Destination'))
            .then(response => {
                destinationObjects = response;
            })
            .then(() => getAllElements('User'))
            .then(response => {
                userObjects = response;
            })
            .then(() => {
                mockTravel.userId = userObjects[1].id;
                mockTravel.destinationId = destinationObjects[1].id;
            })
    );

    it('should retrieve a list of all travels', async t => {
        const response = await request(app)
            .get(URI)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, travelObjects.length);
    });

    it('should be able to create a new travel ', async t => {
        const response = await request(app)
            .post(URI)
            .send(mockTravel)
            .expect(201)
            .then(res => res);
        t.is(response.body.status, mockTravel.status);
    });

    it('should not be able to create a new travel with missing fields ', async () => {
        const mockWithEmptyStatus = mockTravel;
        const mockWithEmptyUser = mockTravel;
        const mockWithEmptyDestination = mockTravel;
        delete mockWithEmptyStatus.status;
        delete mockWithEmptyUser.userId;
        delete mockWithEmptyDestination.destinationId;
        await request(app)
            .post(URI, mockWithEmptyStatus)
            .expect(400);
        await request(app)
            .post(URI, mockWithEmptyUser)
            .expect(400);
        await request(app)
            .post(URI, mockWithEmptyDestination)
            .expect(400);
    });

    it('should be able to update a travel with a valid new status', async t => {
        const fixture = travelObjects[0];
        const changedFixture = fixture;
        changedFixture.status = 'ACCEPTED';
        const validRequestResponse = await request(app)
            .put(`${URI}/${fixture.id}`)
            .send(changedFixture)
            .expect(204)
            .then(() => request(app).get(URI))
            .then(res => _.find(res.body, obj => obj.id === fixture.id));
        t.is(validRequestResponse.status, changedFixture.status);
    });

    it('should not be able to update a travel with an invalid status', async () => {
        const fixture = travelObjects[0];
        const invalidChangedFixture = fixture;
        invalidChangedFixture.status = 'kek';
        await request(app)
            .put(`${URI}/${fixture.id}`)
            .send(invalidChangedFixture)
            .expect(400);
    });

    it('should return 404 when you try to update a travel that does not exist', async () => {
        await request(app)
            .put(`${URI}/${travelObjects.length + 100}`)
            .send(mockTravel)
            .expect(404);
    });

    it('should be able to delete a travel', async t => {
        const response = await request(app)
            .delete(`${URI}/${travelObjects[0].id}`)
            .expect(200)
            .then(() => request(app).get(URI))
            .then(res => res.body);
        t.is(response.length, travelObjects.length - 1);
    });

    it('should return 404 when you try to delete an item that does not exist', async () => {
        await request(app)
            .delete(`${URI}/${travelObjects.length + 100}`)
            .expect(404);
    });
});
