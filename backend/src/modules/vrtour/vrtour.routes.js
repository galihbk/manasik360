const express = require('express');
const vrtourController = require('./vrtour.controller');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');
const router = express.Router();

const { exec } = require('child_process');
const path = require('path');

router.post('/upload', protect, restrictTo('ADMIN'), upload.single('panorama'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Tidak ada file yang diunggah' });
  }

  const absolutePath = path.resolve(req.file.path);

  if (process.platform === 'win32') {
    // Magic Fix for Google Street View Tile Overlap
    // A 7x3 512px tile grid produces 3584x1664/1665 images.
    // The actual 360 panorama data is only 3328px wide. The last 256px are overlap.
    const psCommand = `powershell -Command "Add-Type -AssemblyName System.Drawing; $src = [System.Drawing.Image]::FromFile('${absolutePath.replace(/'/g, "''")}'); if ($src.Width -eq 3584) { $bmp = New-Object System.Drawing.Bitmap(3328, 1664); $g = [System.Drawing.Graphics]::FromImage($bmp); $rect = New-Object System.Drawing.Rectangle(0, 0, 3328, 1664); $g.DrawImage($src, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel); $src.Dispose(); $temp = '${absolutePath.replace(/'/g, "''")}.tmp.jpg'; $bmp.Save($temp, [System.Drawing.Imaging.ImageFormat]::Jpeg); $g.Dispose(); $bmp.Dispose(); Move-Item -Path $temp -Destination '${absolutePath.replace(/'/g, "''")}' -Force; } else { $src.Dispose(); }"`;

    exec(psCommand, (err) => {
      if (err) console.error("Error auto-cropping Google Panorama overlap:", err);
      const filePath = `/uploads/panorama/${req.file.filename}`;
      res.json({ status: 'success', data: { filePath } });
    });
  } else {
    const filePath = `/uploads/panorama/${req.file.filename}`;
    res.json({ status: 'success', data: { filePath } });
  }
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
