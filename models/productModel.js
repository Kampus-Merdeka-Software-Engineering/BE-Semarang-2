module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        productCategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps: false
    });

    return Product
}