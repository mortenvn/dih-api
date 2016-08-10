import { describe } from 'ava-spec';
import Sequelize from 'sequelize';
import { loadFixtures } from '../helpers';
import db from '../../src/models';

const fixtures = [
    'users',
    'destinations',
    'trips'
];

const mockTrip = {
    userId: 1,
    destinationId: 1,
    status: 'PENDING',
    startDate: null,
    endDate: null
};

describe('Trip Model', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
    );

    it('should be able to insert a new trip', async t => {
        db.Trip.create(mockTrip)
            .then(() => {
                t.pass();
            })
            .catch(Sequelize.ValidationError, err => {
                t.fail(err);
            });
    });
});
