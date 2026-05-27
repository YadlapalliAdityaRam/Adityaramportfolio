const Portfolio = require('../models/Portfolio');

// @desc    Get portfolio data
// @route   GET /api/portfolio
// @access  Public
const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    
    // If no portfolio exists, create an empty one (first time setup)
    if (!portfolio) {
      portfolio = await Portfolio.create({});
    }
    
    res.json(portfolio);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update portfolio section
// @route   PUT /api/portfolio/:section
// @access  Private (Admin only)
const updatePortfolioSection = async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;

    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      portfolio = new Portfolio();
    }

    // Check if the section is valid in our schema
    if (portfolio[section] !== undefined) {
      portfolio[section] = data;
      const updatedPortfolio = await portfolio.save();
      res.json(updatedPortfolio);
    } else {
      res.status(400).json({ message: `Invalid section: ${section}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating portfolio' });
  }
};

module.exports = {
  getPortfolio,
  updatePortfolioSection
};
