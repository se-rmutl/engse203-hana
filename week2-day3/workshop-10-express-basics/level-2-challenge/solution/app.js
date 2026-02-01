/**
 * app.js
 */

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const rateLimit = require('./middleware/rateLimit');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Rate limiting (applies to all routes)
app.use(rateLimit());

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Book Library API',
    version: process.env.API_VERSION,
    endpoints: {
      authors: '/api/authors',
      books: '/api/books',
      docs: '/api/docs'
    }
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res, next) => {
  try {
    const docPath = path.join(__dirname, 'docs', 'API_DOCS.md');
    const md = fs.readFileSync(docPath, 'utf-8');

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send(md);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});

// API routes
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
