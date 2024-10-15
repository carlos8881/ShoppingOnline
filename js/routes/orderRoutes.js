const express = require('express');
const orderController = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/checkout', orderController.checkout);
router.get('/get-orders', orderController.getOrders);
router.get('/get-order-detail', orderController.getOrderDetail);
router.put('/update-status', orderController.updateOrderStatus);
router.post('/add', reviewController.addReview);

module.exports = router;