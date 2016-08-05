/**
 * Message controller
 * @module controllers/message
 */
import Promise from 'bluebird';
import { MESSAGE_MEDIUMS } from '../components/constants';
import { sendSMS } from '../components/sms';
import { sendCustomMail } from '../components/mail';

/**
 * send - Sends a message either sms or email to all recipients
 *
 * @function send
 * @memberof  module:controllers/message
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @param  {Function} next Express next middleware function
 */
function send(req, res, next) {
    const report = {
        recipients: [],
        pending: req.body.recipients.length,
        sent: 0,
        errors: 0
    };
    const communicationData = { message: req.body.message };

    Promise.map(req.body.recipients, recipient => {
        let promise;

        if (req.body.medium === MESSAGE_MEDIUMS.SMS) {
            communicationData.sender = req.body.sender;
            promise = sendSMS(recipient, communicationData);
        }

        if (req.body.medium === MESSAGE_MEDIUMS.EMAIL) {
            communicationData.subject = req.body.subject;
            promise = sendCustomMail(recipient, communicationData);
        }

        return promise
            .then(processedRecipient => {
                report.sent += 1;
                report.pending -= 1;
                report.recipients.push({ ...processedRecipient, sent: true });
            })
            .catch(processedRecipient => {
                report.errors += 1;
                report.pending -= 1;
                report.recipients.push({ ...processedRecipient, sent: false });
            });
    })
    .then(() => res.json(report))
    .catch(next);
}

export default send;
