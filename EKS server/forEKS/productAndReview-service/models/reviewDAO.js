class ReviewDAO {
    constructor(db) {
        this.db = db;
    }

    addProductReview(orderId, productId, userId, reviewText, rating) {
        const query = 'INSERT INTO product_reviews (order_id, product_id, user_id, review_text, rating) VALUES (?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            this.db.query(query, [orderId, productId, userId, reviewText, rating], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    getProductReview(orderId, productId) {
        const query = 'SELECT * FROM product_reviews WHERE order_id = ? AND product_id = ?';
        return new Promise((resolve, reject) => {
            this.db.query(query, [orderId, productId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows[0]);
            });
        });
    }
}

module.exports = ReviewDAO;