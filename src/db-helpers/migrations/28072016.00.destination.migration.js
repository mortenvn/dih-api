
module.exports = {

    up(migration, DataTypes) {
        return [
            migration.addColumn('destinations', 'startDate', {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date()
            }),
            migration.addColumn('destinations', 'endDate', {
                type: DataTypes.DATE,
                allowNull: true
            })
        ];
    },

    down(migration) {
        return [
            migration.removeColumn('destinations', 'startDate'),
            migration.removeColumn('destinations', 'endDate')
        ];
    }

};
