import { describe } from 'ava-spec';
import request from 'supertest-as-promised';
import { loadFixtures, getAllElements, createValidJWT } from '../helpers';
import app from '../../src/app';

let mailTemplateObjects;
let userObjects;
const URI = '/mailtemplates';
const mockTemplate = {
    html: 'hello world'
};

const fixtures = [
    'mailTemplates',
    'users'
];

describe.serial('MailTemplates API', it => {
    it.beforeEach(() =>
        loadFixtures(fixtures)
            .then(() => getAllElements('MailTemplate'))
            .then(response => {
                mailTemplateObjects = response;
            })
            .then(() => getAllElements('User'))
            .then(response => {
                userObjects = response;
            })
    );

    it('should retrieve a list of all mailTemplates', async t => {
        const response = await request(app)
            .get(URI)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.length, mailTemplateObjects.length);
    });


    it('should be able to get mailTemplate of specific id', async t => {
        const fixture = mailTemplateObjects[0];
        const response = await request(app)
            .get(`${URI}/${fixture.id}`)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .expect(200)
            .then(res => res.body);
        t.is(response.id, fixture.id);
    });

    it('should not be able to retrieve a mailTemplate that does not exist', async () => {
        await request(app)
            .get(`${URI}/100`)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .expect(404);
    });

    it('should be able to create a new mailTemplate ', async t => {
        const response = await request(app)
            .post(URI)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .send(mockTemplate)
            .expect(201)
            .then(res => res);
        t.is(response.body.html, mockTemplate.html);
    });

    it('should be able to update a mailTemplate', async () => {
        const fixture = mailTemplateObjects[0];
        const changedFixture = fixture;
        changedFixture.html = 'kek';
        await request(app)
            .put(`${URI}/${fixture.id}`)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .send(changedFixture)
            .expect(204);
    });

    it('should return 404 when you try to update a mailTemplate that does not exist', async () => {
        await request(app)
            .put(`${URI}/${mailTemplateObjects.length + 100}`)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .send(mockTemplate)
            .expect(404);
    });

    it('should be able to delete a mailTemplate', async t => {
        const response = await request(app)
            .delete(`${URI}/${mailTemplateObjects[0].id}`)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .expect(204)
            .then(() => request(app).get(URI)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`))
            .then(res => res.body);
        t.is(response.length, mailTemplateObjects.length - 1);
    });

    it('should return 404 when you try to delete an item that does not exist', async () => {
        await request(app)
            .delete(`${URI}/${mailTemplateObjects.length + 100}`)
            .set('Authorization', `Bearer ${createValidJWT(userObjects[1])}`)
            .expect(404);
    });
});
