class CategoryDAO {
    constructor(db) {
        this.db = db;
    }

    addProductCategory(productId, categoryId, callback) {
        const query = `
            INSERT INTO product_categories (product_id, category_id)
            VALUES (?, ?)
        `;
        this.db.query(query, [productId, categoryId], callback);
    }

    getAllCategories(callback) {
        const query = 'SELECT id, name, parent_id FROM categories';
        this.db.query(query, callback);
    }

    getCategoryById(categoryId, callback) {
        const query = 'SELECT id, name, parent_id FROM categories WHERE id = ?';
        this.db.query(query, [categoryId], callback);
    }
}

module.exports = CategoryDAO;