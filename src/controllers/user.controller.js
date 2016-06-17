import db from '../models';
import Sequelize from 'sequelize';
import { ValidationError } from '../components/errors';

export function list(req, res, next) {
    db.User.findAll()
        .then(res.json.bind(res))
        .catch(next);
}

export function create(req, res, next) {
    db.User.create(req.body)
        .then(user => res.status(201).json(user))
        .catch(Sequelize.ValidationError, err => {
            throw new ValidationError(err);
        })
        .catch(next);
}
