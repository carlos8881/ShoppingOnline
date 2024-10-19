const ReviewDAO = require('../models/reviewDAO');
const db = require('../models/db');

class ReviewService {
    constructor() {
        this.reviewDAO = new ReviewDAO(db);
    }

    async addProductReview(orderId, productId, userId, reviewText, rating) {
        return this.reviewDAO.addProductReview(orderId, productId, userId, reviewText, rating);
    }

    async getProductReview(orderId, productId) {
        return this.reviewDAO.getProductReview(orderId, productId);
    }
}

module.exports = ReviewService;