module.exports = {
    up(migration, DataTypes) {
        return migration.changeColumn('trips', 'wishEndDate', {
            type: DataTypes.DATE,
            allowNull: true
        });
    },

    down(migration, DataTypes) {
        return migration.changeColumn('trips', 'wishEndDate', {
            type: DataTypes.DATE,
            allowNull: false
        });
    }

};
