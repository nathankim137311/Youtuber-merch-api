const mysql = require('mysql2'); 

const db = mysql.createConnection({
    user: 'root', 
    host: 'localhost', 
    password: 'my-secret-pw', 
    database: 'Youtuber-merch-api',
});

module.exports = { db }; 
