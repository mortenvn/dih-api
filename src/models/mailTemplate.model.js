export default function (sequelize, DataTypes) {
    const MailTemplate = sequelize.define('mailTemplate', {
        html: {
            type: DataTypes.TEXT,
            defaultValue: '<b>E-mail template</b>'
        }
    });
    return MailTemplate;
}
