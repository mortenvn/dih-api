/**
 * All functions and setup regarding generating and sending emails.
 * @module components/mail
 */
import nodemailer from 'nodemailer';
import handlebars from 'express-handlebars';
import Promise from 'bluebird';
import hbs from 'nodemailer-express-handlebars';
import ses from 'nodemailer-ses-transport';
import path from 'path';
import config from '../../config';

let transporter;
const options = hbs({
    viewEngine: handlebars.create({}),
    viewPath: path.resolve(__dirname.replace('/dist/', '/src/'))
});

/**
 * updateTransporter - This function allows us to update the transport method used to send email.
 * Such that when running tests we can mock the transport and test all the mail functionality
 * The default transporter is AWS SES
 *
 * @function updateTransport
 * @memberof  module:components/mail
 * @param  {Object} transport the transport ubject we would like to use
 */
export function updateTransport(transport) {
    transporter = Promise.promisifyAll(nodemailer.createTransport(transport));
    transporter.use('compile', options);
}

updateTransport(ses(config.ses));

/**
 * sendResetPasswordEmail - Sends an reset password email to the specified user,
 *
 * @function sendResetPasswordEmail
 * @memberof  module:components/mail
 * @param  {SequlizeInstance} user The user which is going to recive the email
 * @param  {string} token A JWT used to authorize with the rest api
 * @return {SequlizeInstance} user The user who was sent the email
 */
export function sendResetPasswordEmail(user, token) {
    const mailOptions = {
        to: user.email,
        from: `DIH <${config.email}>`,
        subject: 'Password reset for A Drop in the Ocean',
        template: 'action',
        context: {
            content: 'You have requestet a password reset, follow this link to set a new password',
            action: {
                text: 'Reset password',
                url: `${config.web}/password/confirm?token=${token}`
            }
        }
    };

    return transporter.sendMailAsync(mailOptions)
        .then(() => user)
        .catch(err => { // TODO should add some logger, or better use Sentry!
            console.error(err); // eslint-disable-line
        });
}

/**
 * sendInvite - Sends an invite email to the specified user,
 *
 * @function sendInvite
 * @memberof  module:components/mail
 * @param  {SequlizeInstance} user The user which is going to recive the email
 * @param  {string} token A JWT used to authorize with the rest api
 * @return {SequlizeInstance} user The user who was sent the email
 */
export function sendInvite(user, token) {
    const mailOptions = {
        to: user.email,
        from: `DIH <${config.email}>`,
        subject: 'Welcome to A Drop in the Ocean!',
        template: 'action',
        context: {
            content: `You have created an account with A Drop in the Ocean.
            Click the button below to complete the registration.`,
            action: {
                text: 'Complete registration',
                url: `${config.web}/signup/confirm?token=${token}`
            }
        }
    };

    return transporter.sendMailAsync(mailOptions)
        .then(() => user)
        .catch(err => { // TODO should add some logger, or better use Sentry!
            console.error(err); // eslint-disable-line
        });
}

/**
 * sendDestinationAcceptance - Sends an e-mail to a user that's accepted to a destiation
 *
 * @function sendDestinationAcceptance
 * @memberof  module:components/mail
 * @param  {SequlizeInstance} user The user which is going to recive the email
 * @param  {string} mailContent The content of the info e-mail to be sent
 * @param  {string} token A JWT used to authorize with the rest api
 * @return {SequlizeInstance} user The user who was sent the email
 */
export function sendDestinationAction(user, mailContent, token) {
    const mailOptions = {
        to: user.email,
        from: `DIH <${config.email}>`,
        subject: 'A Drop in the Ocean has accepted you as a volunteer!',
        template: 'action',
        context: {
            content: mailContent,
            action: {
                text: 'See your trip',
                url: `${config.web}/trips?token=${token}`
            }
        }
    };

    return transporter.sendMailAsync(mailOptions)
        .then(() => user)
        .catch(err => { // TODO should add some logger, or better use Sentry!
            console.error(err); // eslint-disable-line
        });
}

/**
 * sendDestinationInfo - Sends an informational
 * e-mail to a user  with given information as content
 *
 * @function sendDestinationInfo
 * @memberof  module:components/mail
 * @param  {SequlizeInstance} user The user which is going to recive the email
 * @param  {string} mailContent The content of the info e-mail to be sent
 * @return {SequlizeInstance} user The user who was sent the email
 */
export function sendDestinationInfo(user, mailContent) {
    const mailOptions = {
        to: user.email,
        from: `DIH <${config.email}>`,
        subject: 'Information about your trip with A Drop in the Ocean',
        template: 'info',
        context: {
            content: mailContent
        }
    };

    return transporter.sendMailAsync(mailOptions)
        .then(() => user)
        .catch(err => { // TODO should add some logger, or better use Sentry!
            console.error(err); // eslint-disable-line
        });
}
