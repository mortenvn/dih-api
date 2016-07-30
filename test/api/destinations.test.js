import { loadFixtures, getAllElements } from '../helpers';
import { describe } from 'ava-spec';
import _ from 'lodash';
import request from 'supertest-as-promised';
import moment from 'moment';
import app from '../../src/app';


const mockDest = {
    name: 'AdaNora'
};
const URI = '/destinations';
let dbObjects;

describe.serial('Destination API', it => {
    it.beforeEach(() =>
        loadFixtures()
            .then(() => getAllElements('Destination'))
            .then(response => {
                dbObjects = response;
            })
    );

    it('should retrieve a list of all destinations', async t => {
        const response = await request(app)
            .get(URI)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, dbObjects.length);
    });

    it('should be able to retrieve a single destination', async t => {
        const fixture = dbObjects[0];
        const response = await request(app)
            .get(`${URI}/${fixture.id}`)
            .expect(200);
        t.is(response.body.name, fixture.name);
        t.is(response.body.minimumTripDurationInDays, fixture.minimumTripDurationInDays);
    });

    it('should include count of active volunteers on retrieval of single destination', async t => {
        const fixture = dbObjects[2];
        const response = await request(app)
            .get(`${URI}/${fixture.id}`)
            .expect(200);
        t.is(response.body.countOfActiveVolunteers, 1);
    });

    it('should include count of active volunteers on retrieval of all destinations', async t => {
        const response = await request(app)
            .get(`${URI}`)
            .expect(200);
        t.is(response.body[0].countOfActiveVolunteers, 0);
        t.is(response.body[1].countOfActiveVolunteers, 0);
        t.is(response.body[2].countOfActiveVolunteers, 1);
        t.is(response.body[3].countOfActiveVolunteers, 0);
        t.is(response.body[4].countOfActiveVolunteers, 0);
    });

    it('should be able to create a new destination ', async t => {
        const response = await request(app)
            .post(URI)
            .send(mockDest)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDest.name);
    });

    it('should be able to create a new destination with minimumTripDurationInDays', async t => {
        const mockDestWithMinTrip = mockDest;
        mockDestWithMinTrip.minimumTripDurationInDays = 15;
        const response = await request(app)
            .post(URI)
            .send(mockDestWithMinTrip)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDestWithMinTrip.name);
        t.is(response.body.minimumTripDurationInDays,
            mockDestWithMinTrip.minimumTripDurationInDays);
    });

    it('should be able to create a new destination with startDate', async t => {
        const mockDestWithStartDate = mockDest;
        mockDestWithStartDate.startDate = moment().year(moment().year() + 5);
        const response = await request(app)
            .post(URI)
            .send(mockDestWithStartDate)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDestWithStartDate.name);
        t.is(moment(response.body.startDate).toString(),
        mockDestWithStartDate.startDate.toString());
    });

    it('should be able to create a new destination with endDate', async t => {
        const mockDestWithEndDate = mockDest;
        mockDestWithEndDate.endDate = moment().year(moment().year() + 5);
        const response = await request(app)
            .post(URI)
            .send(mockDestWithEndDate)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDestWithEndDate.name);
        t.is(moment(response.body.endDate).toString(), mockDestWithEndDate.endDate.toString());
    });


    it('should return destinations with calculated isActive field', async t => {
        const fixture = dbObjects[0];
        const response = await request(app)
            .get(`${URI}/${fixture.id}`)
            .expect(200)
            .then(res => res);
        t.is(response.body.isActive, true);
    });

    it('should make a destinations isActive false when startDate is in the future', async t => {
        const mockDestWithStartDate = mockDest;
        mockDestWithStartDate.startDate = moment().year(moment().year() + 5);
        const response = await request(app)
            .post(URI)
            .send(mockDestWithStartDate)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDestWithStartDate.name);
        t.is(response.body.isActive, false);
    });

    it('should make isActive true when endDate is in the future', async t => {
        const activeMockDest = mockDest;
        activeMockDest.startDate = moment().year(moment().year() - 2);
        activeMockDest.endDate = moment().year(moment().year() + 5);
        const response = await request(app)
            .post(URI)
            .send(activeMockDest)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, activeMockDest.name);
        t.is(response.body.isActive, true);
    });

    it('should have isActive false if active period has passed', async t => {
        const inactiveactiveMockDest = mockDest;
        inactiveactiveMockDest.startDate = moment().year(moment().year() - 5);
        inactiveactiveMockDest.endDate = moment().year(moment().year() - 1);
        const response = await request(app)
            .post(URI)
            .send(inactiveactiveMockDest)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, inactiveactiveMockDest.name);
        t.is(response.body.isActive, false);
    });

    it('should not be able to create a new destination with no name ', async () => {
        const mockEmptyString = mockDest;
        mockEmptyString.name = '';
        return await request(app)
            .post(URI, mockEmptyString)
            .expect(400);
    });


    it('should be able to update a destination with a new name', async t => {
        const fixture = dbObjects[0];
        const changedFixture = fixture;
        changedFixture.name = 'changedName';
        const response = await request(app)
            .put(`${URI}/${fixture.id}`)
            .send(changedFixture)
            .expect(204)
            .then(() => request(app).get(URI))
            .then(res => _.find(res.body, obj => obj.id === fixture.id));
        t.is(response.name, changedFixture.name);
    });

    it('should be able to update a destination with a new minimumTripDurationInDays', async t => {
        const fixture = dbObjects[0];
        const changedFixture = fixture;
        changedFixture.minimumTripDurationInDays = 15;
        const response = await request(app)
            .put(`${URI}/${fixture.id}`)
            .send(changedFixture)
            .expect(204)
            .then(() => request(app).get(URI))
            .then(res => _.find(res.body, obj => obj.id === fixture.id));
        t.is(response.minimumTripDurationInDays, changedFixture.minimumTripDurationInDays);
    });

    it('should not be able to update destinations that does not exist', async () => {
        await request(app)
            .put(`${URI}/100`)
            .send(mockDest)
            .expect(404);
    });

    it('should be able to delete a destination', async t => {
        const response = await request(app)
            .delete(`${URI}/${dbObjects[0].id}`)
            .expect(200)
            .then(() => request(app).get(URI))
            .then(res => res.body);
        t.is(response.length, dbObjects.length - 1);
    });

    it('should return 404 when you try to delete an item that does not exist', async () => {
        await request(app)
            .delete(`${URI}/100`)
            .expect(404);
    });
});
