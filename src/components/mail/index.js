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
 * sendPasswordEmail - Sends an reset password email to the specified user,
 *
 * @function sendPasswordEmail
 * @memberof  module:components/mail
 * @param  {SequlizeInstance} user The user which is going to recive the email
 * @param  {string} token A JWT used to authorize with the rest api
 * @return {SequlizeInstance} user The user who was sent the email
 */
export function sendPasswordEmail(user, token) {
    const mailOptions = {
        to: user.email,
        from: `DIH <${config.email}>`,
        subject: 'Password reset, Dråpen I Havet!',
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
        subject: 'Velkommen til Dråpen I Havet!',
        template: 'action',
        context: {
            content: `Du har opprettet en bruker hos Dråpen i Havet, trykk på knappen under
                for å fullføre registreringen.`,
            action: {
                text: 'Registrer brukerkonto',
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
 * @param  {SequlizeInstance} destination The destination the user was accepted to
 * @param  {string} token A JWT used to authorize with the rest api
 * @return {SequlizeInstance} user The user who was sent the email
 */
export function sendDestinationAcceptance(user, destination, token) {
    // @TODO correct URL for mytrips
    const mailOptions = {
        to: user.email,
        from: `DIH <${config.email}>`,
        subject: 'Du har blitt godkjent som frivillig hos Dråpen i Havet!',
        template: 'action',
        context: {
            content: `Du har blitt godkjent som frivillig til destinasjonen ${destination.name}`,
            action: {
                text: 'Se din reise',
                url: `${config.web}/mytrips?token=${token}`
            }
        }
    };

    return transporter.sendMailAsync(mailOptions)
        .then(() => user)
        .catch(err => { // TODO should add some logger, or better use Sentry!
            console.error(err); // eslint-disable-line
        });
}
