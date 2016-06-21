import db from '../models';

export function show(req, res, next) {
    console.log('Herro Worrd!' + req.user);
    res.send(200);
}
