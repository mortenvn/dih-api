import Promise from 'bluebird';
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
        miminmumTripDurationInDays: {
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
            }
        }
    });
    return Destination;
}
