const mysql = require('mysql2'); 
require('dotenv').config()

const db = mysql.createConnection({
    user: 'root', 
    host: '35.230.83.237', 
    password: process.env.DB_PASSWORD, 
    database: 'YoutuberMerchApi',
});

module.exports = { db }; 
