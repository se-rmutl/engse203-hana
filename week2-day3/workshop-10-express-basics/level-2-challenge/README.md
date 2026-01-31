# 🏆 Workshop 10 - Level 2: Challenge Workshop

## 📌 ภาพรวม

สร้าง **Book Library API** ที่มีฟีเจอร์ครบถ้วน โดยมี code structure ให้ 70% และต้องเขียนส่วนที่เหลือเอง

## 🎯 ฟีเจอร์ที่ต้องทำ

✅ CRUD operations สำหรับ Books และ Authors  
✅ Relationship (books belongs to author)  
✅ Search และ Filter  
✅ Pagination  
✅ Input Validation  
✅ Rate Limiting  
✅ API Documentation endpoint  

## 📁 โครงสร้างโปรเจค

```
level-2-challenge/
├── .env
├── .gitignore
├── package.json
├── server.js              # ✅ ให้มาครบ
├── app.js                 # ✅ ให้มาครบ
├── routes/
│   ├── authors.js         # 🔨 ต้องเขียนเอง 40%
│   └── books.js           # 🔨 ต้องเขียนเอง 40%
├── middleware/
│   ├── validate.js        # 🔨 ต้องเขียนเอง 60%
│   ├── rateLimit.js       # 🔨 ต้องเขียนเอง 50%
│   └── errorHandler.js    # ✅ ให้มาครบ
├── data/
│   └── dataStore.js       # ✅ ให้มาครบ (in-memory DB)
└── docs/
    └── API_DOCS.md        # เขียนบันทึก API
```

---

## 🚀 Setup Project

```bash
mkdir -p level-2-challenge/routes
mkdir -p level-2-challenge/middleware
mkdir -p level-2-challenge/data
mkdir -p level-2-challenge/docs
cd level-2-challenge

npm init -y
npm install express dotenv cors morgan joi
npm install --save-dev nodemon

git init
```

---

## 📝 Code ที่ให้มา (70%)

### 1. Environment & Config Files

**.env:**
```bash
PORT=3000
NODE_ENV=development
API_VERSION=1.0.0
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

**.gitignore:**
```bash
node_modules/
.env
*.log
```

**package.json:**
```json
{
  "name": "book-library-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "joi": "^17.11.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 2. `data/dataStore.js` (ให้มาครบ ✅)

```javascript
// data/dataStore.js - In-memory database

class DataStore {
  constructor() {
    this.authors = [
      { id: 1, name: 'J.K. Rowling', country: 'UK', birthYear: 1965 },
      { id: 2, name: 'George Orwell', country: 'UK', birthYear: 1903 },
      { id: 3, name: 'Haruki Murakami', country: 'Japan', birthYear: 1949 }
    ];

    this.books = [
      { id: 1, title: "Harry Potter and the Philosopher's Stone", authorId: 1, year: 1997, genre: 'Fantasy', isbn: '9780747532699' },
      { id: 2, title: '1984', authorId: 2, year: 1949, genre: 'Dystopian', isbn: '9780451524935' },
      { id: 3, title: 'Norwegian Wood', authorId: 3, year: 1987, genre: 'Fiction', isbn: '9780375704024' }
    ];

    this.nextAuthorId = 4;
    this.nextBookId = 4;
  }

  // Authors methods
  getAllAuthors() {
    return [...this.authors];
  }

  getAuthorById(id) {
    return this.authors.find(a => a.id === id);
  }

  addAuthor(author) {
    const newAuthor = { id: this.nextAuthorId++, ...author };
    this.authors.push(newAuthor);
    return newAuthor;
  }

  updateAuthor(id, data) {
    const index = this.authors.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.authors[index] = { ...this.authors[index], ...data };
    return this.authors[index];
  }

  deleteAuthor(id) {
    const index = this.authors.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    return this.authors.splice(index, 1)[0];
  }

  // Books methods
  getAllBooks() {
    return [...this.books];
  }

  getBookById(id) {
    return this.books.find(b => b.id === id);
  }

  getBooksByAuthor(authorId) {
    return this.books.filter(b => b.authorId === authorId);
  }

  addBook(book) {
    const newBook = { id: this.nextBookId++, ...book };
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id, data) {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    this.books[index] = { ...this.books[index], ...data };
    return this.books[index];
  }

  deleteBook(id) {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    return this.books.splice(index, 1)[0];
  }
}

module.exports = new DataStore();
```

### 3. `server.js` (ให้มาครบ ✅)

```javascript
// server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`📚 Book Library API v${process.env.API_VERSION}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log('='.repeat(60));
});
```

### 4. `app.js` (ให้มาครบ ✅)

```javascript
// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

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

