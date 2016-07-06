import _ from 'lodash';
import Promise from 'bluebird';
import { validateQuery } from '../components/queryValidator';
import { TRIP_STATUSES } from '../components/constants';
import db from './';

const ALLOWED_QUERY_PARAMS = ['destinationId', 'userId', 'status'];

export default function (sequelize, DataTypes) {
    const Trip = sequelize.define('trip', {
        status: {
            type: DataTypes.ENUM,
            values: _.values(TRIP_STATUSES),
            defaultValue: TRIP_STATUSES.PENDING
        },
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        wishStartDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        wishEndDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        hotel: {
            type: DataTypes.STRING
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        classMethods: {
            associate(models) {
                Trip.belongsTo(models.User, {
                    foreignKey: {
                        name: 'userId',
                        allowNull: false
                    }
                });
                Trip.belongsTo(models.Destination, {
                    foreignKey: {
                        name: 'destinationId',
                        allowNull: false
                    }
                });
            },
            validateQuery(query) {
                return validateQuery(query, ALLOWED_QUERY_PARAMS);
            }
        },
        hooks: {
            beforeUpdate: [
                trip => {
                    if (trip.changed('status') && trip.status === TRIP_STATUSES.ACCEPTED) {
                        return trip.acceptUser();
                    }
                    return Promise.resolve();
                }
            ]
        },
        instanceMethods: {
            acceptUser() {
                return Promise.all([
                    db.Destination.findById(this.destinationId),
                    db.User.findById(this.userId)
                ])
                .spread((destination, user) => user.sendDestinationAcceptance(destination));
            }
        }
    });
    return Trip;
}
