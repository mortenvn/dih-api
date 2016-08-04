module.exports = {
    up(migration, DataTypes) {
        return [
            migration.addColumn('users', 'phoneNumber', {
                type: DataTypes.STRING,
                allowNull: true
            }),
            migration.addColumn('users', 'medicalDegree', {
                type: DataTypes.STRING,
                allowNull: true
            }),
            migration.addColumn('users', 'medicalDegreeLicenseNumber', {
                type: DataTypes.STRING,
                allowNull: true
            }),
            migration.addColumn('users', 'languages', {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: ''
            })
        ];
    },

    down(migration) {
        return [
            migration.removeColumn('users', 'phoneNumber'),
            migration.removeColumn('users', 'medicalDegree'),
            migration.removeColumn('users', 'medicalDegreeLicenseNumber'),
            migration.removeColumn('users', 'languages')
        ];
    }

};
