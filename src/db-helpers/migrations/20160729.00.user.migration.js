module.exports = {
    up(migration, DataTypes) {
        return migration.addColumn('users', 'volunteerInfo', {
            type: DataTypes.TEXT,
            defaultValue: ''
        });
    },

    down(migration) {
        return migration.removeColumn('users', 'volunteerInfo');
    }

};
