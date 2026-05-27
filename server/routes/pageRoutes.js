const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPages, savePages, savePage, deletePage } = require('../controllers/pageController');

// Public: read pages
router.get('/', getPages);

// Protected: write
router.post('/', protect, savePages);
router.put('/:pageId', protect, savePage);
router.delete('/:pageId', protect, deletePage);

module.exports = router;
