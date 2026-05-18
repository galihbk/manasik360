const express = require('express');
const blogsController = require('./blogs.controller');
const { protect } = require('../../middleware/authMiddleware');
const router = express.Router();

router.get('/', blogsController.getAllBlogs);
router.post('/', protect, blogsController.createBlog);
router.put('/:id', protect, blogsController.updateBlog);
router.delete('/:id', protect, blogsController.deleteBlog);

module.exports = router;
