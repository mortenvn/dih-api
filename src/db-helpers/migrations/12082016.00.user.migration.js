module.exports = {
    up(migration, DataTypes) {
        return migration.changeColumn('users', 'languages', {
            type: DataTypes.TEXT,
            allowNull: true
        });
    },

    down(migration) {
        return migration.removeColumn('users', 'languages');
    }

};
