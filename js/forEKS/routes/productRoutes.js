const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/add-products', upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'content_images', maxCount: 8 }]), productController.addProduct);
router.get('/get-products', productController.getProducts);
router.get('/get-product-info', productController.getProductInfo);
router.get('/get-product-images', productController.getProductImages);
router.get('/get-product-variants', productController.getProductVariants);
router.get('/get-products-by-category', productController.getProductsByCategory);
router.get('/get-product-categories', productController.getProductCategories);
router.get('/get-product-reviews', productController.getProductReviews);

module.exports = router;