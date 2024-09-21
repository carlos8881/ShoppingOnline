const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'shopping-online-db.c7usy6yuubcb.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: '!Boyqrex123',
    database: 'shopping_online_rds_db',
    connectTimeout: 10000
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = db;