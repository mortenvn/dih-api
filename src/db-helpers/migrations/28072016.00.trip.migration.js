import _ from 'lodash';
import { TRAVEL_METHODS } from '../../components/constants';

module.exports = {
    up(migration, DataTypes) {
        return [
            migration.addColumn('trips', 'travelMethod', {
                type: DataTypes.ENUM,
                values: _.values(TRAVEL_METHODS)
            }),
            migration.addColumn('trips', 'departureAirport', DataTypes.STRING),
            migration.addColumn('trips', 'flightNumber', DataTypes.STRING),
            migration.addColumn('trips', 'arrivalDate', DataTypes.DATE),
            migration.addColumn('trips', 'departureDate', DataTypes.DATE),
            migration.addColumn('trips', 'otherTravelInformation', DataTypes.TEXT)
        ];
    },

    down(migration) {
        return [
            migration.removeColumn('trips', 'travelMethod'),
            migration.removeColumn('trips', 'departureAirport'),
            migration.removeColumn('trips', 'flightNumber'),
            migration.removeColumn('trips', 'arrivalDate'),
            migration.removeColumn('trips', 'departureDate'),
            migration.removeColumn('trips', 'otherTravelInformation')
        ];
    }
};
