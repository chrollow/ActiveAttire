// controllers/reviewController.js
import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js'; // Ensure you have an order model
import asyncHandler from 'express-async-handler';

// Create a review
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    // Ensure the user has placed an order containing the product
    const userOrders = await Order.find({ user: req.user._id, 'orderItems.product': productId });

    if (userOrders.length === 0) {
        return res.status(400).json({ message: 'You can only review products you have ordered.' });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ user: req.user._id, productId });

    if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    // Create the review
    const review = await Review.create({
        user: req.user._id,
        productId,
        rating,
        comment,
    });

    res.status(201).json({ message: 'Review created successfully', review });
});
