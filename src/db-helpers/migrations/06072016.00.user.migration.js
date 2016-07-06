
module.exports = {

    up(migration, DataTypes) {
        return migration.addColumn('users', 'notes', DataTypes.STRING);
    },

    down(migration) {
        return migration.removeColumn('users', 'notes');
    }

};
