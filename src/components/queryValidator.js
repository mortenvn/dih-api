/**
 * Generic validation of query objects
 * @module components/queryValidator
 */

import _ from 'lodash';

/**
 * validateQuery - Catches all upstream errors and returns them to the requester.
 *
 * @param  {Object} query - Express req.query object
 * @param  {Array} allowedQueryParams - List of names of model properties that
 * are allowed to be queried on
 * @return {Boolean}  - If the query is valid or not
 */
export function validateQuery(query, allowedQueryParams) {
    let isValid = true;
    _.mapKeys(query, (value, key) => {
        if (allowedQueryParams.indexOf(key) === -1) isValid = false;
    });
    return isValid;
}
