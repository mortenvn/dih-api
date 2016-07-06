
module.exports = {

    up(migration, DataTypes) {
        return [
            migration.addColumn('trips', 'hotel', DataTypes.STRING),
            migration.addColumn('trips', 'notes', DataTypes.TEXT)
        ];
    },

    down(migration) {
        return [
            migration.removeColumn('trips', 'hotel'),
            migration.removeColumn('trips', 'notes')
        ];
    }

};
