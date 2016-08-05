import AWS from 'aws-sdk';
import Promise from 'bluebird';
import { handleError } from '../errors';
import config from '../../config';

let sns = new Promise.promisifyAll(new AWS.SNS(config.sns));

export function updateSNS(mockSns) {
    sns = Promise.promisifyAll(mockSns);
}

export function sendSMS(recipient, smsData) {
    const params = {
        Message: smsData.message,
        MessageStructure: 'raw',
        PhoneNumber: recipient.phoneNumber,
        Subject: smsData.sender
    };
    return sns.setSMSAttributesAsync({
        attributes: {
            DefaultSenderID: smsData.sender
        }
    })
    .then(() => sns.publishAsync(params))
    .then(() => recipient)
    .catch(error => {
        handleError(error);
        return Promise.reject({ ...recipient, error: error.cause.message });
    });
}
