module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('media', {
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