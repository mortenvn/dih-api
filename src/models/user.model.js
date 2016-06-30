/**
* User model
* @module models/user
*/
import _ from 'lodash';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import { USER_ROLES } from '../components/constants';
import { sendInvite, sendDestinationAcceptance } from '../components/mail';
import { createJwt } from '../components/auth';
Promise.promisifyAll(bcrypt);

/**
* User model - create and export the database model for the user
* including all assosiations and classmethods assiciated with this model.
* @memberof  module:models/user
* @param  {Object} sequelize description
* @param  {Object} DataTypes description
*/
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
        hash: DataTypes.STRING,
        password: {
            type: DataTypes.VIRTUAL,
            set(password) {
                this.setDataValue('password', password);
            },
            validate: {
                strength(password) {
                    if (password.length < 7) throw new Error('Please choose a longer password');
                }
            }
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
            authenticate(password) {
                return bcrypt.compareAsync(password, this.hash);
            },
            toJSON() {
                const user = this.get({ plain: true });
                delete user.hash;
                delete user.password;
                return user;
            },
            createJwt() {
                return createJwt(this.toJSON());
            },
            sendInvite() {
                const token = this.createJwt();
                return sendInvite(this, token);
            },
            sendDestinationAcceptance(destination) {
                const token = this.createJwt();
                return sendDestinationAcceptance(this, destination, token);
            }
        },
        hooks: {
            beforeUpdate: [
                user => {
                    if (!user.changed('password')) return Promise.resolve();
                    return bcrypt.genSaltAsync()
                        .then(salt => bcrypt.hashAsync(user.get('password'), salt))
                        .then(hash => user.set('hash', hash));
                }
            ]
        }
    });
    return User;
}
