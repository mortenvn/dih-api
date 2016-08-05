
module.exports = {

    up(migration, DataTypes) {
        const tableName = 'trips';
        return [
            migration.sequelize.query("ALTER TYPE enum_trips_status ADD VALUE 'NO SHOW'"),
            migration.addColumn(tableName, 'dateArrived', {
                type: DataTypes.DATE,
                allowNull: true
            }),
            migration.addColumn(tableName, 'dateLeft', {
                type: DataTypes.DATE,
                allowNull: true
            }),
            migration.addColumn(tableName, 'statusComment', {
                type: DataTypes.TEXT,
                defaultValue: ''
            })
        ];
    },

    down(migration) {
        const tableName = 'trips';
        return [
            migration.removeColumn(tableName, 'dateArrived'),
            migration.removeColumn(tableName, 'dateLeft'),
            migration.removeColumn(tableName, 'statusComment')
        ];
    }
};
