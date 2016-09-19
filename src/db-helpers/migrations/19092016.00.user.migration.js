module.exports = {
    up(migration, DataTypes) {
        return migration.addColumn('users', 'emergencyContactInfo', {
            type: DataTypes.TEXT,
            allowNull: true
        });
    },

    down(migration) {
        return migration.removeColumn('users', 'emergencyContactInfo');
    }

};
