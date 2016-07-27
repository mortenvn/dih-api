
module.exports = {

    up(migration, DataTypes) {
        return migration.addColumn('destinations', 'miminmumTripDurationInDays', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
        });
    },

    down(migration) {
        return migration.removeColumn('destinations', 'miminmumTripDurationInDays');
    }

};
