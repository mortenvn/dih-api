
export default function (sequelize, DataTypes) {
    const Destination = sequelize.define('destination', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                isAlpha: true
            }
        }
    });
    return Destination;
}
