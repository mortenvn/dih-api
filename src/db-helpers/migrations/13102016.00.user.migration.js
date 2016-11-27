module.exports = {
    up(migration, DataTypes) {
        return migration.addColumn('users', 'isActive', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });
    },

    down(migration) {
        return migration.removeColumn('users', 'isActive');
    }

};
