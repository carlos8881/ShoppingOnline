const BrowsingHistoryDAO = require('../models/browsingHistoryDAO');
const db = require('../models/db');

class BrowsingHistoryService {
    constructor() {
        this.browsingHistoryDAO = new BrowsingHistoryDAO(db);
    }

    async addBrowsingHistory(account, productId) {
        return this.browsingHistoryDAO.addBrowsingHistory(account, productId);
    }

    async getBrowsingHistory(account) {
        return this.browsingHistoryDAO.getBrowsingHistory(account);
    }
}

module.exports = BrowsingHistoryService;