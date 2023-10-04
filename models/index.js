const dbConfig = require('../config/dbConfig')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize (
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        port: dbConfig.PORT,  
        dialect: dbConfig.dialect,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error: ' + err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.contacts = require('./contactModel')(sequelize, DataTypes)
db.newsletter = require('./newsletterModel')(sequelize, DataTypes)
db.review = require('./reviewModel')(sequelize, DataTypes)
db.products = require('./productModel')(sequelize, DataTypes)
db.medias = require('./mediaModel')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log("Database & tables created") 
})

// 1 to Many Relation
db.newsletter.hasMany(db.review, {
    foreignKey : "id_newsletter",
    as: 'review'
})

db.review.belongsTo(db.newsletter, {
    foreignKey : "id_newsletter",
    as: 'newsletter'
})

module.exports = db