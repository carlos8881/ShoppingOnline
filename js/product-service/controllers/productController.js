const db = require('../models/db');
const upload = require('../middlewares/upload');

exports.addProduct = (req, res) => {
    const { name, description, base_price, main_category, sub_category, has_variants } = req.body;
    const coverImage = req.files['cover_image'] ? req.files['cover_image'][0].location : null;
    const contentImages = req.files['content_images'] ? req.files['content_images'].map(file => file.location) : [];

    if (!coverImage) {
        return res.status(400).send('封面圖片是必需的');
    }

    const productQuery = 'INSERT INTO products (name, description, base_price, has_variants) VALUES (?, ?, ?, ?)';
    db.query(productQuery, [name, description, base_price, has_variants === 'on'], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).send('添加商品失敗');
        }

        const productId = result.insertId;
        const categoryQuery = 'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)';

        // 插入主分類
        db.query(categoryQuery, [productId, main_category], (err, result) => {
            if (err) {
                console.error('Error inserting main category:', err);
                return res.status(500).send('添加主分類失敗');
            }

            // 插入子分類
            db.query(categoryQuery, [productId, sub_category], (err, result) => {
                if (err) {
                    console.error('Error inserting sub category:', err);
                    return res.status(500).send('添加子分類失敗');
                }

                // 插入變體信息
                if (has_variants === 'on') {
                    const variantNames = req.body.variant1_name;
                    const variantValues = req.body.variant1_values;
                    const variantStocks = req.body.variant1_stock;
                    const variantPrices = req.body.variant1_price;

                    const variantQuery = 'INSERT INTO product_variants (product_id, variant_name, variant_value) VALUES ?';
                    const variantData = variantValues.map((value, index) => [productId, variantNames, value]);

                    db.query(variantQuery, [variantData], (err, result) => {
                        if (err) {
                            console.error('Error inserting variants:', err);
                            return res.status(500).send('添加變體失敗');
                        }

                        const variantIds = result.insertId;

                        const attributeQuery = 'INSERT INTO variant_attributes (variant_id, stock, price) VALUES ?';
                        const attributeData = variantValues.map((value, index) => [variantIds + index, variantStocks[index], variantPrices[index]]);

                        db.query(attributeQuery, [attributeData], (err, result) => {
                            if (err) {
                                console.error('Error inserting variant attributes:', err);
                                return res.status(500).send('添加變體屬性失敗');
                            }

                            res.status(200).send('商品添加成功');
                        });
                    });
                } else {
                    res.status(200).send('商品添加成功');
                }
            });
        });
    });
};

exports.getProducts = (req, res) => {
    const query = `
        SELECT p.id, p.name, p.base_price, pi.image_url
        FROM products p
        JOIN product_images pi ON p.id = pi.product_id
        WHERE pi.is_cover = 1
    `;
    db.query(query, (err, results) => {
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
    const query = `
        SELECT p.name, p.base_price, p.description, p.has_variants, pi.image_url
        FROM products p
        JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ? AND pi.is_cover = 1
    `;
    db.query(query, [productId], (err, results) => {
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
    const query = `
        SELECT image_url
        FROM product_images
        WHERE product_id = ?
    `;
    db.query(query, [productId], (err, results) => {
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
    const query = `
        SELECT v.id, v.variant_combination, v.price
        FROM product_variants v
        WHERE v.product_id = ?
    `;
    db.query(query, [productId], (err, results) => {
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
    const query = `
        SELECT p.id, p.name, p.base_price, pi.image_url, c.name AS category_name
        FROM products p
        JOIN product_images pi ON p.id = pi.product_id
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON c.id = pc.category_id
        WHERE pc.category_id = ? AND pi.is_cover = 1
    `;
    db.query(query, [categoryId], (err, results) => {
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
    const query = `
        SELECT c.id, c.name
        FROM categories c
        JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
        ORDER BY c.parent_id ASC
    `;
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product categories:', err);
            res.status(500).send('Error fetching product categories');
            return;
        }
        res.json(results);
    });
};