/**
 * routes/books.js
 */

const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateBook } = require('../middleware/validate');

function attachAuthor(book) {
  const author = dataStore.getAuthorById(book.authorId);
  return {
    ...book,
    author: author || null
  };
}

/**
 * GET /api/books/search - Search books
 * Query: ?q=harry
 *
 * IMPORTANT: place this route before '/:id'
 */
router.get('/search', (req, res, next) => {
  const q = String(req.query.q ?? '').trim();

  if (!q) {
    const err = new Error('Query parameter "q" is required');
    err.statusCode = 400;
    return next(err);
  }

  const keyword = q.toLowerCase();

  const results = dataStore
    .getAllBooks()
    .filter(b => b.title.toLowerCase().includes(keyword))
    .map(attachAuthor);

  res.json({
    success: true,
    query: q,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/books - Get all books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res, next) => {
  let books = dataStore.getAllBooks();

  const { genre } = req.query;
  if (genre) {
    books = books.filter(b => b.genre === genre);
  }

  // Pagination
  const page = Math.max(parseInt(req.query.page ?? '1', 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10) || 10, 1), 100);

  const total = books.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * limit;
  const end = start + limit;

  const pagedBooks = books.slice(start, end).map(attachAuthor);

  res.json({
    success: true,
    count: pagedBooks.length,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasPrev: safePage > 1,
      hasNext: safePage < totalPages
    },
    data: pagedBooks
  });
});

/**
 * GET /api/books/:id - Get book by ID (with author)
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const err = new Error('Book ID must be a number');
    err.statusCode = 400;
    return next(err);
  }

  const book = dataStore.getBookById(id);

  if (!book) {
    const err = new Error(`Book with ID ${id} not found`);
    err.statusCode = 404;
    return next(err);
  }

  res.json({
    success: true,
    data: attachAuthor(book)
  });
});

/**
 * POST /api/books - Create new book
 * - Validate authorId exists
 */
router.post('/', validateBook, (req, res, next) => {
  const { authorId } = req.body;

  const author = dataStore.getAuthorById(authorId);
  if (!author) {
    const err = new Error(`Author with ID ${authorId} not found`);
    err.statusCode = 400;
    return next(err);
  }

  const created = dataStore.addBook(req.body);

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: attachAuthor(created)
  });
});

/**
 * PUT /api/books/:id - Update book
 * NOTE: This workshop uses full validation (all fields required) for update.
 */
router.put('/:id', validateBook, (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const err = new Error('Book ID must be a number');
    err.statusCode = 400;
    return next(err);
  }

  const { authorId } = req.body;

  const author = dataStore.getAuthorById(authorId);
  if (!author) {
    const err = new Error(`Author with ID ${authorId} not found`);
    err.statusCode = 400;
    return next(err);
  }

  const updated = dataStore.updateBook(id, req.body);

  if (!updated) {
    const err = new Error(`Book with ID ${id} not found`);
    err.statusCode = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: 'Book updated successfully',
    data: attachAuthor(updated)
  });
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const err = new Error('Book ID must be a number');
    err.statusCode = 400;
    return next(err);
  }

  const deleted = dataStore.deleteBook(id);

  if (!deleted) {
    const err = new Error(`Book with ID ${id} not found`);
    err.statusCode = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deleted
  });
});

module.exports = router;
