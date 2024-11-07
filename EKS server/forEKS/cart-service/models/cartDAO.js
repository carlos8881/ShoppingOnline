class CartDAO {
    constructor(db) {
        this.db = db;
    }

    addToCart(cartItem, callback) {
        const { userId, productId, variantId, quantity } = cartItem;
        const query = `
            INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;
        this.db.query(query, [userId, productId, variantId, quantity], callback);
    }

    getCartByUserId(userId, callback) {
        const query = `
            SELECT ci.product_id, ci.variant_id, ci.quantity, p.name, 
                   COALESCE(v.price, p.base_price) AS price, 
                   v.variant_combination, pi.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_variants v ON ci.variant_id = v.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE ci.user_id = ?
        `;
        this.db.query(query, [userId], callback);
    }

    updateCartItem(userId, productId, newQuantity, callback) {
        const query = `
            UPDATE cart_items
            SET quantity = ?
            WHERE user_id = ? AND product_id = ?
        `;
        this.db.query(query, [newQuantity, userId, productId], callback);
    }

    removeCartItem(userId, productId, callback) {
        const query = `
            DELETE FROM cart_items
            WHERE user_id = ? AND product_id = ?
        `;
        this.db.query(query, [userId, productId], callback);
    }
}

module.exports = CartDAO;