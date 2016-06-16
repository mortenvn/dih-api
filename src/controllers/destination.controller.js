import db from '../models';

export function list(req, res, next) {
    db.Destination.findAll()
        .then(res.json.bind(res))
        .catch(next);
}
