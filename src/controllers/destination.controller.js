/**
 * Destination controller
 * @module controllers/destination
 */
import Sequelize from 'sequelize';
import db from '../models';
import { ResourceNotFoundError, ValidationError } from '../components/errors';

/**
 * list - List all destinations in the database
 *
 * @function list
 * @memberof  module:controllers/destination
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function list(req, res, next) {
    db.Destination.findAllAndIncludeActiveTripCount(req.query)
    .then(res.json.bind(res))
    .catch(next);
}

/**
 * retrieve - Retrieves a single destination by ID.
 *
 * @function retrieve
 * @memberof module:controllers/destination
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function retrieve(req, res, next) {
    db.Destination.findOneAndIncludeActiveTripCount(req.params.id)
    .then(destination => {
        res.json(destination);
    })
    .catch((destination) => { // Rejected because element was not found
        if (!destination) throw new ResourceNotFoundError('destination');
    })
    .catch(next);
}


/**
 * create - creates a destination.
 *
 * @function create
 * @memberof  module:controllers/destination
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function create(req, res, next) {
    db.Destination.create(req.body)
    .then(savedObj => {
        if (req.body.users) {
            req.body.users.map(user => savedObj.addUsers(
                [user.userId],
                { startDate: user.startDate, endDate: user.endDate })
            );
        }
        res.status(201).json(savedObj);
    })
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(next);
}

/**
 * destroy - Deletes a destination given id and that the destination exists
 *
 * @function destroy
 * @memberof  module:controllers/destination
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function destroy(req, res, next) {
    db.Destination.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(count => {
        if (count === 0) {
            throw new ResourceNotFoundError('destination');
        }
    })
    .then(() => res.sendStatus(200))
    .catch(next);
}

/**
 * update - Updates a destination given id and that the destination exists
 *
 * @function update
 * @memberof  module:controllers/destination
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function update(req, res, next) {
    db.Destination.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(item => {
        if (!item) {
            throw new ResourceNotFoundError('destination');
        }
        let promise = item.update(req.body);
        if (req.body.users) {
            promise = Promise.all([
                req.body.users.map(user => item.addUsers([user.userId],
                    { startDate: user.startDate, endDate: user.endDate })
                )
            ])
            .then(item.update(req.body));
        }
        return promise;
    })
    .then(() => res.sendStatus(204))
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(next);
}
