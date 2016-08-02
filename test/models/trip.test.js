import { describe } from 'ava-spec';
import Sequelize from 'sequelize';
import { loadFixtures, getAllElements } from '../helpers';
import db from '../../src/models';

let tripObjects; //eslint-disable-line


describe('Trip Model', it => {
    it.beforeEach(() =>
        loadFixtures()
            .then(() => getAllElements('Trip'))
            .then(response => {
                tripObjects = response;
            })
        );

    it('should be able to insert a new trip', async t => {
        const trip = {
            userId: 1,
            destinationId: 1,
            status: 'PENDING',
            startDate: null,
            endDate: null,
            wishStartDate: '2017-04-25T01:32:21.196+0200',
            wishEndDate: '2018-04-25T01:32:21.196+0200'
        };
        db.Trip.create(trip)
            .then(() => {
                t.pass();
            })
            .catch(Sequelize.ValidationError, err => {
                t.fail(err);
            });
    });
});
