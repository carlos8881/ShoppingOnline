const db = require('../models/db');
const crypto = require('crypto');

exports.checkout = (req, res) => {
    const { account, selectedItems, deliveryMethod } = req.body;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;

        let totalPrice = 0;
        selectedItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        let deliveryPrice = 0;
        if (deliveryMethod === 'store-pickup') {
            deliveryPrice = 60;
        } else if (deliveryMethod === 'home-delivery') {
            deliveryPrice = 100;
        }

        const checkoutPrice = totalPrice + deliveryPrice;

        // 生成訂單編號
        const date = new Date();
        const orderNumber = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const createOrderQuery = `
            INSERT INTO orders (user_id, total_price, delivery_price, checkout_price, delivery_method, created_at, order_number)
            VALUES (?, ?, ?, ?, ?, NOW(), ?)
        `;
        db.query(createOrderQuery, [userId, totalPrice, deliveryPrice, checkoutPrice, deliveryMethod, orderNumber], (err, result) => {
            if (err) {
                console.error('Error creating order:', err);
                res.status(500).send('Error creating order');
                return;
            }

            const orderId = result.insertId;
            const createOrderItemsQuery = `
                INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
                VALUES ?
            `;
            const orderItems = selectedItems.map(item => [orderId, item.product_id, item.variant_id, item.quantity, item.price]);
            db.query(createOrderItemsQuery, [orderItems], (err, result) => {
                if (err) {
                    console.error('Error creating order items:', err);
                    res.status(500).send('Error creating order items');
                    return;
                }

                res.json({ success: true, totalPrice, deliveryPrice, checkoutPrice, orderNumber });
            });
        });
    });
};

exports.getOrders = (req, res) => {
    const account = req.query.account;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const getOrdersQuery = `
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
        db.query(getOrdersQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                res.status(500).send('Error fetching orders');
                return;
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
                    variant_combination: row.variant_combination // 添加變體名稱
                });
            });

            res.json(Object.values(orders));
        });
    });
};