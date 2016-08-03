/**
 * Authenticate controller - All functions regarding login/password reset and jwt distrubution
 * @module controllers/authenticate
 */
import * as errors from '../components/errors';
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
        return next(new errors.CustomValidationError('Authentication requires email and password'));
    }

    db.User.findOne({
        where: {
            email: email.toLowerCase()
        }
    })
    .then(user => {
        if (!user) throw new errors.AuthenticationError('Invalid credentials provided');
        return [user.authenticate(password), user];
    })
    .spread((valid, user) => {
        if (!valid) throw new errors.AuthenticationError('Invalid credentials provided');
        return user.createJwt();
    })
    .then(jwt => res.json({ jwt }))
    .catch(next);
}

/**
 * initiateResetPassword - sends an email to the user requested a password reset, such that the
 * user can specify a new password
 *
 * @function initiateResetPassword
 * @memberof  module:controllers/authenticate
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export function initiateResetPassword(req, res, next) {
    const { email } = req.body;

    db.User.findOne({
        where: {
            email: email.toLowerCase()
        }
    })
    .then(user => {
        if (!user) throw new errors.ResourceNotFoundError('user');
        return user.sendResetPasswordEmail();
    })
    .then(() => res.sendStatus(200))
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
        return next(new errors.CustomValidationError('Token not valid'));
    }

    db.User.findOne({
        where: {
            id: req.user.id
        }
    })
    .then(user => {
        if (!user) throw new errors.ResourceNotFoundError('user');
        return user.updatePassword(password);
    })
    .then(user => user.createJwt())
    .then(jwt => res.json({ jwt }))
    .catch(next);
}
