module.exports = {
    up(migration, DataTypes) {
        return migration.addColumn('destinations', 'startDate', {
            type: DataTypes.DATE,
            allowNull: true
        });
    },
    down(migration) {
        migration.removeColumn('destinations', 'startDate');
    }
};
