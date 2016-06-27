import { describe } from 'ava-spec';
import sinon from 'sinon';
import Sequelize from 'sequelize';
import { loadFixtures, getAllElements } from '../helpers';
import db from '../../src/models';
import { TRIP_STATUSES } from '../../src/components/constants';
import { updateTransport } from '../../src/components/mail';


const fixtures = [
    'users',
    'destinations',
    'trips'
];
let transport;
let tripObjects;


describe('Trip Model', it => {
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
            .then(() => getAllElements('Trip'))
            .then(response => {
                tripObjects = response;
            });
    });

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
        sinon.stub(transport, 'send').yields(null);
        db.Trip.findOne({
            where: {
                id: tripObjects[0].id
            }
        })
        .then(dbTripObj => dbTripObj.update({ status: TRIP_STATUSES.ACCEPTED }))
        .then(() => t.is(transport.send.callCount, 1));
    });
});
