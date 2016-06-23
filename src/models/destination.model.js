
export default function (sequelize, DataTypes) {
    const Destination = sequelize.define('destination', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true
            }
        }
    }, {
        classMethods: {
            associate(models) {
                Destination.hasMany(models.Trip);
            }
        }
    });
    return Destination;
}
