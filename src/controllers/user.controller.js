/**
 * User controller
 * @module controllers/user
 * @exports controllers/user/list
 */
import db from '../models';
import Sequelize from 'sequelize';
import { ValidationError } from '../components/errors';


/**
 * list - List all users in the database
 *
 * @function list
 * @memberof  module:controllers/user
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function list(req, res, next) {
    db.User.findAll()
        .then(res.json.bind(res))
        .catch(next);
}

/**
 * create - creates a user.
 *
 * @function create
 * @memberof  module:controllers/user
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function create(req, res, next) {
    db.User.create(req.body)
        .then(user => res.status(201).json(user))
        .catch(Sequelize.ValidationError, err => {
            throw new ValidationError(err);
        })
        .catch(next);
}
