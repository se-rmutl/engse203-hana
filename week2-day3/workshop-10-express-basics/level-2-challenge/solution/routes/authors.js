/**
 * routes/authors.js
 */

const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateAuthor } = require('../middleware/validate');

/**
 * GET /api/authors - Get all authors
 * Query: ?country=UK
 */
router.get('/', (req, res) => {
  let authors = dataStore.getAllAuthors();

  const { country } = req.query;
  if (country) {
    authors = authors.filter(a => a.country === country);
  }

  res.json({
    success: true,
    count: authors.length,
    data: authors
  });
});

/**
 * GET /api/authors/:id - Get author by ID (with books)
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const err = new Error('Author ID must be a number');
    err.statusCode = 400;
    return next(err);
  }

  const author = dataStore.getAuthorById(id);

  if (!author) {
    const err = new Error(`Author with ID ${id} not found`);
    err.statusCode = 404;
    return next(err);
  }

  const books = dataStore.getBooksByAuthor(id);

  res.json({
    success: true,
    data: {
      ...author,
      books
    }
  });
});

/**
 * POST /api/authors - Create new author
 */
router.post('/', validateAuthor, (req, res) => {
  const newAuthor = dataStore.addAuthor(req.body);

  res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: newAuthor
  });
});

/**
 * PUT /api/authors/:id - Update author
 * NOTE: This workshop uses full validation (all fields required) for update.
 */
router.put('/:id', validateAuthor, (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const err = new Error('Author ID must be a number');
    err.statusCode = 400;
    return next(err);
  }

  const updated = dataStore.updateAuthor(id, req.body);

  if (!updated) {
    const err = new Error(`Author with ID ${id} not found`);
    err.statusCode = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: 'Author updated successfully',
    data: updated
  });
});

/**
 * DELETE /api/authors/:id - Delete author
 * Rule: Cannot delete author if they still have books.
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const err = new Error('Author ID must be a number');
    err.statusCode = 400;
    return next(err);
  }

  const author = dataStore.getAuthorById(id);
  if (!author) {
    const err = new Error(`Author with ID ${id} not found`);
    err.statusCode = 404;
    return next(err);
  }

  const books = dataStore.getBooksByAuthor(id);
  if (books.length > 0) {
    const err = new Error('Cannot delete author with existing books');
    err.statusCode = 400;
    return next(err);
  }

  const deleted = dataStore.deleteAuthor(id);

  res.json({
    success: true,
    message: 'Author deleted successfully',
    data: deleted
  });
});

module.exports = router;
