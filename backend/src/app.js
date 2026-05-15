const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Manasik360 API' });
});

// API Routes
app.use('/api', routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
