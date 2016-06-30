/**
 * Authenticate controller - All functions regarding login/password reset and jwt distrubution
 * @module controllers/authenticate
 */
import { AuthenticationError, CustomValidationError, NotFoundError } from '../components/errors';
import db from '../models';

/**
 * login - returns a jwt given the email/password is valid
 *
 * @function login
 * @memberof  module:controllers/authenticate
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomValidationError('Authentication requires both email and password'));
    }

    db.User.findOne({
        where: {
            email
        }
    })
    .then(user => {
        if (!user) throw new AuthenticationError('Invalid credentials provided');
        return [user.authenticate(password), user];
    })
    .spread((valid, user) => {
        if (!valid) throw new AuthenticationError('Invalid credentials provided');
        return user.createJwt();
    })
    .then(jwt => res.json({ jwt }))
    .catch(next);
}

/**
 * setPassword - returns a jwt given the password is valid and that the request has a jwt which
 * the user to preform a password reset
 *
 * @function setPassword
 * @memberof  module:controllers/authenticate
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function setPassword(req, res, next) {
    const { password } = req.body;

    if (!req.user.setPassword) {
        return next(new CustomValidationError('Token not valid'));
    }

    db.User.findOne({
        where: {
            id: req.user.id
        }
    })
    .then(user => {
        if (!user) throw new NotFoundError();
        return user.updatePassword(password);
    })
    .then(user => user.createJwt())
    .then(jwt => res.json({ jwt }))
    .catch(next);
}
