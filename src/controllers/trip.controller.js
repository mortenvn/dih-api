/**
 * Trip controller
 * @module controllers/trip
 */
import Sequelize from 'sequelize';
import db from '../models';
import { ResourceNotFoundError, ValidationError, DatabaseError } from '../components/errors';

/**
 * list - List all trips in the database
 *
 * @function list
 * @memberof  module:controllers/trip
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function list(req, res, next) {
    db.Trip.findAll()
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
            throw new ValidationError(err);
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
        if (!count) throw new ResourceNotFoundError('trip');
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
        if (!trip) throw new ResourceNotFoundError('trip');
        return trip.update(req.body);
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
