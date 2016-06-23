import { describe } from 'ava-spec';
import sinon from 'sinon';
import config from '../../src/config';
import { updateTransport, sendInvite } from '../../src/components/mail';

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
        updateTransport(transport);
    });

    it.serial('should send an invite email, and return the user', async t => {
        sinon.stub(transport, 'send').yields(null);
        const response = await sendInvite(user);
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });

    it.serial('should send an invite email, with correct content', async t => {
        sinon.stub(transport, 'send', (mail, done) => {
            t.is(mail.data.to, user.email);
            t.is(mail.data.from, `DIH <${config.email}>`);
            t.regex(mail.data.html, /Registrer brukerkonto/);
            done();
        });
        const response = await sendInvite(user);
        t.deepEqual(response, user);
        t.is(transport.send.callCount, 1);
    });
});
