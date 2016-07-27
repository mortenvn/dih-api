module.exports = {
    up(migration, DataTypes) {
        return migration.changeColumn('users', 'birth', {
            type: DataTypes.DATE,
            allowNull: true
        });
    },

    down(migration, DataTypes) {
        return migration.changeColumn('users', 'birth', {
            type: DataTypes.DATE,
            allowNull: false
        });
    }

};
