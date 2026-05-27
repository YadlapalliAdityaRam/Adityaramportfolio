const Portfolio = require('../models/Portfolio');

// ─── GET all dynamic pages ───────────────────────────────
exports.getPages = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.json([]);
    res.json(portfolio.pages || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── SAVE (replace) all dynamic pages ───────────────────
exports.savePages = async (req, res) => {
  try {
    const { pages } = req.body;
    if (!Array.isArray(pages)) return res.status(400).json({ message: 'pages must be an array' });

    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    portfolio.pages = pages;
    await portfolio.save();
    res.json(portfolio.pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPSERT a single page ────────────────────────────────
exports.savePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const pageData = req.body;

    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    const idx = (portfolio.pages || []).findIndex(p => p.id === pageId);
    if (idx >= 0) {
      const existingPage = portfolio.pages[idx];
      portfolio.pages[idx] = {
        ...(existingPage.toObject?.() ?? existingPage),
        ...pageData
      };
    } else {
      portfolio.pages.push(pageData);
    }

    portfolio.markModified('pages');
    await portfolio.save();
    res.json(portfolio.pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE a page ───────────────────────────────────────
exports.deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    portfolio.pages = (portfolio.pages || []).filter(p => p.id !== pageId);
    portfolio.markModified('pages');
    await portfolio.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
