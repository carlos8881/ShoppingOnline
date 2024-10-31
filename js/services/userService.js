const UserDAO = require('../models/userDAO');
const db = require('../models/db');
const userDAO = new UserDAO(db);

class UserService {
    getUserByAccount(account) {
        return userDAO.getUserByAccountPromise(account);
    }
}

module.exports = UserService;