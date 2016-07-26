/**
 * Entrypoint for starting the server
 * @module index
 */
import app from './app';
import config from './config';
import { migrateDB, syncDB, createDefaultAdmin } from './db-helpers';
import Sequelize from 'sequelize';

/**
 * listen - Starts the server with the config given by the environment variables
 *
 * @function listen
 * @memberof  module:index
 */
function listen() {
    app.listen(config.port, () => {
        console.log('Express server listening on %d, in %s mode', // eslint-disable-line
            config.port, app.get('env'));
    });
}

let db;
if (config.nodeEnv === 'development' || config.nodeEnv === 'test') db = syncDB();
else {
    db = migrateDB().catch(Sequelize.DatabaseError, () => syncDB())
    .then(() => createDefaultAdmin(config.adminPassword));
}

db.then(() => listen());
