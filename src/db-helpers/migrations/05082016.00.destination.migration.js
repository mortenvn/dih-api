module.exports = {
    up(migration, DataTypes, db) {
        return migration.addColumn('destinations', 'startDate', {
            type: DataTypes.DATE,
            allowNull: true
        })
        .then(() => (
            db.Destination.update({
                startDate: new Date()
            }, {
                where: {
                    startDate: null
                }
            })
        ));
    },
    down(migration) {
        return [
            migration.removeColumn('destinations', 'startDate'),
            migration.removeColumn('destinations', 'endDate')
        ];
    }
};
