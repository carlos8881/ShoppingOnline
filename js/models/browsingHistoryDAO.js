class BrowsingHistoryDAO {
    constructor(db) {
        this.db = db;
    }

    addBrowsingHistory(account, productId) {
        const query = `
            INSERT INTO browsing_history (user_id, product_id)
            SELECT id, ? FROM users WHERE account = ?
            ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [productId, account], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    getBrowsingHistory(account) {
        const query = `
            SELECT bh.product_id, p.name, p.base_price, pi.image_url, bh.viewed_at
            FROM browsing_history bh
            JOIN users u ON bh.user_id = u.id
            JOIN products p ON bh.product_id = p.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE u.account = ?
            ORDER BY bh.viewed_at DESC
            LIMIT 10
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [account], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = BrowsingHistoryDAO;