
module.exports = {

    up(migration, DataTypes) {
        return migration.addColumn('destinations', 'minimumTripDurationInDays', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
        });
    },

    down(migration) {
        return migration.removeColumn('destinations', 'minimumTripDurationInDays');
    }

};
