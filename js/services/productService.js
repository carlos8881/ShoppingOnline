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

    getProducts(callback) {
        const query = `
            SELECT p.id, p.name, p.base_price, pi.image_url
            FROM products p
            JOIN product_images pi ON p.id = pi.product_id
            WHERE pi.is_cover = 1
        `;
        this.productDAO.db.query(query, callback);
    }

    getProductInfo(productId, callback) {
        const query = `
            SELECT p.name, p.base_price, p.description, p.has_variants, pi.image_url
            FROM products p
            JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ? AND pi.is_cover = 1
        `;
        this.productDAO.db.query(query, [productId], callback);
    }

    getProductImages(productId, callback) {
        const query = `
            SELECT image_url
            FROM product_images
            WHERE product_id = ?
        `;
        this.productDAO.db.query(query, [productId], callback);
    }

    getProductVariants(productId, callback) {
        const query = `
            SELECT v.id, v.variant_combination, v.price
            FROM product_variants v
            WHERE v.product_id = ?
        `;
        this.productDAO.db.query(query, [productId], callback);
    }

    getProductsByCategory(categoryId, callback) {
        const query = `
            SELECT p.id, p.name, p.base_price, pi.image_url, c.name AS category_name
            FROM products p
            JOIN product_images pi ON p.id = pi.product_id
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON c.id = pc.category_id
            WHERE pc.category_id = ? AND pi.is_cover = 1
        `;
        this.productDAO.db.query(query, [categoryId], callback);
    }

    getProductCategories(productId, callback) {
        const query = `
            SELECT c.id, c.name
            FROM categories c
            JOIN product_categories pc ON c.id = pc.category_id
            WHERE pc.product_id = ?
            ORDER BY c.parent_id ASC
        `;
        this.productDAO.db.query(query, [productId], callback);
    }

    getProductReviews(productId, callback) {
        this.productDAO.getProductReviews(productId, callback);
    }
}

module.exports = ProductService;