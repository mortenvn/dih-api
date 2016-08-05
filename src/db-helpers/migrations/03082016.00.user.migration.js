module.exports = {
    up(migration, DataTypes) {
        return migration.addColumn('users', 'readTerms', {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },

    down(migration) {
        return migration.removeColumn('users', 'readTerms');
    }

};
