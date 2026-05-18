const express = require('express');
const chatController = require('./chat.controller');
const { protect } = require('../../middleware/authMiddleware');
const router = express.Router();

router.get('/', chatController.getMessages);
router.post('/', chatController.sendMessage);

// Protected Admin Routes
router.get('/sessions', protect, chatController.getSessions);
router.post('/reply', protect, chatController.adminReply);

module.exports = router;
