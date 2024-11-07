const UserDAO = require('../models/userDAO');

class AuthService {
    constructor(db) {
        this.userDAO = new UserDAO(db);
    }

    // 注册用户的方法
    register(account, password, phoneNumber, email, callback) {
        this.userDAO.createUser(account, password, phoneNumber, email, callback);
    }

    // 一般账号密码登录的方法
    login(account, password, callback) {
        this.userDAO.getUserByAccount(account, (err, results) => {
            if (err) return callback(err);
            if (results.length > 0 && results[0].password === password) {
                callback(null, { message: 'Login successful', account });
            } else {
                callback(null, null);
            }
        });
    }

    // Google 登录的方法
    googleLogin(account, callback) {
        const query = 'INSERT INTO users (account, auth_provider) VALUES (?, ?) ON DUPLICATE KEY UPDATE auth_provider = VALUES(auth_provider)';
        this.userDAO.db.query(query, [account, 'google'], (err, results) => {
            if (err) return callback(err);
            this.userDAO.getUserByAccountPromise(account)
                .then(user => callback(null, user))
                .catch(err => callback(err));
        });
    }
}

module.exports = AuthService;