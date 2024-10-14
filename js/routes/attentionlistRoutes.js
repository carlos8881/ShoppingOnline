const express = require('express');
const attentionlistController = require('../controllers/attentionlistController');

const router = express.Router();

router.post('/add', attentionlistController.addToAttentionlist);
router.get('/get-attention-list', attentionlistController.getAttentionlist);
router.delete('/remove', attentionlistController.removeFromAttentionlist);

module.exports = router;