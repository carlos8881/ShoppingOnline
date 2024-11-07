const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/add-product-review', reviewController.addProductReview);
router.get('/product-reviews/:orderId/:productId', reviewController.getProductReview);

module.exports = router;