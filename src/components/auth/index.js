import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import { AuthenticationError } from '../errors';
import config from '../../config';

Promise.promisifyAll(jwt);

export function createJWT(payload, expiresIn = config.jwtExpiresIn) {
    return jwt.sign(payload, config.secret, {
        expiresIn,
        subject: String(payload.id)
    });
}

export function authorize(req, res, next) {
    let authToken = undefined;

    try {
        authToken = req.get('Authorization').split(' ')[1];
    } catch (error) {
        throw new AuthenticationError();
    }

    if (!authToken) next(new AuthenticationError());
    jwt.verifyAsync(authToken, config.secret)
        .then(decodedToken => {
            req.user = decodedToken; // eslint-disable-line
            next();
        })
        .catch(error => next(new AuthenticationError(error.message)));
}
