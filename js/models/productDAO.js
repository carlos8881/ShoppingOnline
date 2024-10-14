class ProductDAO {
    constructor(db) {
        this.db = db;
    }

    addProduct(product, callback) {
        const query = `
            INSERT INTO products (name, base_price, description, has_variants)
            VALUES (?, ?, ?, ?)
        `;
        const { name, base_price, description, has_variants } = product;
        this.db.query(query, [name, base_price, description, has_variants], callback);
    }

    getProductById(productId, callback) {
        const query = `
            SELECT p.id, p.name, p.base_price, p.description, p.has_variants, pi.image_url
            FROM products p
            JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ? AND pi.is_cover = 1
        `;
        this.db.query(query, [productId], callback);
    }

    getProducts(callback) {
        const query = `
            SELECT p.id, p.name, p.base_price, pi.image_url
            FROM products p
            JOIN product_images pi ON p.id = pi.product_id
            WHERE pi.is_cover = 1
        `;
        this.db.query(query, callback);
    }

    getProductReviews(productId, callback) {
        const query = `
            SELECT r.rating, r.content, r.date, r.images, u.account AS buyer_name, v.variant_combination AS variant
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN product_variants v ON r.variant_id = v.id
            WHERE r.product_id = ?
            ORDER BY r.date DESC
        `;
        this.db.query(query, [productId], callback);
    }
}

module.exports = ProductDAO;