 /**
  * All error handeling and errors used trouought the application.
  * @module components/errors
  */

 /**
  * errorMiddleware - Catches all upstream errors and returns them to the requester.
  *
  * @param  {Object} err - The error to be handled
  * @param  {Object} req - Express request object
  * @param  {Object} res - Express response object
  * @param  {Function} next - Express next middleware function
  * @return {Undefined}  - The handled error response
  */
// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        console.log(err.stack); // eslint-disable-line
    }
    const status = err.status || 500;
    return res
        .status(status)
        .json(err.payload || {
            name: err.name,
            message: err.message
        });
}

/**
 * pageNotFoundMiddleware - Returns a 404 Page not Found error it the route requested
 * is not matched with any corresponding route.
 *
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @return {Undefined}  - A 404 not found error
 */
export function pageNotFoundMiddleware(req, res) {
    return res
        .status(404)
        .json({
            message: 'Page Not Found'
        });
}

/**
 * DatabaseError - Returns an Error message for Sequelize Database error.
 * This is thrown in cases where validation in the DBMS is what stops the
 * databse action, not Sequelize validation.
 *
 * @param  {Object} error - Database Error from Sequelize
 * @return {Object}  - A DatabaseError object
 */
export class DatabaseError extends Error {
    name = 'ValidationError';
    status = 400;
    constructor(error) {
        super(error.message);
    }
 }

/**
 * ValidationError - Returns an Error message for Sequelize validation with
 * information about what's wrong
 *
 * @param  {Object} error - Validation error from  Sequelize
 * @return {Object}  - A ValidationError object
 */
export class ValidationError extends Error {
    name = 'ValidationError';
    status = 400;
    constructor(error) {
        super(error.errors[0].message);
    }
 }

/**
 * ResourceNotFoundError - Returns a 404 Entity not found error for when
 * a client request an entity that isn't there
 *
 * @param  {String} entityType - The type of entity that isn't found
 * @return {Object}  - Error object
 */
export class ResourceNotFoundError extends Error {
    name = 'ResourceNotFoundError';
    status = 404;
    constructor(entityType = 'entity') {
        super(`Could not find resource of type ${entityType}`);
    }
}

/**
 * AuthenticationError - Returns a 401 You need to authenicate to access this resource,
 * implying that the user does not have enough premissions to complete this request.
 *
 * @param  {String} message - A message sent to the user why he/she is not authenticated
 * @return {Object}  - Error object
 */
export class AuthenticationError extends Error {
    name = 'AuthenticationError';
    status = 401;
    constructor(message = 'You need to authenicate to access this resource') {
        super(message);
        this.message = message;
    }
}
