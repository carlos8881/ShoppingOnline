class OrderDAO {
    constructor(db) {
        this.db = db;
    }

    createOrder(order, callback) {
        const { userId, totalPrice, deliveryPrice, checkoutPrice, deliveryMethod, orderNumber } = order;
        const query = `
            INSERT INTO orders (user_id, total_price, delivery_price, checkout_price, delivery_method, created_at, order_number)
            VALUES (?, ?, ?, ?, ?, NOW(), ?)
        `;
        this.db.query(query, [userId, totalPrice, deliveryPrice, checkoutPrice, deliveryMethod, orderNumber], callback);
    }

    getOrderById(orderId, callback) {
        const query = 'SELECT * FROM orders WHERE id = ?';
        this.db.query(query, [orderId], callback);
    }

    getOrdersByUserId(userId, callback) {
        const query = `
            SELECT o.id, o.total_price, o.delivery_price, o.checkout_price, o.delivery_method, o.created_at, o.order_number,
                   oi.product_id, oi.variant_id, oi.quantity, oi.price, p.name, pi.image_url, v.variant_combination
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_variants v ON oi.variant_id = v.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
        this.db.query(query, [userId], callback);
    }
}

module.exports = OrderDAO;