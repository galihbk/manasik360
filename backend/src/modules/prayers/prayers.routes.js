const express = require('express');
const prayerController = require('./prayers.controller');
const router = express.Router();

router.get('/', prayerController.getAllPrayers);
router.post('/', prayerController.createPrayer);

module.exports = router;
