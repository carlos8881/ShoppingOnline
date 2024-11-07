class AttentionlistDAO {
    constructor(db) {
        this.db = db;
    }

    addToAttentionlist(userId, productId, callback) {
        const query = `
            INSERT INTO attentionlist (user_id, product_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE user_id = user_id
        `;
        this.db.query(query, [userId, productId], callback);
    }

    getAttentionlistByUserId(userId, callback) {
        const query = `
            SELECT a.product_id, p.name, p.base_price, pi.image_url
            FROM attentionlist a
            JOIN products p ON a.product_id = p.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE a.user_id = ?
        `;
        this.db.query(query, [userId], callback);
    }

    removeFromAttentionlist(userId, productId, callback) {
        const query = `
            DELETE FROM attentionlist
            WHERE user_id = ? AND product_id = ?
        `;
        this.db.query(query, [userId, productId], callback);
    }
}

module.exports = AttentionlistDAO;