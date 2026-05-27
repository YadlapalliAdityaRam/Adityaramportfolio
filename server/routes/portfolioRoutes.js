const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolioSection } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPortfolio);
router.put('/:section', protect, updatePortfolioSection);

module.exports = router;
