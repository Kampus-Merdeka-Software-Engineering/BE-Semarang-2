module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('contact', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        noHp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    return Contact
}