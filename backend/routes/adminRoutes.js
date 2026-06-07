const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let admin = null;
    const isDbConnected = req.app.get('dbConnected');

    if (isDbConnected) {
      admin = await Admin.findOne({ username });
    }

    // Fallback: If DB is not connected or if seeding failed, check env vars directly
    const envAdminUser = process.env.ADMIN_USERNAME || 'admin';
    const envAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

    if (isDbConnected && admin) {
      // Check password using DB compare
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      // Direct comparison with env variables if DB is offline or user not in DB
      if (username !== envAdminUser || password !== envAdminPass) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Sign JWT Token
    const payload = {
      admin: {
        id: admin ? admin.id : 'mock-id',
        username: username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretportfoliojwttokenchangeinprod',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/me
// @desc    Get current logged-in admin status
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const isDbConnected = req.app.get('dbConnected');
    if (isDbConnected && req.admin.id !== 'mock-id') {
      const admin = await Admin.findById(req.admin.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(admin);
    } else {
      res.json({ username: req.admin.username, isMock: true });
    }
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
