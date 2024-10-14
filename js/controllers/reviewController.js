const ReviewService = require('../services/reviewService');
const reviewService = new ReviewService();

exports.addReview = async (req, res) => {
    try {
        const { orderId, content, rating } = req.body;
        const result = await reviewService.addReview(orderId, content, rating);
        res.json(result);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Error adding review');
    }
};