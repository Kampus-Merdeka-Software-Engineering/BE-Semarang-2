const path = require('path')
require('dotenv').config({path: path.join(__dirname, '../', '.env')})

module.exports = {
    USER: process.env.MYSQLUSER,
    PASSWORD: process.env.MYSQLPASSWORD,
    HOST: process.env.MYSQLHOST,
    PORT: process.env.MYSQLPORT,
    DB: process.env.MYSQLDATABASE,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}