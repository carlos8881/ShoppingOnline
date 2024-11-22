const CategoryDAO = require('../models/categoryDAO');

class CategoryService {
    constructor(db) {
        this.categoryDAO = new CategoryDAO(db);
    }

    getAllCategories(callback) {
        this.categoryDAO.getAllCategories(callback);
    }

    getCategoryById(categoryId, callback) {
        this.categoryDAO.getCategoryById(categoryId, callback);
    }
}

module.exports = CategoryService;