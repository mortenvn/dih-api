import sequelizeFixtures from 'sequelize-fixtures';
import db from '../src/models';
import { syncDB } from '../src/model-helpers';
import path from 'path';

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
