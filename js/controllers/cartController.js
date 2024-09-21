const db = require('../models/db');

exports.addToCart = (req, res) => {
    const { account, product_id, variant_id, quantity } = req.body;

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
        const addToCartQuery = `
            INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;
        db.query(addToCartQuery, [userId, product_id, variant_id, quantity], (err, result) => {
            if (err) {
                console.error('Error adding to cart:', err);
                res.status(500).send('Error adding to cart');
                return;
            }
            res.json({ success: true });
        });
    });
};

exports.getCart = (req, res) => {
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
        const getCartQuery = `
            SELECT ci.product_id, ci.variant_id, ci.quantity, p.name, 
                   COALESCE(v.price, p.base_price) AS price, 
                   v.variant_combination, pi.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_variants v ON ci.variant_id = v.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE ci.user_id = ?
        `;
        db.query(getCartQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching cart items:', err);
                res.status(500).send('Error fetching cart items');
                return;
            }
            res.json(results);
        });
    });
};

exports.updateCartItem = (req, res) => {
    const { account, product_id, change } = req.body;

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
        const getCartItemQuery = `
            SELECT quantity
            FROM cart_items
            WHERE user_id = ? AND product_id = ?
        `;
        db.query(getCartItemQuery, [userId, product_id], (err, results) => {
            if (err) {
                console.error('Error fetching cart item:', err);
                res.status(500).send('Error fetching cart item');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('Cart item not found');
                return;
            }

            const currentQuantity = results[0].quantity;
            const newQuantity = currentQuantity + change;

            if (newQuantity <= 0) {
                const removeCartItemQuery = `
                    DELETE FROM cart_items
                    WHERE user_id = ? AND product_id = ?
                `;
                db.query(removeCartItemQuery, [userId, product_id], (err, result) => {
                    if (err) {
                        console.error('Error removing cart item:', err);
                        res.status(500).send('Error removing cart item');
                        return;
                    }

                    res.json({ success: true, newQuantity: 0 });
                });
            } else {
                const updateCartItemQuery = `
                    UPDATE cart_items
                    SET quantity = ?
                    WHERE user_id = ? AND product_id = ?
                `;
                db.query(updateCartItemQuery, [newQuantity, userId, product_id], (err, result) => {
                    if (err) {
                        console.error('Error updating cart item:', err);
                        res.status(500).send('Error updating cart item');
                        return;
                    }

                    res.json({ success: true, newQuantity: newQuantity });
                });
            }
        });
    });
};

exports.removeCartItem = (req, res) => {
    const { account, product_id } = req.body;

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
        const removeCartItemQuery = `
            DELETE FROM cart_items
            WHERE user_id = ? AND product_id = ?
        `;
        db.query(removeCartItemQuery, [userId, product_id], (err, result) => {
            if (err) {
                console.error('Error removing cart item:', err);
                res.status(500).send('Error removing cart item');
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).send('Cart item not found');
                return;
            }

            res.json({ success: true });
        });
    });
};