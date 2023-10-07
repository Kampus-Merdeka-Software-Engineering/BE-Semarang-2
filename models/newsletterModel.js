module.exports = (sequelize, DataTypes) => {
    const Newsletter = sequelize.define('newsletter', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    });

    return Newsletter
}