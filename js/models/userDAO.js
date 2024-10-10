class UserDAO {
    constructor(db) {
        this.db = db;
    }

    getUserByAccount(account, callback) {
        const query = 'SELECT id, password FROM users WHERE account = ?';
        this.db.query(query, [account], callback);
    }

    createUser(account, password, phoneNumber, email, callback) {
        const query = 'INSERT INTO users (account, password, phone_number, email) VALUES (?, ?, ?, ?)';
        this.db.query(query, [account, password, phoneNumber, email], callback);
    }
}

module.exports = UserDAO;