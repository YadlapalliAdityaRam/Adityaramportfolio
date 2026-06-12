const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const pageRoutes = require('./routes/pageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render)
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for simplicity (allows external images/CDNs easily)
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ping endpoint for keep-alive and health checks
app.get('/api/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'pong' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/notify', notificationRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Backend API is running successfully in development mode!');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Keep-alive self-pinging to prevent Render free tier sleep
  const BACKEND_URL = process.env.BACKEND_URL;
  if (BACKEND_URL) {
    const pingInterval = 14 * 60 * 1000; // 14 minutes
    setInterval(async () => {
      try {
        const pingUrl = `${BACKEND_URL.replace(/\/$/, '')}/api/ping`;
        const response = await fetch(pingUrl);
        console.log(`[Keep-Alive] Self-ping status: ${response.status} (${response.statusText})`);
      } catch (err) {
        console.error('[Keep-Alive] Error self-pinging:', err.message);
      }
    }, pingInterval);
    console.log(`[Keep-Alive] Configured for ${BACKEND_URL} every 14 minutes.`);
  }
});

