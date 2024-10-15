class OrderDAO {
    constructor(db) {
        this.db = db;
    }

    createOrder(order) {
        const { userId, totalPrice, deliveryPrice, checkoutPrice, deliveryMethod, orderNumber } = order;
        const query = `
            INSERT INTO orders (user_id, total_price, delivery_price, checkout_price, delivery_method, created_at, order_number, shipping_status)
            VALUES (?, ?, ?, ?, ?, NOW(), ?, 'Pending')
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [userId, totalPrice, deliveryPrice, checkoutPrice, deliveryMethod, orderNumber], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }

    createOrderItems(orderItems) {
        const query = `
            INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
            VALUES ?
        `;
        const values = orderItems.map(item => [item.orderId, item.productId, item.variantId, item.quantity, item.price]);
        return new Promise((resolve, reject) => {
            this.db.query(query, [values], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    getOrdersByUserId(userId) {
        const query = `
            SELECT o.id, o.total_price, o.delivery_price, o.checkout_price, o.delivery_method, o.created_at, o.order_number, o.shipping_status,
                   oi.product_id, oi.variant_id, oi.quantity, oi.price, p.name, pi.image_url, v.variant_combination
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_variants v ON oi.variant_id = v.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                const orders = {};
                results.forEach(row => {
                    if (!orders[row.id]) {
                        orders[row.id] = {
                            id: row.id,
                            total_price: row.total_price,
                            delivery_price: row.delivery_price,
                            checkout_price: row.checkout_price,
                            delivery_method: row.delivery_method,
                            created_at: row.created_at,
                            order_number: row.order_number,
                            shipping_status: row.shipping_status,
                            items: []
                        };
                    }
                    orders[row.id].items.push({
                        product_id: row.product_id,
                        variant_id: row.variant_id,
                        quantity: row.quantity,
                        price: row.price,
                        name: row.name,
                        image_url: row.image_url,
                        variant_combination: row.variant_combination
                    });
                });
                resolve(Object.values(orders));
            });
        });
    }

    getOrderById(orderId) {
        const query = `
            SELECT o.id, o.user_id, o.total_price, o.delivery_price, o.checkout_price, o.delivery_method, o.created_at, o.order_number, o.shipping_status,
                   oi.product_id, oi.variant_id, oi.quantity, oi.price, p.name, pi.image_url, v.variant_combination,
                   r.rating, r.content, r.date
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_variants v ON oi.variant_id = v.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            LEFT JOIN reviews r ON o.id = r.order_id
            WHERE o.id = ?
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [orderId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                const order = {
                    id: results[0].id,
                    user_id: results[0].user_id,
                    total_price: results[0].total_price,
                    delivery_price: results[0].delivery_price,
                    checkout_price: results[0].checkout_price,
                    delivery_method: results[0].delivery_method,
                    created_at: results[0].created_at,
                    order_number: results[0].order_number,
                    shipping_status: results[0].shipping_status,
                    items: [],
                    reviews: []
                };
                results.forEach(row => {
                    order.items.push({
                        product_id: row.product_id,
                        variant_id: row.variant_id,
                        quantity: row.quantity,
                        price: row.price,
                        name: row.name,
                        image_url: row.image_url,
                        variant_combination: row.variant_combination
                    });
                    if (row.rating !== null) {
                        order.reviews.push({
                            rating: row.rating,
                            content: row.content,
                            date: row.date
                        });
                    }
                });
                resolve(order);
            });
        });
    }

    updateOrderStatus(orderId, status) {
        const query = `
            UPDATE orders
            SET shipping_status = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            this.db.query(query, [status, orderId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = OrderDAO;