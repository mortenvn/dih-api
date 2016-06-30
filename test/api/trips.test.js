import { loadFixtures, getAllElements } from '../helpers';
import { describe } from 'ava-spec';
import _ from 'lodash';
import request from 'supertest-as-promised';
import app from '../../src/app';

const fixtures = [
    'users',
    'destinations',
    'trips'
];

const URI = '/trips';
let tripObjects;
let userObjects;
let destinationObjects;
const mockTrip = {
    status: 'PENDING',
    wishStartDate: '2020-04-25T01:32:21.196+0200',
    wishEndDate: '2021-04-25T01:32:21.196+0200'
};

describe.serial('Trip API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllElements('Trip'))
            .then(response => {
                tripObjects = response;
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
                mockTrip.userId = userObjects[1].id;
                mockTrip.destinationId = destinationObjects[1].id;
            })
    );

    it('should retrieve a list of all trips', async t => {
        const response = await request(app)
            .get(URI)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, tripObjects.length);
    });

    it('should be able to get all trips of a specific destinationId', async t => {
        const response = await request(app)
            .get(`${URI}?destinationId=${tripObjects[0].destinationId}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 1);
    });

    it('should be able to get trips of a specific userId', async t => {
        const response = await request(app)
            .get(`${URI}?userId=${tripObjects[0].userId}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 2);
    });


    it('should be able to get all trips of a specific status', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?status=${fixture.status}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 1);
    });

    it('should be able to get trips of a specific userId and destinationId', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?userId=${fixture.userId}&destinationId=${fixture.destinationId}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 1);
    });

    it('should be able to get trips of a specific userId, destinationId and status', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?userId=${fixture.userId}
                        &destinationId=${fixture.destinationId}
                        &status=${fixture.status}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, 1);
    });

    it('should be not be able to query on startDate', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?startDate=${fixture.startDate}`)
            .expect(400)
            .then(res => res.body);
        t.is(response.name, 'UriValidationError');
        t.is(response.message, 'Invalid URI.');
    });

    it('should be not be able to query on endDate', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?endDate=${fixture.endDate}`)
            .expect(400)
            .then(res => res.body);
        t.is(response.name, 'UriValidationError');
        t.is(response.message, 'Invalid URI.');
    });

    it('should be not be able to query on wishStartDate', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?wishStartDate=${fixture.wishStartDate}`)
            .expect(400)
            .then(res => res.body);
        t.is(response.name, 'UriValidationError');
        t.is(response.message, 'Invalid URI.');
    });

    it('should be not be able to query on wishEndDate', async t => {
        const fixture = tripObjects[0];
        const response = await request(app)
            .get(`${URI}?wishEndDate=${fixture.wishEndDate}`)
            .expect(400)
            .then(res => res.body);
        t.is(response.name, 'UriValidationError');
        t.is(response.message, 'Invalid URI.');
    });

    it('should reject queries on non-existing model properties', async t => {
        const response = await request(app)
            .get(`${URI}?topkek=someValue&capra=summmer`)
            .expect(400)
            .then(res => res.body);
        t.is(response.name, 'UriValidationError');
        t.is(response.message, 'Invalid URI.');
    });

    it('should be able to create a new trip ', async t => {
        const response = await request(app)
            .post(URI)
            .send(mockTrip)
            .expect(201)
            .then(res => res);
        t.is(response.body.status, mockTrip.status);
    });

    it('should not be able to create a new trip with missing status field', async () => {
        const mockWithEmptyStatus = mockTrip;
        delete mockWithEmptyStatus.status;
        await request(app)
            .post(URI, mockWithEmptyStatus)
            .expect(400);
    });

    it('should not be able to create a new trip with missing destinationId field', async () => {
        const mockWithEmptyDestination = mockTrip;
        delete mockWithEmptyDestination.destinationId;
        await request(app)
            .post(URI, mockWithEmptyDestination)
            .expect(400);
    });

    it('should not be able to create a new trip with missing userId field', async () => {
        const mockWithEmptyUser = mockTrip;
        delete mockWithEmptyUser.userId;
        await request(app)
            .post(URI, mockWithEmptyUser)
            .expect(400);
    });

    it('should be able to update a trip with a valid new status', async t => {
        const fixture = tripObjects[0];
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

    it('should not be able to update a trip with an invalid status', async () => {
        const fixture = tripObjects[0];
        const invalidChangedFixture = fixture;
        invalidChangedFixture.status = 'kek';
        await request(app)
            .put(`${URI}/${fixture.id}`)
            .send(invalidChangedFixture)
            .expect(400);
    });

    it('should return 404 when you try to update a trip that does not exist', async () => {
        await request(app)
            .put(`${URI}/${tripObjects.length + 100}`)
            .send(mockTrip)
            .expect(404);
    });

    it('should be able to delete a trip', async t => {
        const response = await request(app)
            .delete(`${URI}/${tripObjects[0].id}`)
            .expect(200)
            .then(() => request(app).get(URI))
            .then(res => res.body);
        t.is(response.length, tripObjects.length - 1);
    });

    it('should return 404 when you try to delete an item that does not exist', async () => {
        await request(app)
            .delete(`${URI}/${tripObjects.length + 100}`)
            .expect(404);
    });
});
