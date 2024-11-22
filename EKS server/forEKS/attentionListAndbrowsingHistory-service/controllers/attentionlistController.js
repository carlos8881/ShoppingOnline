const AttentionlistService = require('../services/attentionlistService');
const UserService = require('../services/userService');
const attentionlistService = new AttentionlistService();
const userService = new UserService();

exports.addToAttentionlist = async (req, res) => {
    try {
        const { account, product_id } = req.body;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        await attentionlistService.addToAttentionlist(user.id, product_id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding to attentionlist:', error);
        res.status(500).send('Error adding to attentionlist');
    }
};

exports.getAttentionlist = async (req, res) => {
    try {
        const account = req.query.account;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const attentionlistItems = await attentionlistService.getAttentionlistByUserId(user.id);
        res.json(attentionlistItems);
    } catch (error) {
        console.error('Error fetching attentionlist items:', error);
        res.status(500).send('Error fetching attentionlist items');
    }
};

exports.removeFromAttentionlist = async (req, res) => {
    try {
        const { account, product_id } = req.body;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        await attentionlistService.removeFromAttentionlist(user.id, product_id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing from attentionlist:', error);
        res.status(500).send('Error removing from attentionlist');
    }
};