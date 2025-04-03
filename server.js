const path = require('path');
const express = require('express');
const passport = require('passport');
require('./middleware/authStrategies');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { User, Job, Message } = require('./models');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// SQLite Configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: console.log
});

console.log('Using SQLite database at:', path.resolve('database.sqlite'));

// Test connection
sequelize.authenticate()
  .then(() => console.log('Connected to SQLite database'))
  .catch(err => console.error('Database connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Social Auth Routes
// Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  });

// Facebook OAuth  
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  });

// Job endpoints
app.post('/api/jobs', auth, [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('pay').trim().notEmpty().withMessage('Pay rate is required'),
  body('startDate').isISO8601().withMessage('Invalid start date format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const job = await Job.create({
      ...req.body,
      contractor: req.user.id
    });
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(400).json({ error: 'Failed to create job' });
  }
});

// Error handling
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle port in use errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    throw err;
  }
});
