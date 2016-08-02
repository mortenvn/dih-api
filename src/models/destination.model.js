import Promise from 'bluebird';
import { TRIP_STATUSES } from '../components/constants';
import { createMailTemplatesForDestination } from '../db-helpers';
import db from './';

export default function (sequelize, DataTypes) {
    const Destination = sequelize.define('destination', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true
            }
        },
        minimumTripDurationInDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        getterMethods: {
            isActive() {
                // Check for endDate as it can be null
                // Then see if the current time is within the range
                return (this.endDate ? this.endDate >= new Date() : true)
                && this.startDate <= new Date();
            }
        },
        hooks: {
            beforeCreate: createMailTemplatesForDestination,
            beforeSave: createMailTemplatesForDestination
        },
        classMethods: {
            associate(models) {
                Destination.hasMany(models.Trip);
                Destination.belongsTo(models.MailTemplate, {
                    foreignKey: {
                        name: 'acceptedStatusMailTemplateId',
                        allowNull: true
                    }
                });
                Destination.belongsTo(models.MailTemplate, {
                    foreignKey: {
                        name: 'rejectedStatusMailTemplateId',
                        allowNull: true
                    }
                });
                Destination.belongsTo(models.MailTemplate, {
                    foreignKey: {
                        name: 'pendingStatusMailTemplateId',
                        allowNull: true
                    }
                });
                Destination.belongsToMany(models.User,
                    { through: models.DestinationCoordinator },
                    { foreignKey: 'destinationId' });
            },
            findOneAndIncludeActiveTripCount(destId) {
                // Sequelize getterMethods does not support Promises,
                // so these custom find methods are used when one wants to
                // include certain calculated fields.
                return Destination.findOne({
                    where: {
                        id: destId
                    },
                    include: [{
                        model: db.User
                    }]
                })
                .then(destination => {
                    if (!destination) return Promise.reject(null);
                    return [destination.toJSON(), destination.countTrips({
                        where: {
                            status: TRIP_STATUSES.ACTIVE
                        }
                    })];
                })
                .spread((destination, countOfActiveVolunteers) =>
                    ({ ...destination, countOfActiveVolunteers })
                );
            },
            findAllAndIncludeActiveTripCount(query) {
                return Destination.findAll({
                    where: query,
                    include: [{
                        model: db.User
                    }]
                })
                .then(destinations =>
                    Promise.map(destinations, destination =>
                        destination.countTrips({
                            where: {
                                status: TRIP_STATUSES.ACTIVE
                            }
                        })
                        .then(countOfActiveVolunteers =>
                            ({ ...destination.toJSON(), countOfActiveVolunteers })
                        )
                    )
                );
            }
        }
    });
    return Destination;
}
