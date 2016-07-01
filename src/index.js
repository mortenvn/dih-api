/**
 * Entrypoint for starting the server
 * @module index
 */
import app from './app';
import config from './config';
import { migrateDB, syncDB } from './db-helpers';


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
if (config.nodeEnv === 'development') db = syncDB();
else db = migrateDB();

db.then(() => listen());
