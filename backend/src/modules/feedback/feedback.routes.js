const express = require('express');
const feedbackController = require('./feedback.controller');
const router = express.Router();

router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedbacks);

module.exports = router;
