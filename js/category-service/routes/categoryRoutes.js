const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/get_categories', categoryController.getCategories);
router.get('/get_categories_for_add_product', categoryController.getCategoriesForAddProduct);

module.exports = router;