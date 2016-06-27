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
 * @param  {Object} transport the transport ubject we would like to use
 */
export function updateTransport(transport) {
    transporter = Promise.promisifyAll(nodemailer.createTransport(transport));
    transporter.use('compile', options);
}

updateTransport(ses(config.ses));


/**
 * sendInvite - Sends an invite email to the specified user,
 *
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
            content: `Det har opprettet en bruker for deg på DIH, trykk på knappen under
                for å fullføre registreringen.`,
            action: {
                text: 'Registrer brukerkonto',
                url: `${config.web}/signup/invite?token=${token}`
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
 * userAcceptedToDestination - Sends an e-mail to a user that's accepted to a destiation
 *
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
