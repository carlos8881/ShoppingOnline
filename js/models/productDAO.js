class ProductDAO {
    constructor(db) {
        this.db = db;
    }

    addProduct(product) {
        return new Promise((resolve, reject) => {
            const { name, description, base_price, has_variants } = product;
            const query = 'INSERT INTO products (name, description, base_price, has_variants) VALUES (?, ?, ?, ?)';
            this.db.query(query, [name, description, base_price, has_variants], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    getProductById(productId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM products WHERE id = ?';
            this.db.query(query, [productId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = ProductDAO;