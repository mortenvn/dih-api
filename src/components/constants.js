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

/**
 * The standard email templates used for new destinatons
 * @type {object}
 * @property {string} TRIP_STATUS_PENDING - Template used when trip status is set to pending
 * @property {string} TRIP_STATUS_ACCEPTED - Template used when trip status is set to accepted
 * @property {string} TRIP_STATUS_REJECTED - Template used when trip status is set to rejected
 */
exports.STANDARD_MAIL_TEMPLATES = {
    TRIP_STATUS_PENDING: `Hi, <br>
    <p>We have received your request to volunteer for us, and within a few days
    we'll get back to you regarding the need for volunteers in the requested period. </p>
    <p>Thank you for wanting to volunteer with us. <br>
    Sincerely, the Drop administration </p>`,
    TRIP_STATUS_ACCEPTED: `Hi, <br>
    <p>We are pleased to announce that your request to volunteer
    with us during the period you have submitted has been approved. </p>
    As soon as you have booked your travel and accommodations, please register
    this under "My trips" on the website. You will also receive an invitation
    to a travel group for the destination and period on Facebook. <br>
    There you'll meet others who travel to this destination during the
    same period and get information about hotels, rental cars, etc. <br>
    <p>
    We recommend that you check with your doctor to see if you need additional vaccines,
    and make sure you have your travel insurance in order.
    </p>
    <p>
    Thank you for wanting to be a Drop and making an effort to help refugees! <br>
    Sincerely, the Drop administration</p> `,
    TRIP_STATUS_REJECTED: `Hi,
    <p>Unfortunately, we do not need volunteers in the period you requested.
    If you have the opportunity to travel to another destination or in another period,
    we appreciate if you would request a new travel at our page. </p>
    Sincerely, the Drop administration `
};
