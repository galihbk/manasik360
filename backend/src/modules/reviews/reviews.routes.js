const express = require('express');
const reviewController = require('./reviews.controller');
const { protect } = require('../../middleware/authMiddleware');
const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.post('/', protect, reviewController.createReview);

module.exports = router;
