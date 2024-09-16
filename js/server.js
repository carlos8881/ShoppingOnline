const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'shopping-online-db.c7usy6yuubcb.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: '!Boyqrex123',
    database: 'shopping_online_rds_db',
    connectTimeout: 10000
});

const s3Client = new S3Client({
    region: 'ap-northeast-1',
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'carlos-shopping-online',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/register', (req, res) => {
    const { account, password, phoneNumber, email } = req.body;
    const query = 'INSERT INTO users (account, password, phone_number, email) VALUES (?, ?, ?, ?)';
    db.query(query, [account, password, phoneNumber, email], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error registering user');
            return;
        }
        res.status(200).send('User registered successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/login', (req, res) => {
    const { account, password } = req.body;
    const query = 'SELECT * FROM users WHERE account = ? AND password = ?';
    db.query(query, [account, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Error logging in');
            return;
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful', account });
        } else {
            res.status(401).send('Invalid account or password');
        }
    });
});

app.post('/google-login', (req, res) => {
    const { account } = req.body;
    const query = 'INSERT INTO users (account, auth_provider) VALUES (?, ?) ON DUPLICATE KEY UPDATE auth_provider = VALUES(auth_provider)';
    db.query(query, [account, 'google'], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error logging in with Google');
            return;
        }
        res.status(200).send('Google login successful');
    });
});

// 處理添加商品的請求
app.post('/add-products', upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'content_images', maxCount: 8 }]), (req, res) => {
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
});


app.get('/get_categories', (req, res) => {
    const query = 'SELECT id, name, parent_id FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Error fetching categories');
            return;
        }

        const categories = results.reduce((acc, category) => {
            if (category.parent_id === null) {
                acc.push({ ...category, subcategories: [] });
            } else {
                const parentCategory = acc.find(cat => cat.id === category.parent_id);
                if (parentCategory) {
                    parentCategory.subcategories.push(category);
                }
            }
            return acc;
        }, []);

        res.json(categories);
    });
});

app.get('/get_categories_for_add_product', (req, res) => {
    const query = 'SELECT id, name, parent_id FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Error fetching categories');
            return;
        }

        // 展平分類結構
        const flattenCategories = (categories) => {
            let flatCategories = [];

            categories.forEach(category => {
                flatCategories.push({
                    id: category.id,
                    name: category.name,
                    parent_id: category.parent_id
                });

                if (category.subcategories && category.subcategories.length > 0) {
                    flatCategories = flatCategories.concat(flattenCategories(category.subcategories));
                }
            });

            return flatCategories;
        };

        // 將嵌套結構展平
        const categories = results.reduce((acc, category) => {
            if (category.parent_id === null) {
                acc.push({ ...category, subcategories: [] });
            } else {
                const parentCategory = acc.find(cat => cat.id === category.parent_id);
                if (parentCategory) {
                    parentCategory.subcategories.push(category);
                }
            }
            return acc;
        }, []);

        const flatCategories = flattenCategories(categories);

        res.json(flatCategories);
    });
});

app.get('/get-products', (req, res) => {
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
});

