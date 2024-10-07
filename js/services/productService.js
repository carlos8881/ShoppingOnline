// productService.js
const ProductDAO = require('../models/productDAO');
const CategoryDAO = require('../models/categoryDAO');

class ProductService {
    constructor(db) {
        this.productDAO = new ProductDAO(db);
        this.categoryDAO = new CategoryDAO(db);
    }

    addProduct(product, callback) {
        this.productDAO.addProduct(product, (err, result) => {
            if (err) return callback(err);

            const productId = result.insertId;
            const { main_category, sub_category } = product;

            this.categoryDAO.addProductCategory(productId, main_category, (err) => {
                if (err) return callback(err);

                this.categoryDAO.addProductCategory(productId, sub_category, callback);
            });
        });
    }

    getProductById(productId, callback) {
        this.productDAO.getProductById(productId, callback);
    }
}

module.exports = ProductService;