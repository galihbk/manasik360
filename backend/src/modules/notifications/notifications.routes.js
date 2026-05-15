const express = require('express');
const notificationController = require('./notifications.controller');
const router = express.Router();

router.get('/', notificationController.getAllNotifications);
router.patch('/read-all', notificationController.markAsRead);

module.exports = router;
