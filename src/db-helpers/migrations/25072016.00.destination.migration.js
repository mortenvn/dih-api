
module.exports = {

    up(migration, DataTypes) {
        return [
            migration.addColumn('destinations', 'pendingStatusMailTemplateId', DataTypes.INTEGER),
            migration.addColumn('destinations', 'acceptedStatusMailTemplateId', DataTypes.INTEGER),
            migration.addColumn('destinations', 'rejectedStatusMailTemplateId', DataTypes.INTEGER)
        ];
    },

    down(migration) {
        return [
            migration.removeColumn('destinations', 'pendingStatusMailTemplateId'),
            migration.removeColumn('destinations', 'acceptedStatusMailTemplateId'),
            migration.removeColumn('destinations', 'rejectedStatusMailTemplateId')
        ];
    }

};
