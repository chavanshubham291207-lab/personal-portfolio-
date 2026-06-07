const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

// Memory store fallback if DB is not connected
let memoryVisitorCount = 1024; // Nice seed number for mock view

// Helper to check DB connection
const getDbStatus = (req) => req.app.get('dbConnected');

// @route   GET /api/stats
// @desc    Get website stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (getDbStatus(req)) {
      let stats = await Stats.findOne({ key: 'global' });
      if (!stats) {
        stats = new Stats({ key: 'global', visitorCount: 1 });
        await stats.save();
      }
      res.json({ visitorCount: stats.visitorCount });
    } else {
      res.json({ visitorCount: memoryVisitorCount });
    }
  } catch (err) {
    console.error('Fetch stats error:', err);
    res.status(500).json({ message: 'Server error retrieving stats' });
  }
});

// @route   POST /api/stats/increment
// @desc    Increment visitor counter
// @access  Public
router.post('/increment', async (req, res) => {
  try {
    if (getDbStatus(req)) {
      let stats = await Stats.findOne({ key: 'global' });
      if (!stats) {
        stats = new Stats({ key: 'global', visitorCount: 1 });
      } else {
        stats.visitorCount += 1;
        stats.lastUpdated = Date.now();
      }
      await stats.save();
      res.json({ visitorCount: stats.visitorCount });
    } else {
      memoryVisitorCount += 1;
      res.json({ visitorCount: memoryVisitorCount });
    }
  } catch (err) {
    console.error('Increment stats error:', err);
    res.status(500).json({ message: 'Server error updating stats' });
  }
});

module.exports = router;