// API routes
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
```

### 5. `middleware/errorHandler.js` (ให้มาครบ ✅)

```javascript
// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: err.details.map(d => d.message)
      }
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
```

---

## 🔨 Code ที่ต้องเขียนเอง (30%)

### 6. `middleware/validate.js` (เขียนเอง 60% 🔨)

```javascript
// middleware/validate.js
const Joi = require('joi');

// Author validation schema
const authorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(50).required(),
  birthYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required()
});

// Book validation schema
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  authorId: Joi.number().integer().required(),
  year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  genre: Joi.string().min(2).max(50).required(),
  isbn: Joi.string().pattern(/^[0-9-]+$/).required()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    // TODO: validate req.body กับ schema
    // ถ้า validation ผ่าน เรียก next()
    // ถ้า validation ไม่ผ่าน เรียก next(error)
    
    // YOUR CODE HERE
    
  };
};

module.exports = {
  validateAuthor: validate(authorSchema),
  validateBook: validate(bookSchema)
};
```

**💡 Hints:**
<details>
<summary>คลิกดู hints</summary>

```javascript
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    
    next();
  };
};
```
</details>

### 7. `middleware/rateLimit.js` (เขียนเอง 50% 🔨)

```javascript
// middleware/rateLimit.js

const rateLimit = () => {
  // ใช้ Map เก็บ request count
  const requests = new Map();

  return (req, res, next) => {
    // TODO: ดึง IP address จาก request
    // TODO: ตรวจสอบจำนวน requests ใน time window
    // TODO: ถ้าเกิน limit ให้ส่ง 429 Too Many Requests
    // TODO: ถ้าไม่เกิน ให้บันทึกและเรียก next()
    
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000; // 15 min
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    // YOUR CODE HERE
    // คำแนะนำ:
    // 1. เช็คว่า IP นี้มีใน Map หรือยัง
    // 2. ถ้ามี ให้เช็คว่าอยู่ใน time window หรือไม่
    // 3. นับจำนวน requests
    // 4. ถ้าเกิน limit ส่ง error
    
  };
};

module.exports = rateLimit;
```

**💡 Hints:**
<details>
<summary>คลิกดู hints</summary>

```javascript
const rateLimit = () => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000;
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const requestTimestamps = requests.get(ip);
    const recentRequests = requestTimestamps.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests, please try again later'
        }
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};
```
</details>

### 8. `routes/authors.js` (เขียนเอง 40% 🔨)

```javascript
// routes/authors.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateAuthor } = require('../middleware/validate');

/**
 * GET /api/authors - Get all authors
 * Query: ?country=UK
 */
router.get('/', (req, res) => {
  // TODO: ดึง authors ทั้งหมด
  // TODO: ถ้ามี query param 'country' ให้กรองตาม country
  // TODO: ส่ง response พร้อม count และ data
  
  // YOUR CODE HERE
  
});

/**
 * GET /api/authors/:id - Get author by ID
 */
router.get('/:id', (req, res, next) => {
  // TODO: แปลง id เป็น number
  // TODO: หา author จาก dataStore
  // TODO: ถ้าไม่เจอ ส่ง 404
  // TODO: ถ้าเจอ ส่ง author พร้อม books ของ author
  
  // YOUR CODE HERE
  
});

/**
 * POST /api/authors - Create new author
 */
