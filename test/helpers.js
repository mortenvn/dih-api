import sequelizeFixtures from 'sequelize-fixtures';
import db from '../src/models';
import { syncDB } from '../src/model-helpers';
import path from 'path';
import jwt from 'jsonwebtoken';
import config from '../src/config';

export function loadFixtures(fixtures) {
    const f = fixtures || [
        'users',
        'destinations'
    ];
    const fixturePaths = f.map(file => `${path.resolve(__dirname)}/fixtures/${file}.json`);
    return syncDB({ force: true })
        .then(() => sequelizeFixtures.loadFiles(fixturePaths, db));
}

/**
 * getAllElements - Gives you one of the fixture elements of a given type
 *
 * @param {model} - Model you want to get elements from
 * @return {Array}  - All fixture elements form db
 */
export function getAllElements(model) {
    return db[model].findAll()
        .then(objects => objects.map(object => object.toJSON()));
}

/**
 * getAllUserElements - Gives you all of the user fixture elements
 *
 * @return {Array} - All user fixture elements from db
 */
export function getAllUserElements() {
    return db.User.findAll().then(users => users.map(user => user.toJSON()));
}

/**
 * createValidJWT - Create a valid JWT for testing purposes
 *
 * @param {Object} payload
 * @return {String} - Valid JWT token
 */
export function createValidJWT(payload) {
    return jwt.sign(payload, config.secret, {
        expiresIn: config.jwtExpiresIn
    });
}

/**
 * createInvalidJWT - Create an invalid JWT for testing purposes
 *
 * @param {Object} payload
 * @return {String} - Invalid JWT token
 */
export function createInvalidJWT(payload) {
    return jwt.sign(payload, `${config.secret}noise`, {
        expiresIn: config.jwtExpiresIn
    });
}
