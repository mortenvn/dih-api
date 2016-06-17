 /** @module components/errors */

 /**
  * errorMiddleware - Catches all upstream errors and returns them to the requester.
  *
  * @param  {Object} err - The error to be handled
  * @param  {Object} req - Express request object
  * @param  {Object} res - Express response object
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

export class ValidationError extends Error {
    name = 'ValidationError';
    status = 400;

    constructor(error) {
        super(error.errors[0].message);
    }
}
