import { loadFixtures, getAllElements } from '../helpers';
import { describe } from 'ava-spec';
import _ from 'lodash';
import request from 'supertest-as-promised';
import app from '../../src/app';


const mockDest = {
    name: 'AdaNora',
    pendingStatusMailTemplateId: 1,
    acceptedStatusMailTemplateId: 2,
    rejectedStatusMailTemplateId: 3,
    users: [
        {
            userId: 1,
            startDate: '2016-08-03T08:12:02.554Z',
            endDate: null
        },
        {
            userId: 2,
            startDate: '2016-09-03T08:12:02.554Z',
            endDate: '2016-09-10T08:12:02.554Z'
        }
    ]
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
        response.body.forEach((dest) => {
            if (dest.id === 3) t.is(dest.countOfActiveVolunteers, 1);
            else t.is(dest.countOfActiveVolunteers, 0);
        });
    });

    it('should be able to create a new destination ', async t => {
        const response = await request(app)
            .post(URI)
            .send(mockDest)
            .expect(201)
            .then(res => res);
        t.is(response.body.name, mockDest.name);
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

    it('should be able to update a destination with several coordinators', async t => {
        const fixture = dbObjects[0];
        const changedFixture = fixture;
        changedFixture.users = [
            {
                userId: 1,
                startDate: '2016-08-03T08:12:02.554Z',
                endDate: null
            },
            {
                userId: 2,
                startDate: '2016-09-03T08:12:02.554Z',
                endDate: '2016-09-10T08:12:02.554Z'
            }
        ];
        const response = await request(app)
            .put(`${URI}/${fixture.id}`)
            .send(changedFixture)
            .expect(204)
            .then(() => request(app).get(URI))
            .then(res => _.find(res.body, obj => obj.id === fixture.id));
        t.is(response.users.length, changedFixture.users.length);
    });
});
