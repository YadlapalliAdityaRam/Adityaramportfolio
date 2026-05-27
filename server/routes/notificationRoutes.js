const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { notifyVisit, notifyEmail, contactSubmit } = require('../controllers/notificationController');

// Rate limiters
const visitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 visit notifications per hour
  message: { success: false, message: 'Too many visit requests' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 contact/email submissions per hour
  message: { success: false, message: 'Too many submissions. Please try again later.' }
});

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post('/notify-visit', visitLimiter, notifyVisit);

router.post('/notify-email', 
  contactLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
  ],
  validate,
  notifyEmail
);

router.post('/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').escape(),
    body('message').trim().notEmpty().withMessage('Message is required').escape()
  ],
  validate,
  contactSubmit
);

module.exports = router;
