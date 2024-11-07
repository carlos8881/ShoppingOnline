class UserDAO {
    constructor(db) {
        this.db = db;
    }

    // 回调版本的 getUserByAccount 方法
    getUserByAccount(account, callback) {
        const query = 'SELECT id, password FROM users WHERE account = ?';
        this.db.query(query, [account], callback);
    }

    // 创建用户的方法
    createUser(account, password, phoneNumber, email, callback) {
        const query = 'INSERT INTO users (account, password, phone_number, email) VALUES (?, ?, ?, ?)';
        this.db.query(query, [account, password, phoneNumber, email], callback);
    }

    // Promise 版本的 getUserByAccount 方法
    getUserByAccountPromise(account) {
        const query = 'SELECT id FROM users WHERE account = ?';
        return new Promise((resolve, reject) => {
            this.db.query(query, [account], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }
}

module.exports = UserDAO;