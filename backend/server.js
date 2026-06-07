const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for dev/testing ease
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Support base64 images upload up to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set DB Connected State to false initially
app.set('dbConnected', false);

// MongoDB URI
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// Connect to MongoDB
console.log('Attempting to connect to MongoDB at:', dbUri.replace(/:[^:]+@/, ':****@')); // Hide password in logs
mongoose.connect(dbUri, {
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout before fallback
})
.then(async () => {
  console.log('>>> MongoDB connected successfully.');
  app.set('dbConnected', true);
  
  // Seed Default Admin User if none exists
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      
      console.log(`Seeding default admin user: username="${username}", password="${password}"`);
      const defaultAdmin = new Admin({
        username,
        password // Will be auto-hashed in pre-save hook
      });
      await defaultAdmin.save();
      console.log('>>> Default admin user seeded successfully.');
    }
  } catch (seedErr) {
    console.error('Error seeding default admin user:', seedErr.message);
  }
})
.catch(err => {
  console.warn('==================================================================');
  console.warn('WARNING: Could not connect to MongoDB database.');
  console.warn('Reason:', err.message);
  console.warn('The backend server will run in OFFLINE/MOCK mode using memory storage.');
  console.warn('Please check if MongoDB local service or Atlas connection string is active.');
  console.warn('==================================================================');
  app.set('dbConnected', false);
});

// Root route
app.get('/', (req, res) => {
  const dbStatus = app.get('dbConnected') ? 'Connected' : 'Offline/Mock Mode';
  res.json({
    message: 'Welcome to Shubham Chavan Portfolio REST API',
    status: 'Online',
    database: dbStatus,
    endpoints: {
      auth: '/api/admin',
      projects: '/api/projects',
      contacts: '/api/contacts',
      stats: '/api/stats'
    }
  });
});

// Register Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Global Error caught:', err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Port Binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`>>> Express server is running on port ${PORT}`);
});
