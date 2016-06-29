
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
