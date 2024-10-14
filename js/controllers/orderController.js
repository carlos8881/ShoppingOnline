const OrderService = require('../services/orderService');
const orderService = new OrderService();

exports.checkout = async (req, res) => {
    try {
        const { account, selectedItems, deliveryMethod } = req.body;
        const result = await orderService.checkout(account, selectedItems, deliveryMethod);
        res.json(result);
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Error during checkout');
    }
};

exports.getOrders = async (req, res) => {
    try {
        const account = req.query.account;
        const orders = await orderService.getOrders(account);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const result = await orderService.updateOrderStatus(orderId, status);
        res.json(result);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Error updating order status');
    }
};