app.get('/get-product-info', (req, res) => {
    const productId = req.query.id;
    const query = `
        SELECT p.name, p.base_price, p.description, pi.image_url
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
});

app.get('/get-product-images', (req, res) => {
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
});

app.get('/get-products-by-category', (req, res) => {
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
});

app.get('/get-product-categories', (req, res) => {
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
});

app.post('/add-to-cart', (req, res) => {
    const { account, product_id, quantity } = req.body;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const addToCartQuery = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;
        db.query(addToCartQuery, [userId, product_id, quantity], (err, result) => {
            if (err) {
                console.error('Error adding to cart:', err);
                res.status(500).send('Error adding to cart');
                return;
            }
            res.json({ success: true });
        });
    });
});

app.get('/get-cart', (req, res) => {
    const account = req.query.account;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const getCartQuery = `
            SELECT ci.product_id, ci.quantity, p.name, p.base_price AS price, pi.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE ci.user_id = ?
        `;
        db.query(getCartQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching cart items:', err);
                res.status(500).send('Error fetching cart items');
                return;
            }
            res.json(results);
        });
    });
});

app.post('/update-cart-item', (req, res) => {
    const { account, product_id, change } = req.body;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const getCartItemQuery = `
            SELECT quantity
            FROM cart_items
            WHERE user_id = ? AND product_id = ?
        `;
        db.query(getCartItemQuery, [userId, product_id], (err, results) => {
            if (err) {
                console.error('Error fetching cart item:', err);
                res.status(500).send('Error fetching cart item');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('Cart item not found');
                return;
            }

            const currentQuantity = results[0].quantity;
            const newQuantity = currentQuantity + change;

            if (newQuantity <= 0) {
                const removeCartItemQuery = `
                    DELETE FROM cart_items
                    WHERE user_id = ? AND product_id = ?
                `;
                db.query(removeCartItemQuery, [userId, product_id], (err, result) => {
                    if (err) {
                        console.error('Error removing cart item:', err);
                        res.status(500).send('Error removing cart item');
                        return;
                    }

                    res.json({ success: true, newQuantity: 0 });
                });
            } else {
                const updateCartItemQuery = `
                    UPDATE cart_items
                    SET quantity = ?
                    WHERE user_id = ? AND product_id = ?
                `;
                db.query(updateCartItemQuery, [newQuantity, userId, product_id], (err, result) => {
                    if (err) {
                        console.error('Error updating cart item:', err);
                        res.status(500).send('Error updating cart item');
                        return;
                    }

                    res.json({ success: true, newQuantity: newQuantity });
                });
            }
        });
    });
});

app.post('/remove-cart-item', (req, res) => {
    const { account, product_id } = req.body;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const removeCartItemQuery = `
            DELETE FROM cart_items
            WHERE user_id = ? AND product_id = ?
        `;
        db.query(removeCartItemQuery, [userId, product_id], (err, result) => {
            if (err) {
                console.error('Error removing cart item:', err);
                res.status(500).send('Error removing cart item');
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).send('Cart item not found');
                return;
            }

            res.json({ success: true });
        });
    });
});

app.post('/checkout', (req, res) => {
    const { account, selectedItems, deliveryMethod } = req.body;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const getCartItemsQuery = `
            SELECT ci.product_id, ci.quantity, p.base_price AS price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;
        db.query(getCartItemsQuery, [userId], (err, cartItems) => {
            if (err) {
                console.error('Error fetching cart items:', err);
                res.status(500).send('Error fetching cart items');
                return;
            }

            let totalPrice = 0;
            cartItems.forEach(item => {
                const selectedItem = selectedItems.find(si => si.product_id === item.product_id);
                if (selectedItem) {
                    totalPrice += item.price * item.quantity;
                }
            });

            let deliveryPrice = 0;
            if (deliveryMethod === 'store-pickup') {
                deliveryPrice = 60;
            } else if (deliveryMethod === 'home-delivery') {
                deliveryPrice = 100;
            }

            const checkoutPrice = totalPrice + deliveryPrice;

            // 生成訂單編號
            const date = new Date();
            const orderNumber = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

            const createOrderQuery = `
                INSERT INTO orders (user_id, total_price, delivery_price, checkout_price, delivery_method, created_at, order_number)
                VALUES (?, ?, ?, ?, ?, NOW(), ?)
            `;
            db.query(createOrderQuery, [userId, totalPrice, deliveryPrice, checkoutPrice, deliveryMethod, orderNumber], (err, result) => {
                if (err) {
                    console.error('Error creating order:', err);
                    res.status(500).send('Error creating order');
                    return;
                }

                const orderId = result.insertId;
                const createOrderItemsQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, price)
                    VALUES ?
                `;
                const orderItems = selectedItems.map(item => [orderId, item.product_id, item.quantity, item.price]);
                db.query(createOrderItemsQuery, [orderItems], (err, result) => {
                    if (err) {
                        console.error('Error creating order items:', err);
                        res.status(500).send('Error creating order items');
                        return;
                    }

                    res.json({ success: true, totalPrice, deliveryPrice, checkoutPrice, orderNumber });
                });
            });
        });
    });
});

app.get('/get-orders', (req, res) => {
    const account = req.query.account;

    const getUserQuery = 'SELECT id FROM users WHERE account = ?';
    db.query(getUserQuery, [account], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;
        const getOrdersQuery = `
            SELECT o.id, o.total_price, o.delivery_price, o.checkout_price, o.delivery_method, o.created_at, o.order_number,
                   oi.product_id, oi.quantity, oi.price, p.name, pi.image_url
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN product_images pi ON p.id = pi.product_id AND pi.is_cover = 1
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
        db.query(getOrdersQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                res.status(500).send('Error fetching orders');
                return;
            }

            const orders = {};
            results.forEach(row => {
                if (!orders[row.id]) {
                    orders[row.id] = {
                        id: row.id,
                        total_price: row.total_price,
                        delivery_price: row.delivery_price,
                        checkout_price: row.checkout_price,
                        delivery_method: row.delivery_method,
                        created_at: row.created_at,
                        order_number: row.order_number,
                        items: []
                    };
                }
                orders[row.id].items.push({
                    product_id: row.product_id,
                    quantity: row.quantity,
                    price: row.price,
                    name: row.name,
                    image_url: row.image_url
                });
            });

            res.json(Object.values(orders));
        });
    });
});