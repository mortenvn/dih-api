/**
 * Main config file used throughout the application
 * @module config
 * @type {object}
 * @property {integer} port - The port to expose to application to.
 * @property {string} pgUrl - The url used by sequlize to connect to postgres.
 * @property {string} nodeEnv - The environment to run the server in
 * @property {string} secret - The secret used to encrypt JWT`s and passwords
 * @property {string} jwtExpiresIn - The default expiration date for an JWT
 */
const config = {
    port: process.env.PORT || 9000,
    pgUrl: process.env.PG_URL || 'postgres://localhost/dih',
    nodeEnv: process.env.NODE_ENV || 'development',
    secret: process.env.SECRET || 'hemmelig',
    email: process.env.MAIL || 'info@dih.capra.me',
    web: process.env.WEB || 'http://localhost:3000',
    adminPassword: process.env.ADMIN_PASSWORD || 'capra2016',
    ses: {
        accessKeyId: process.env.SES_ACCESSID || '',
        secretAccessKey: process.env.SES_SECRETKEY || '',
        region: process.env.REGION || 'eu-west-1'
    },
    jwtExpiresIn: '30 days'
};
export default config;
