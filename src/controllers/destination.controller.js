import Sequelize from 'sequelize';
import db from '../models';
import { ResourceNotFoundError, ValidationError } from '../components/errors';

export function list(req, res, next) {
    db.Destination.findAll()
        .then(res.json.bind(res))
        .catch(next);
}

export function create(req, res, next) {
    db.Destination.create(req.body)
        .then(savedObj => res.status(201).json(savedObj))
        .catch(Sequelize.ValidationError, err => {
            throw new ValidationError(err);
        })
        .catch(next);
}

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
        return item.update(req.body);
    })
    .then(() => res.sendStatus(204))
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(next);
}
