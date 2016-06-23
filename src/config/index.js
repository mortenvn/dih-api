const config = {
    port: process.env.PORT || 9000,
    pgUrl: process.env.PG_URL || 'postgres://localhost/dih',
    nodeEnv: process.env.NODE_ENV || 'development',
    secret: process.env.SECRET || 'hemmelig',
    email: process.env.MAIL || 'server@email.com',
    web: process.env.WEB || 'localhost:9000',
    ses: {
        accessKeyId: process.env.SES_ACCESSID || '',
        secretAccessKey: process.env.SES_SECRETKEY || '',
        region: process.env.REGION || 'eu-west-1'
    },
    jwtExpiresIn: '30 days'
};
export default config;
