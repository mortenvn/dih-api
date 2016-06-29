/**
 * Generic validation of query objects
 * @module components/queryValidator
 */

/**
 * validateQuery - Catches all upstream errors and returns them to the requester.
 *
 * @param  {Object} query - Express req.query object
 * @param  {Array} allowedQueryParams - List of names of model properties that
 * are allowed to be queried on
 * @return {Boolean}  - If the query is valid or not
 */
export function validateQuery(query, allowedQueryParams) {
    const keys = Object.keys(query);
    let isValid = true;
    for (let i = 0; i < keys.length; i++) {
        if (allowedQueryParams.indexOf(keys[i]) === -1) {
            isValid = false;
            break;
        }
    }
    return isValid;
}
