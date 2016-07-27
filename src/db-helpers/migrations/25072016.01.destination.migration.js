import Promise from 'bluebird';

module.exports = {
    up(migration, DataTypes, db) {
        db.Destination.findAll({
            where: {
                pendingStatusMailTemplateId: null,
                acceptedStatusMailTemplateId: null,
                rejectedStatusMailTemplateId: null
            }
        }).then(destinations => {
            Promise.map(destinations, (d) => {
                const destination = d;
                Promise.all([
                    db.MailTemplate.create(),
                    db.MailTemplate.create(),
                    db.MailTemplate.create()
                ]).spread((mt1, mt2, mt3) => {
                    destination.pendingStatusMailTemplateId = mt1.id;
                    destination.acceptedStatusMailTemplateId = mt2.id;
                    destination.rejectedStatusMailTemplateId = mt3.id;
                })
                .then(() => destination.save());
            });
        });
    },

    down(migration) {
        return [
            migration.removeColumn('destinations', 'pendingStatusMailTemplateId'),
            migration.removeColumn('destinations', 'acceptedStatusMailTemplateId'),
            migration.removeColumn('destinations', 'rejectedStatusMailTemplateId')
        ];
    }

};
