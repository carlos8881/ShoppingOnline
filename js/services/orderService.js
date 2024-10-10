const OrderDAO = require('../models/OrderDAO');
const UserDAO = require('../models/userDAO');
const db = require('../models/db');
const crypto = require('crypto');

class OrderService {
    constructor() {
        this.orderDAO = new OrderDAO(db);
        this.userDAO = new UserDAO(db);
    }

    async checkout(account, selectedItems, deliveryMethod) {
        const user = await this.userDAO.getUserByAccount(account);
        if (!user) {
            throw new Error('User not found');
        }

        const userId = user.id;
        const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const deliveryPrice = deliveryMethod === 'store-pickup' ? 60 : 100;
        const checkoutPrice = totalPrice + deliveryPrice;

        const date = new Date();
        const orderNumber = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const order = {
            userId,
            totalPrice,
            deliveryPrice,
            checkoutPrice,
            deliveryMethod,
            orderNumber
        };

        const orderId = await this.orderDAO.createOrder(order);
        const orderItems = selectedItems.map(item => ({
            orderId,
            productId: item.product_id,
            variantId: item.variant_id,
            quantity: item.quantity,
            price: item.price
        }));

        await this.orderDAO.createOrderItems(orderItems);

        return { success: true, totalPrice, deliveryPrice, checkoutPrice, orderNumber };
    }

    async getOrders(account) {
        const user = await this.userDAO.getUserByAccount(account);
        if (!user) {
            throw new Error('User not found');
        }

        const userId = user.id;
        const orders = await this.orderDAO.getOrdersByUserId(userId);
        return orders;
    }
}

module.exports = OrderService;