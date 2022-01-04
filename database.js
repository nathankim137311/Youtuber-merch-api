const mysql = require('mysql2'); 
const { config } = require('./config.js');

const db = mysql.createConnection({
    user: 'root', 
    host: '35.230.83.237', 
    password: config.DB_PASSWORD, 
    database: 'YoutuberMerchApi',
});

module.exports = { db }; 
