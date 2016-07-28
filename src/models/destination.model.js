import Promise from 'bluebird';
import { TRIP_STATUSES } from '../components/constants';
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
        }
    }, {
        hooks: {
            beforeCreate: [
                destination =>
                    Promise.all([ // bulkCreate does not return inserted elements
                        db.MailTemplate.create(),
                        db.MailTemplate.create(),
                        db.MailTemplate.create()
                    ])
                    .spread((mt1, mt2, mt3) => {
                        // Eslind disabled due to reassignment
                        // Must reassign as it is the instance to be created
                        destination.pendingStatusMailTemplateId = mt1.id; // eslint-disable-line
                        destination.acceptedStatusMailTemplateId = mt2.id; // eslint-disable-line
                        destination.rejectedStatusMailTemplateId = mt3.id; // eslint-disable-line
                    })
            ]
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
            },
            findOneAndIncludeActiveTripCount(destId) {
                // Sequelize getterMethods do not support Promises,
                // so these custom find methods are used when one wants to
                // include certain calculated fields.
                return Destination.findOne({
                    where: {
                        id: destId
                    }
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
                    where: query
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
