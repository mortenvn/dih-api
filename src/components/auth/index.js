/**
 * All functions and setup regarding authentification and authorization.
 * @module components/auth
 */
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import composableMiddleware from 'composable-middleware';
import { AuthenticationError, AuthorizationError } from '../errors';
import config from '../../config';
import { USER_ROLES } from '../constants';

Promise.promisifyAll(jwt);

/**
 * createJwt - Creates a JWT.
 *
 * @param  {Object} payload                         json object
 * @param  {String} expiresIn = config.jwtExpiresIn string indicating how long the jwt is valid
 * @return {String}                                 The created jwt
 */
export function createJwt(payload, expiresIn = config.jwtExpiresIn) {
    return jwt.sign(payload, config.secret, {
        expiresIn,
        subject: String(payload.id)
    });
}

/**
 * authorize - middleware to check for a valid JWT, if the JWT is valid the payload
 * is extracted and attached to the req to be used later.
 *
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 * @return {type}      description
 */
export function authorize(req, res, next) {
    let authToken;

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

/**
 * authorizeAdministrator - combines two middleware where the first authorizes the
 * users JWT and the second checks for administrator privileges.
 *
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export const authorizeAdministrator =
    composableMiddleware()
        .use(authorize)
        .use((req, res, next) => {
            if (req.user.role !== USER_ROLES.ADMIN) next(new AuthorizationError());
            next();
        });

/**
 * authorizeModerator - combines two middleware where the first authorizes the users
 * JWT and the second checks for administrator privileges or higher.
 *
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
export const authorizeModerator =
    composableMiddleware()
        .use(authorize)
        .use((req, res, next) => {
            const role = req.user.role;
            if (!(USER_ROLES.MODERATOR === role || USER_ROLES.ADMIN === role)) {
                next(new AuthorizationError());
            }
            next();
        });
