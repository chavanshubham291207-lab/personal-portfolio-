const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Memory store fallback if DB is not connected
let memoryContacts = [
  {
    _id: 'mock-contact-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hey Shubham, I saw your IoT irrigation project! Are you open for a short internship starting this fall? Let me know!',
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    isRead: false
  },
  {
    _id: 'mock-contact-2',
    name: 'Prof. Rajesh Mehta',
    email: 'rmehta@college.edu',
    message: 'Excellent presentation on the RoadSoS monitoring system. Please send over your final draft report by Friday.',
    createdAt: new Date(Date.now() - 3600000 * 24), // 24 hours ago
    isRead: true
  }
];

// Helper to check DB connection
const getDbStatus = (req) => req.app.get('dbConnected');

// Nodemailer setup
const sendConfirmationEmail = async (contact) => {
  // If SMTP configs are not defined, we skip nodemailer and print to console
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('==================================================');
  console.log(`NEW CONTACT MESSAGE FROM: ${contact.name} (${contact.email})`);
  console.log(`MESSAGE: ${contact.message}`);
  console.log('==================================================');

  if (!host || !user || !pass) {
    console.log('INFO: SMTP credentials not fully configured in .env. Skipping confirmation email dispatch.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: port == 465, // true for 465, false for other ports
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"Shubham Chavan Portfolio" <${user}>`,
      to: contact.email,
      subject: 'Thank you for reaching out! | Shubham Chavan Portfolio',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Hello ${contact.name},</h2>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Thank you for contacting me through my portfolio website. I have received your message and will get back to you as soon as possible.
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <h4 style="margin: 0 0 5px 0; color: #475569;">Your message:</h4>
            <p style="margin: 0; color: #64748b; font-style: italic; font-size: 14px;">"${contact.message}"</p>
          </div>
          <p style="color: #334155; font-size: 15px;">
            In the meantime, feel free to check out my latest updates on <a href="https://github.com/shubham-chavan" style="color: #3b82f6; text-decoration: none; font-weight: 600;">GitHub</a> and <a href="https://www.linkedin.com/in/shubham-chavan" style="color: #3b82f6; text-decoration: none; font-weight: 600;">LinkedIn</a>.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            This is an automated confirmation email from Shubham Chavan's Portfolio.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully! MessageId:', info.messageId);
  } catch (err) {
    console.error('Error sending confirmation email via nodemailer:', err.message);
  }
};

// @route   POST /api/contacts
// @desc    Submit a contact form
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please include all fields (name, email, message)' });
  }

  try {
    let contactMsg;
    if (getDbStatus(req)) {
      const newContact = new Contact({ name, email, message });
      contactMsg = await newContact.save();
    } else {
      contactMsg = {
        _id: 'mock-contact-' + Date.now(),
        name,
        email,
        message,
        createdAt: new Date(),
        isRead: false
      };
      memoryContacts.unshift(contactMsg);
    }

    // Attempt to send email in background (don't block response)
    sendConfirmationEmail(contactMsg);

    res.status(201).json({
      success: true,
      message: 'Message received successfully!',
      data: contactMsg
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ message: 'Server error saving contact message' });
  }
});

// @route   GET /api/contacts
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (getDbStatus(req)) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } else {
      res.json(memoryContacts);
    }
  } catch (err) {
    console.error('Fetch contacts error:', err);
    res.status(500).json({ message: 'Server error retrieving contact messages' });
  }
});

// @route   PUT /api/contacts/:id/read
// @desc    Toggle contact read status (Admin only)
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    if (getDbStatus(req)) {
      const contact = await Contact.findById(req.params.id);
      if (!contact) return res.status(404).json({ message: 'Message not found' });
      contact.isRead = !contact.isRead;
      await contact.save();
      res.json(contact);
    } else {
      const index = memoryContacts.findIndex(c => c._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Message not found' });
      memoryContacts[index].isRead = !memoryContacts[index].isRead;
      res.json(memoryContacts[index]);
    }
  } catch (err) {
    console.error('Toggle read status error:', err);
    res.status(500).json({ message: 'Server error updating read status' });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact message (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    if (getDbStatus(req)) {
      const contact = await Contact.findById(req.params.id);
      if (!contact) return res.status(404).json({ message: 'Message not found' });

      await Contact.findByIdAndDelete(req.params.id);
      res.json({ message: 'Message deleted successfully' });
    } else {
      const initialLength = memoryContacts.length;
      memoryContacts = memoryContacts.filter(c => c._id !== req.params.id);
      if (memoryContacts.length === initialLength) {
        return res.status(404).json({ message: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
    }
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ message: 'Server error deleting message' });
  }
});

module.exports = router;
