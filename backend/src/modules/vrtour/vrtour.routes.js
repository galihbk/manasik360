const express = require('express');
const vrtourController = require('./vrtour.controller');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');
const router = express.Router();

router.post('/upload', protect, restrictTo('ADMIN'), upload.single('panorama'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Tidak ada file yang diunggah' });
  }
  const filePath = `/uploads/panorama/${req.file.filename}`;
  res.json({ status: 'success', data: { filePath } });
});

// Public route for the viewer
router.get('/config', vrtourController.getTourConfig);
router.get('/config/:moduleId', vrtourController.getTourConfig);

// Admin only routes
router.get('/modules', protect, restrictTo('ADMIN'), vrtourController.getAllModules);
router.post('/modules', protect, restrictTo('ADMIN'), vrtourController.createModule);
router.delete('/modules/:id', protect, restrictTo('ADMIN'), vrtourController.deleteModule);

router.get('/scenes', protect, restrictTo('ADMIN'), vrtourController.getAllScenes);
router.post('/scenes', protect, restrictTo('ADMIN'), vrtourController.createScene);
router.post('/hotspots', protect, restrictTo('ADMIN'), vrtourController.addHotspot);
router.delete('/scenes/:id', protect, restrictTo('ADMIN'), vrtourController.deleteScene);

module.exports = router;
