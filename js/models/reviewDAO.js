class ReviewDAO {
    constructor(db) {
        this.db = db;
    }

    createReview(review) {
        const { orderId, userId, productId, content, rating } = review;
        const query = `
            INSERT INTO reviews (order_id, user_id, product_id, content, rating, date)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [orderId, userId, productId, content, rating], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }
}

module.exports = ReviewDAO;