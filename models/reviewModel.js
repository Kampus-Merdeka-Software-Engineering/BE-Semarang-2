module.exports = (sequelize, DataTypes) => {
    const review = sequelize.define('review', {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return review
}