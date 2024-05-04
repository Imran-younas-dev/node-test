const sequelizeLogger = require('sequelize-log-syntax-colors')
const options = {
    dialect: 'mysql',
    host: process.env.MYSQL_DB_HOST || '127.0.0.1',
    username: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    define: {
        underscored: true,
    },
    sync: {
        force: !!process.env.MYSQL_DB_SYNC,
    },
}

if (process.env.MYSQL_DB_LOGGING === false) {
    options.logging = process.env.MYSQL_DB_LOGGING
} else {
    options.logging = function (text) {
        // eslint-disable-next-line
        console.log(sequelizeLogger.default(text))
    }
    options.benchmark = true
    options.logQueryParameters = true
}

module.exports = options
