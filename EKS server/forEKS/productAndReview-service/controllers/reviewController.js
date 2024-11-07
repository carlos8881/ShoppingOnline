const ReviewService = require('../services/reviewService');
const reviewService = new ReviewService();

exports.addProductReview = async (req, res) => {
    const { orderId, productId, userId, reviewText, rating } = req.body;
    try {
        await reviewService.addProductReview(orderId, productId, userId, reviewText, rating);
        res.status(201).json({ message: 'Product review added successfully' });
    } catch (error) {
        console.error('Error adding product review:', error);
        res.status(500).json({ error: 'Error adding product review' });
    }
};

exports.getProductReview = async (req, res) => {
    const { orderId, productId } = req.params;
    try {
        const review = await reviewService.getProductReview(orderId, productId);
        res.status(200).json(review);
    } catch (error) {
        console.error('Error getting product review:', error);
        res.status(500).json({ error: 'Error getting product review' });
    }
};