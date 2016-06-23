import { TRIP_STATUSES } from '../components/constants';
import _ from 'lodash';

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
            }
        }
    });
    return Trip;
}
