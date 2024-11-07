const BrowsingHistoryService = require('../services/browsingHistoryService');
const browsingHistoryService = new BrowsingHistoryService();

exports.addBrowsingHistory = async (req, res) => {
    const { account, productId } = req.body;
    try {
        await browsingHistoryService.addBrowsingHistory(account, productId);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getBrowsingHistory = async (req, res) => {
    const { account } = req.query;
    try {
        const history = await browsingHistoryService.getBrowsingHistory(account);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};