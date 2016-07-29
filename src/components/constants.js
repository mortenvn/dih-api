/**
 * All constants used trouought the application.
 * @module components/constants
 */

/**
 * The possible roles a user can have.
 * @type {object}
 * @property {string} USER - Grants this user the basic user permissions.
 * @property {string} MODERATOR - Grants this user the user permissions and moderator permissions.
 * @property {string} ADMIN - Grants this user the admin permissions.
 */
exports.USER_ROLES = {
    USER: 'USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN'
};

/**
 * The possible methods of travel for a trip.
 * @type {object}
 * @property {string} PLANE - The user will arrive by plane, should trigger specific fields.
 * @property {string} OTHER - The uset will arrive by other method than listed, should trigger
 * a free text field.
 */
exports.TRAVEL_METHODS = {
    PLANE: 'PLANE',
    OTHER: 'OTHER'
};

/**
 * The possible roles a user can have.
 * @type {object}
 * @property {string} PENDING - The trip is requested by a user but not handled by an admin
 * @property {string} ACCEPTED - The trip is accepted by an admin
 * @property {string} REJECTED - The trip is rejected by an admin
 * @property {string} ACTIVE - The trip is currently in progress by a user
 * @property {string} CLOSED - The trip is closed, hence the user has completed this trip
 * @property {string} PRESENT - Volunteer is present at destination
 * @property {string} LEFT - Volunteer has left the destination
 */
exports.TRIP_STATUSES = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    ACTIVE: 'ACTIVE',
    CLOSED: 'CLOSED',
    PRESENT: 'PRESENT',
    LEFT: 'LEFT'
};
