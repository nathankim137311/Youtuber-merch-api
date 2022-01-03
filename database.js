const mysql = require('mysql2'); 

const db = mysql.createConnection({
    user: 'nathan', 
    host: '172.17.0.1', 
    password: 'my-secret-pw', 
    database: 'Youtuber-merch-api',
});

module.exports = { db }; 
