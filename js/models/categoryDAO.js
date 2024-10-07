class CategoryDAO {
    constructor(db) {
        this.db = db;
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