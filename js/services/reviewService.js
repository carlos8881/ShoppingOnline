const ReviewDAO = require('../models/reviewDAO');
const OrderDAO = require('../models/orderDAO');
const db = require('../models/db');

class ReviewService {
    constructor() {
        this.reviewDAO = new ReviewDAO(db);
        this.orderDAO = new OrderDAO(db);
    }

    async addReview(orderId, userId, productId, content, rating) {
        const order = await this.orderDAO.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const review = {
            orderId,
            userId,
            productId,
            content,
            rating
        };

        await this.reviewDAO.createReview(review);
        return { success: true };
    }
}

module.exports = ReviewService;