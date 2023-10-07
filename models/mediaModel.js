module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('media', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        mediaTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mediaDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        mediaImage: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
    },
    {
        timestamps: false
    });

    return Media
}