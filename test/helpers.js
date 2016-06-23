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
 * getAllDestinationElements - Gives you one of the fixture elements of a given type
 *
 * @return {Array}  - All fixture elements form db
 */
export function getAllDestinationElements() {
    return db.Destination.findAll();
}

/**
 * getAllUserElements - Gives you all of the user fixture elements
 *
 * @return {Array} - All user fixture elements from db
 */
export function getAllUserElements() {
    return db.User.findAll();
}

/**
 *
 */
export function createValidJWT(payload, expiresIn = config.jwtExpiresIn) {
    return jwt.sign(payload, config.secret, {
        expiresIn,
        subject: String(payload.id)
    });
}

export function createInvalidJWT(payload, expiresIn = config.jwtExpiresIn) {
    return jwt.sign(payload, `${config.secret}noise`, {
        expiresIn,
        subject: String(payload.id)
    });
}
