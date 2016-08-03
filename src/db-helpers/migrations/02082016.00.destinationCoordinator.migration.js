module.exports = {

    up(migration, DataTypes) {
        return [
            migration.createTable('destinationCoordinators',
                {
                    destinationId: {
                        type: DataTypes.INTEGER,
                        unique: 'compositeIndex'
                    },
                    userId: {
                        type: DataTypes.INTEGER,
                        unique: 'compositeIndex'
                    },
                    startDate: {
                        type: DataTypes.DATE,
                        allowNull: true
                    },
                    endDate: {
                        type: DataTypes.DATE,
                        allowNull: true
                    }
                }
            )
        ];
    },

    down(migration) {
        return [
            migration.dropTable('destinationCoordinators')
        ];
    }

};
