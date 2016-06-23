import db from '../models';
import { ResourceNotFoundError } from '../components/errors';

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
