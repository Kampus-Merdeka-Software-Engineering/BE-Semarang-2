module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productRate: {
            type: DataTypes.FLOAT,
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