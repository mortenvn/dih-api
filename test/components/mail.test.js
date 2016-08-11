import { describe } from 'ava-spec';
import sinon from 'sinon';
import config from '../../src/config';
import { createValidJWT } from '../helpers';
import * as mailComponent from '../../src/components/mail';

let transport;
const user = {
    email: 'email@emssail.com',
    firstname: 'firstname',
    lastname: 'lastname'
};

describe.serial('Mail Component', it => {
    it.beforeEach(() => {
        transport = {
            name: 'testsend',
            version: '1',
            send(data, callback) {
                callback();
            },
            logger: false
        };
        mailComponent.updateTransport(transport);
    });

    it.serial('should send an invite email, and return the user', async t => {
        sinon.stub(transport, 'send').yields(null);
        const response = await mailComponent.sendInvite(user);
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });

    it.serial('should send an invite email, with correct content', async t => {
        sinon.stub(transport, 'send', (mail, done) => {
            t.is(mail.data.to, user.email);
            t.is(mail.data.from, `DIH <${config.email}>`);
            t.regex(mail.data.html, /Complete registration/);
            done();
        });
        const response = await mailComponent.sendInvite(user);
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });

    it.serial('should send an forgotten passsword email, with correct content', async t => {
        sinon.stub(transport, 'send', (mail, done) => {
            t.is(mail.data.to, user.email);
            t.is(mail.data.from, `DIH <${config.email}>`);
            t.regex(mail.data.html, /Reset password/);
            done();
        });
        const response = await mailComponent.sendResetPasswordEmail(user, createValidJWT(user));
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });

    it.serial('should send a general action mail for destination', async t => {
        sinon.stub(transport, 'send', (mail, done) => {
            t.is(mail.data.to, user.email);
            t.is(mail.data.from, `DIH <${config.email}>`);
            t.regex(mail.data.html, /Take action/);
            done();
        });
        const response = await mailComponent.sendDestinationAction(1, 'accepted', user,
            'Take action',
            createValidJWT(user));
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });

    it.serial('should send a general info mail for destination', async t => {
        sinon.stub(transport, 'send', (mail, done) => {
            t.is(mail.data.to, user.email);
            t.is(mail.data.from, `DIH <${config.email}>`);
            t.regex(mail.data.html, /Information/);
            done();
        });
        const response = await mailComponent.sendDestinationInfo('rejected', user, 'Information');
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });
});
