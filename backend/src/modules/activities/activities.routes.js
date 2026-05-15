const express = require('express');
const activityController = require('./activities.controller');
const router = express.Router();

router.get('/', activityController.getAllActivities);
router.post('/', activityController.createActivity);

module.exports = router;