router.post('/', validateAuthor, (req, res) => {
  // TODO: สร้าง author ใหม่
  // TODO: ส่ง response status 201
  
  // YOUR CODE HERE
  
});

/**
 * PUT /api/authors/:id - Update author
 */
router.put('/:id', validateAuthor, (req, res, next) => {
  // TODO: อัพเดท author
  // TODO: ถ้าไม่เจอ ส่ง 404
  
  // YOUR CODE HERE
  
});

/**
 * DELETE /api/authors/:id - Delete author
 */
router.delete('/:id', (req, res, next) => {
  // TODO: ลบ author
  // TODO: ตรวจสอบว่า author มี books หรือไม่
  // TODO: ถ้ามี books ไม่ให้ลบ (ส่ง 400)
  
  // YOUR CODE HERE
  
});

module.exports = router;
```

**💡 Hints สำหรับ GET /api/authors:**
<details>
<summary>คลิกดู hints</summary>

```javascript
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
```
</details>

### 9. `routes/books.js` (เขียนเอง 40% 🔨)

```javascript
// routes/books.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateBook } = require('../middleware/validate');

/**
 * GET /api/books - Get all books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res) => {
  // TODO: ดึง books ทั้งหมด
  // TODO: กรองตาม genre ถ้ามี
  // TODO: เพิ่ม pagination (page, limit)
  // TODO: เพิ่มข้อมูล author ใน response
  
  // YOUR CODE HERE
  
});

/**
 * GET /api/books/:id - Get book by ID
 */
router.get('/:id', (req, res, next) => {
  // TODO: หา book
  // TODO: เพิ่มข้อมูล author
  // TODO: ส่ง response
  
  // YOUR CODE HERE
  
});

/**
 * GET /api/books/search - Search books
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  // TODO: ค้นหา books จาก title
  // TODO: ส่ง results
  
  // YOUR CODE HERE
  
});

/**
 * POST /api/books - Create new book
 */
router.post('/', validateBook, (req, res, next) => {
  // TODO: ตรวจสอบว่า authorId มีอยู่จริง
  // TODO: สร้าง book ใหม่
  // TODO: ส่ง response status 201
  
  // YOUR CODE HERE
  
});

/**
 * PUT /api/books/:id - Update book
 */
router.put('/:id', validateBook, (req, res, next) => {
  // TODO: อัพเดท book
  
  // YOUR CODE HERE
  
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  // TODO: ลบ book
  
  // YOUR CODE HERE
  
});

module.exports = router;
```

---

## ✅ Checklist

- [ ] `validate.js` - validation middleware
- [ ] `rateLimit.js` - rate limiting middleware  
- [ ] `routes/authors.js` - GET all authors
- [ ] `routes/authors.js` - GET author by ID (with books)
- [ ] `routes/authors.js` - POST new author
- [ ] `routes/authors.js` - PUT update author
- [ ] `routes/authors.js` - DELETE author (check books)
- [ ] `routes/books.js` - GET all books (with filters & pagination)
- [ ] `routes/books.js` - GET book by ID (with author)
- [ ] `routes/books.js` - Search books
- [ ] `routes/books.js` - POST new book (validate authorId)
- [ ] `routes/books.js` - PUT update book
- [ ] `routes/books.js` - DELETE book

---

## 🧪 Test Cases

```bash
# Authors
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/authors?country=UK
curl http://localhost:3000/api/authors/1
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","country":"UK","birthYear":1892}'

# Books
curl http://localhost:3000/api/books
curl http://localhost:3000/api/books?genre=Fantasy&page=1&limit=2
curl http://localhost:3000/api/books/1
curl http://localhost:3000/api/books/search?q=harry

# Rate Limiting (ทดสอบส่ง request เยอะๆ)
```

---

## 📝 บันทึกแนวทางและผลลัพธ์

สร้างไฟล์ `docs/API_DOCS.md` และบันทึก API endpoints ทั้งหมด

---

**Good luck! 🚀**
