/**
 * Account controller - All functions for the user currently using the api
 * @module controllers/account
 */
import db from '../models';
import { ResourceNotFoundError } from '../components/errors';

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
