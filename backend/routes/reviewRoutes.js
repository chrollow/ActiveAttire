// routes/reviewRoutes.js
import express from 'express';
import { createReview } from '../controllers/reviewController.js';

const router = express.Router();

// Route to create a review
router.post('/rev', createReview);

export default router;
