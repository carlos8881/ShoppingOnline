const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/add-to-cart', cartController.addToCart);
router.get('/get-cart', cartController.getCart);
router.post('/update-cart-item', cartController.updateCartItem);
router.post('/remove-cart-item', cartController.removeCartItem);

module.exports = router;