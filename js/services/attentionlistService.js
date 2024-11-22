const AttentionlistDAO = require('../models/attentionlistDAO');
const db = require('../models/db');

class AttentionlistService {
    constructor() {
        this.attentionlistDAO = new AttentionlistDAO(db);
    }

    async addToAttentionlist(userId, productId) {
        return new Promise((resolve, reject) => {
            this.attentionlistDAO.addToAttentionlist(userId, productId, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    async getAttentionlistByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.attentionlistDAO.getAttentionlistByUserId(userId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    async removeFromAttentionlist(userId, productId) {
        return new Promise((resolve, reject) => {
            this.attentionlistDAO.removeFromAttentionlist(userId, productId, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = AttentionlistService;