/**
 * Account controller - All functions for the user currently using the api
 * @module controllers/account
 */
import Sequelize from 'sequelize';
import db from '../models';
import { ResourceNotFoundError, ValidationError, DatabaseError } from '../components/errors';

/**
 * retrieve - Retrieves the current user given by the payload in the jwt
 *
 * @function retrieve
 * @memberof  module:controllers/account
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function retrieve(req, res, next) {
    db.User.findOne({
        where: {
            id: req.user.id
        }
    })
    .then(user => {
        if (!user) throw new ResourceNotFoundError('user');
        res.json(user);
    })
    .catch(next);
}

/**
 * update - Updates the current user
 *
 * @function update
 * @memberof  module:controllers/account
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function update(req, res, next) {
    db.User.findOne({
        where: {
            id: req.user.id
        }
    })
    .then(user => {
        if (!user) throw new ResourceNotFoundError('trip');
        return user.update(req.body);
    })
    .then(() => res.sendStatus(204))
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(Sequelize.DatabaseError, err => {
        throw new DatabaseError(err);
    })
    .catch(next);
}
