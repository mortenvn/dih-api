import { USER_ROLES } from '../components/constants';
import _ from 'lodash';

export default function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM,
            values: _.values(USER_ROLES),
            defaultValue: USER_ROLES.USER
        }
    }, {
        classMethods: {
            associate(models) {
                User.hasMany(models.Travel);
            }
        }
    });
    return User;
}
