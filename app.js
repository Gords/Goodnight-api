const express = require('express');
const passport = require('passport');
const cors = require('cors');
const connectDatabase = require('./config/database');
const routes = require('./routes');

// Initialize passport config
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Goodnight API' });
});

// API routes
app.use('/api', routes);

// Error handlers
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
connectDatabase(app, PORT);

module.exports = app;