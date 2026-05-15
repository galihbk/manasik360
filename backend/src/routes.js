const express = require('express');
const router = express.Router();
const { protect } = require('./middleware/authMiddleware');

// Import Module Routes
const authRoutes = require('./modules/auth/auth.routes');
const prayerRoutes = require('./modules/prayers/prayers.routes');
const activityRoutes = require('./modules/activities/activities.routes');
const reviewRoutes = require('./modules/reviews/reviews.routes');
const notificationRoutes = require('./modules/notifications/notifications.routes');
const feedbackRoutes = require('./modules/feedback/feedback.routes');
const vrtourRoutes = require('./modules/vrtour/vrtour.routes');

// Mount Routes
router.use('/auth', authRoutes); // Public (contains its own protection where needed)
router.use('/vrtour', vrtourRoutes); // Public (contains its own protection where needed)

// Protected Routes (Require Login)
router.use('/prayers', protect, prayerRoutes);
router.use('/activities', protect, activityRoutes);
router.use('/reviews', protect, reviewRoutes);
router.use('/notifications', protect, notificationRoutes);
router.use('/feedback', protect, feedbackRoutes);

module.exports = router;
