const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (subject, htmlContent) => {
  if (!process.env.EMAIL_USER || !process.env.RECEIVER_EMAIL) {
    console.error('Email credentials not configured.');
    return;
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: subject,
    html: htmlContent
  };
  
  await transporter.sendMail(mailOptions);
};

// @desc    Notify visit
// @route   POST /api/notify/notify-visit
// @access  Public
const notifyVisit = async (req, res) => {
  try {
    const { page, deviceInfo } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const date = new Date().toLocaleString();

    const htmlContent = `
      <h2>New Portfolio Visit</h2>
      <p><strong>Time:</strong> ${date}</p>
      <p><strong>Page:</strong> ${page || 'Home'}</p>
      <p><strong>IP Address:</strong> ${ip}</p>
      <p><strong>Device/Browser:</strong> ${deviceInfo || userAgent}</p>
    `;

    await sendEmail('🚀 New Portfolio Visit', htmlContent);
    res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Notify visit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Notify email (subscription)
// @route   POST /api/notify/notify-email
// @access  Public
const notifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const date = new Date().toLocaleString();

    const htmlContent = `
      <h2>New Email Subscription</h2>
      <p><strong>Time:</strong> ${date}</p>
      <p><strong>Subscriber Email:</strong> ${email}</p>
    `;

    await sendEmail('📬 New Email Subscriber', htmlContent);
    res.status(200).json({ success: true, message: 'Subscription notification sent' });
  } catch (error) {
    console.error('Notify email error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit contact form
// @route   POST /api/notify/contact
// @access  Public
const contactSubmit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const date = new Date().toLocaleString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Time:</strong> ${date}</p>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>IP Address:</strong> ${ip}</p>
      <hr />
      <h3>Message:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    await sendEmail(`✉️ Contact: ${subject}`, htmlContent);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

module.exports = {
  notifyVisit,
  notifyEmail,
  contactSubmit
};
