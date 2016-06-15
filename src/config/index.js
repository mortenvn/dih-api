const config = {
    port: process.env.PORT || 9000,
    pgUrl: process.env.PG_URL || 'postgres://localhost/dih',
    nodeEnv: process.env.NODE_ENV || 'development',
    secret: process.env.SECRET || 'hemmelig',
    jwtExpiresIn: '30 days'
};
export default config;
