import migrate from './migrate';
import db from '../models';

export function syncDB({ force } = {}) {
    return db
        .sequelize
        .sync({ force });
}

export function migrateDB() {
    return migrate(db.sequelize)
        .up();
}
