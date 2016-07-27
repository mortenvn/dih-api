import { describe } from 'ava-spec';
import Sequelize from 'sequelize';
import { loadFixtures, getAllElements } from '../helpers';
import db from '../../src/models';
import { TRIP_STATUSES } from '../../src/components/constants';

let tripObjects;


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

    it('should send an email to user when trip status is set to accepted', async t => {
        const tripObj = tripObjects[0];
        db.Trip.findOne({
            where: {
                id: tripObj.id
            }
        })
        .then(dbTripObj => dbTripObj.update({ status: TRIP_STATUSES.ACCEPTED }))
        .then(() => db.Trip.findOne({ where: tripObj.id }))
        .then(trip => t.is(trip.status, TRIP_STATUSES.ACCEPTED));
    });

    it('should send an email to user when trip status is set to rejected', async t => {
        const tripObj = tripObjects[0];
        db.Trip.findOne({
            where: {
                id: tripObj.id
            }
        })
        .then(dbTripObj => dbTripObj.update({ status: TRIP_STATUSES.REJECTED }))
        .then(() => db.Trip.findOne({ where: tripObj.id }))
        .then(trip => t.is(trip.status, TRIP_STATUSES.REJECTED));
    });
});
