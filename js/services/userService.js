const UserDAO = require('../models/userDAO');
const db = require('../models/db');
const userDAO = new UserDAO(db);

class UserService {
    getUserByAccount(account) {
        return userDAO.getUserByAccount(account);
    }
}

module.exports = UserService;