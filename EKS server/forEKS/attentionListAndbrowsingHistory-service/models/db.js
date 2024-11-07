const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'shopping-online-db.c7usy6yuubcb.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: '!Boyqrex123',
    database: 'shopping_online_rds_db',
    connectTimeout: 10000
});

module.exports = db;