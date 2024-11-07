const db = require('../models/db');
const ProductService = require('../services/productService');
const upload = require('../middlewares/upload');

const productService = new ProductService(db);

exports.addProduct = (req, res) => {
    const { name, description, base_price, main_category, sub_category, has_variants } = req.body;
    const coverImage = req.files['cover_image'] ? req.files['cover_image'][0].location : null;
    const contentImages = req.files['content_images'] ? req.files['content_images'].map(file => file.location) : [];

    if (!coverImage) {
        return res.status(400).send('封面圖片是必需的');
    }

    const product = { name, description, base_price, main_category, sub_category, has_variants: has_variants === 'on', coverImage, contentImages };

    productService.addProduct(product, (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).send('添加商品失敗');
        }
        res.status(200).send('商品添加成功');
    });
};

exports.getProducts = (req, res) => {
    productService.getProducts((err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Error fetching products');
            return;
        }
        res.json(results);
    });
};

exports.getProductInfo = (req, res) => {
    const productId = req.query.id;
    productService.getProductInfo(productId, (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).send('Error fetching product');
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Product not found');
        }
    });
};

exports.getProductImages = (req, res) => {
    const productId = req.query.id;
    productService.getProductImages(productId, (err, results) => {
        if (err) {
            console.error('Error fetching product images:', err);
            res.status(500).send('Error fetching product images');
            return;
        }
        res.json(results);
    });
};

exports.getProductVariants = (req, res) => {
    const productId = req.query.id;
    productService.getProductVariants(productId, (err, results) => {
        if (err) {
            console.error('Error fetching product variants:', err);
            res.status(500).send('Error fetching product variants');
            return;
        }
        res.json(results);
    });
};

exports.getProductsByCategory = (req, res) => {
    const categoryId = req.query.category_id;
    productService.getProductsByCategory(categoryId, (err, results) => {
        if (err) {
            console.error('Error fetching products by category:', err);
            res.status(500).send('Error fetching products by category');
            return;
        }
        res.json(results);
    });
};

exports.getProductCategories = (req, res) => {
    const productId = req.query.id;
    productService.getProductCategories(productId, (err, results) => {
        if (err) {
            console.error('Error fetching product categories:', err);
            res.status(500).send('Error fetching product categories');
            return;
        }
        res.json(results);
    });
};

exports.getProductReviews = (req, res) => {
    const productId = req.query.id;
    productService.getProductReviews(productId, (err, reviews) => {
        if (err) {
            console.error('Error fetching product reviews:', err);
            res.status(500).send('Error fetching product reviews');
            return;
        }
        res.json(reviews);
    });
};