import { USER_ROLES } from '../components/constants';
import { sendInvite } from '../components/mail';
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
                User.hasMany(models.Trip);
            },
            invite(body) {
                return User.create(body)
                    .then(user => user.sendInvite());
            }
        },
        instanceMethods: {
            toJSON() {
                // TODO here we can remove sensetive data like hash
                return this.get({ plain: true });
            },
            createJwt() {
                // TODO create instance specifiv jwt
                return 'pifmapir13mifm1oimrfoi1mfim1imfi1mf';
            },
            sendInvite() {
                const token = this.createJwt();
                return sendInvite(this, token);
            }
        }
    });
    return User;
}
