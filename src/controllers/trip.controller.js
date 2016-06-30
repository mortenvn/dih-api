/**
 * Trip controller
 * @module controllers/trip
 */
import Sequelize from 'sequelize';
import db from '../models';
import * as errors from '../components/errors';


/**
 * list - List trips that qualify query
 *
 * @function list
 * @memberof  module:controllers/trip
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function list(req, res, next) {
    if (!db.Trip.validateQuery(req.query)) {
        throw new errors.InvalidQueryError();
    }
    db.Trip.findAll({
        where: req.query,
        include: [{
            model: db.User,
            attributes: {
                exclude: ['hash']
            }
        }, {
            model: db.Destination
        }]
    })
    .then(res.json.bind(res))
    .catch(next);
}

/**
 * create - creates a trip.
 *
 * @function create
 * @memberof  module:controllers/trip
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function create(req, res, next) {
    db.Trip.create(req.body)
        .then(savedObj => res.status(201).json(savedObj))
        .catch(Sequelize.ValidationError, err => {
            throw new errors.ValidationError(err);
        })
        .catch(next);
}

/**
 * destroy - Deletes a trip given id and that the trip exists
 *
 * @function destroy
 * @memberof  module:controllers/trip
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function destroy(req, res, next) {
    db.Trip.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(count => {
        if (!count) throw new errors.ResourceNotFoundError('trip');
        res.sendStatus(200);
    })
    .catch(next);
}

/**
 * update - Updates a trip given id and that the trip exists
 *
 * @function update
 * @memberof  module:controllers/trip
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function update(req, res, next) {
    db.Trip.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(trip => {
        if (!trip) throw new errors.ResourceNotFoundError('trip');
        return trip.update(req.body);
    })
    .then(() => res.sendStatus(204))
    .catch(Sequelize.ValidationError, err => {
        throw new errors.ValidationError(err);
    })
    .catch(Sequelize.DatabaseError, err => {
        throw new errors.DatabaseError(err);
    })
    .catch(next);
}
