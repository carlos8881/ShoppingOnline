const express = require('express');
const browsingHistoryController = require('../controllers/browsingHistoryController');
const router = express.Router();

router.post('/add', browsingHistoryController.addBrowsingHistory);
router.get('/get', browsingHistoryController.getBrowsingHistory);

module.exports = router;