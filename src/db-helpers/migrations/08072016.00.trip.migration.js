
module.exports = {

    up(queryInterface) {
        return queryInterface.sequelize.query("ALTER TYPE enum_trips_status ADD VALUE 'LEFT'")
        .then(() =>
            queryInterface.sequelize.query("ALTER TYPE enum_trips_status ADD VALUE 'PRESENT'"
        ));
    },

    down() {
        return; // @ TODO SQL for teardown, Rebuild table with old ENUMs
    }
};
