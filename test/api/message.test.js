import { describe } from 'ava-spec';
import sinon from 'sinon';
import request from 'supertest-as-promised';
import { loadFixtures, getAllElements, createValidJWT } from '../helpers';
import { updateSNS } from '../../src/components/sms';
import { updateTransport } from '../../src/components/mail';
import app from '../../src/app';

const fixtures = [
    'users'
];

const URI = '/messages';
let users;
let sns;
let transport;
describe.serial('Message API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllElements('User'))
            .then(response => {
                users = response;
                sns = {
                    publish(data, callback) {
                        callback();
                    },
                    setSMSAttributes(data, callback) {
                        callback();
                    }
                };
                transport = {
                    send(data, callback) {
                        callback();
                    }
                };
                updateTransport(transport);
                updateSNS(sns);
            })
    );

    it('should return AuthenticationError when no jwt is passed', async t => {
        const response = await request(app)
            .post(URI)
            .expect(401);

        t.is(response.body.name, 'AuthenticationError');
        t.is(response.body.message, 'You need to authenicate to access this resource');
    });

    it('should return a 403 unauthorized', async t => {
        const validJwt = createValidJWT(users[0]);

        const response = await request(app)
            .post(URI)
            .set('Authorization', `Bearer ${validJwt}`)
            .expect(403);

        t.is(response.body.name, 'AuthorizationError');
        t.is(response.body.message, 'You are not authorized to access this resource');
    });

    it('should send an email to all recipients', async t => {
        sinon.stub(transport, 'send').yields(null);
        const validJwt = createValidJWT(users[1]);

        const response = await request(app)
            .post(URI)
            .send({
                medium: 'EMAIL',
                subject: 'IMPORTANT EMAIL',
                message: 'HELLO',
                recipients: users
            })
            .set('Authorization', `Bearer ${validJwt}`)
            .expect(200);

        t.is(transport.send.callCount, users.length);
        t.is(response.body.pending, 0);
        t.is(response.body.sent, users.length);
    });

    it('should send an sms to all recipients', async t => {
        sinon.stub(sns, 'publish').yields(null);
        const validJwt = createValidJWT(users[1]);

        const response = await request(app)
            .post(URI)
            .send({
                medium: 'SMS',
                sender: 'DIH',
                message: 'HELLO',
                recipients: users
            })
            .set('Authorization', `Bearer ${validJwt}`)
            .expect(200);

        t.is(sns.publish.callCount, users.length);
        t.is(response.body.pending, 0);
        t.is(response.body.sent, users.length);
    });
});
