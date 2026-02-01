# 🎓 Workshop 11 - Level 1: Product Management API

## 📌 ภาพรวม

Workshop นี้จะสอนการสร้าง **Product Management API** แบบ RESTful:
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Request validation ด้วย express-validator
- ✅ CORS configuration
- ✅ Error handling
- ✅ Filtering และ Pagination

**Code เต็ม 100%** - เน้นเรียนรู้และทำความเข้าใจ REST API

---

## 🎯 API Endpoints

```
GET    /api/products          → ดึงสินค้าทั้งหมด (with filters)
GET    /api/products/:id      → ดึงสินค้าตาม ID
POST   /api/products          → สร้างสินค้าใหม่
PUT    /api/products/:id      → แก้ไขสินค้าทั้งหมด
PATCH  /api/products/:id      → แก้ไขสินค้าบางส่วน
DELETE /api/products/:id      → ลบสินค้า
```

---

## 📁 โครงสร้างโปรเจค

```
level-1-guided/
├── .gitignore
├── package.json
├── server.js                    # Entry point
│
└── src/
    ├── app.js                   # Express configuration
    │
    ├── data/
    │   └── products.js          # In-memory data
    │
    ├── controllers/
    │   └── productController.js # Business logic
    │
    ├── routes/
    │   └── products.js          # API routes
    │
    ├── validators/
    │   └── productValidator.js  # Input validation
    │
    └── middleware/
        └── errorHandler.js      # Global error handler
```

---

## 🚀 Step 1: Project Setup

### 1.1 สร้างโฟลเดอร์

```bash
mkdir product-api
cd product-api

mkdir -p src/data src/controllers src/routes src/validators src/middleware
```

### 1.2 Initialize npm

```bash
npm init -y
```

### 1.3 ติดตั้ง dependencies

```bash
npm install express express-validator cors helmet
npm install --save-dev nodemon
```

**Dependencies:**
- `express` - Web framework
- `express-validator` - Input validation
- `cors` - CORS configuration
- `helmet` - Security headers
- `nodemon` - Auto-restart (dev only)

### 1.4 แก้ไข `package.json`

```json
{
  "name": "product-api",
  "version": "1.0.0",
  "description": "Product Management REST API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["api", "rest", "express", "products"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 1.5 สร้าง `.gitignore`

```
node_modules/
*.log
.env
.DS_Store
```

**💾 Commit:**
```bash
git init
git add .
git commit -m "Initial project setup"
```

---

## 📊 Step 2: Data Layer

### 2.1 สร้าง `src/data/products.js`

```javascript
// src/data/products.js

/**
 * In-memory data storage
 * ในโปรเจคจริงจะใช้ database
 */
let products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip",
    price: 42900,
    category: "Electronics",
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    description: "14-inch MacBook Pro with M3 chip",
    price: 59900,
    category: "Electronics",
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "AirPods Pro",
    description: "Active Noise Cancellation",
    price: 8990,
    category: "Electronics",
    stock: 100,
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

/**
 * Get all products
 */
function getAll() {
  return products;
}

/**
 * Get product by ID
 */
function getById(id) {
  return products.find(p => p.id === parseInt(id));
}

/**
 * Create new product
 */
function create(productData) {
  const newProduct = {
    id: nextId++,
    ...productData,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  return newProduct;
}

/**
 * Update product (full replacement)
 */
function update(id, productData) {
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) return null;
  
  products[index] = {
    id: parseInt(id),
    ...productData,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  
  return products[index];
}

/**
 * Partial update product
 */
function partialUpdate(id, updates) {
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...updates,
    id: parseInt(id), // ห้ามเปลี่ยน ID
    updatedAt: new Date().toISOString()
  };
  
  return products[index];
}

/**
 * Delete product
 */
function remove(id) {
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) return false;
  
  products.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  partialUpdate,
  remove
};
```

**💾 Commit:**
```bash
git add src/data/
git commit -m "Add in-memory product data storage"
```

---

## ✅ Step 3: Validators

### 3.1 สร้าง `src/validators/productValidator.js`

```javascript
// src/validators/productValidator.js
const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation rules for creating product
 */
exports.createProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for updating product
 */
exports.updateProduct = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for partial update
 */
exports.patchProduct = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for ID parameter
 */
exports.validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID')
];

/**
 * Validation rules for query parameters
 */
exports.validateQuery = [
  query('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

/**
 * Middleware to handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }
  
  next();
};
```

**📝 อธิบาย:**
- `body()` - validate request body
- `param()` - validate URL parameters
- `query()` - validate query strings
- `validationResult()` - รวบรวม errors
- แต่ละ field มี validation rules

**💾 Commit:**
```bash
git add src/validators/
git commit -m "Add input validation with express-validator"
```

---

## 🎮 Step 4: Controllers

### 4.1 สร้าง `src/controllers/productController.js`

```javascript
// src/controllers/productController.js
const Product = require('../data/products');

/**
 * GET /api/products
 * ดึงสินค้าทั้งหมด (with optional filters)
 */
exports.getAll = (req, res) => {
  try {
    let products = Product.getAll();
    
    // Filter by category
    if (req.query.category) {
      products = products.filter(p => 
        p.category === req.query.category
      );
    }
    
    // Filter by price range
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      products = products.filter(p => p.price >= minPrice);
    }
    
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      products = products.filter(p => p.price <= maxPrice);
    }
    
    // Search by name
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      count: paginatedProducts.length,
      data: paginatedProducts
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch products',
        details: error.message
      }
    });
  }
};

/**
 * GET /api/products/:id
 * ดึงสินค้าตาม ID
 */
exports.getById = (req, res) => {
  try {
    const product = Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch product',
        details: error.message
      }
    });
  }
};

/**
 * POST /api/products
 * สร้างสินค้าใหม่
 */
exports.create = (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const newProduct = Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create product',
        details: error.message
      }
    });
  }
};

/**
 * PUT /api/products/:id
 * แก้ไขสินค้าทั้งหมด (full replacement)
 */
exports.update = (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const updatedProduct = Product.update(req.params.id, {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    });
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update product',
        details: error.message
      }
    });
  }
};

/**
 * PATCH /api/products/:id
 * แก้ไขสินค้าบางส่วน (partial update)
 */
exports.partialUpdate = (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Convert types if present
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock) updates.stock = parseInt(updates.stock);
    
    const updatedProduct = Product.partialUpdate(req.params.id, updates);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in partialUpdate:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update product',
        details: error.message
      }
    });
  }
};

/**
 * DELETE /api/products/:id
 * ลบสินค้า
 */
exports.remove = (req, res) => {
  try {
    const deleted = Product.remove(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete product',
        details: error.message
      }
    });
  }
};
```

**💾 Commit:**
```bash
git add src/controllers/
git commit -m "Add product controller with CRUD operations"
```

---

## 🛣️ Step 5: Routes

### 5.1 สร้าง `src/routes/products.js`

```javascript
// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validator = require('../validators/productValidator');

/**
 * GET /api/products
 * Get all products (with filters)
 */
router.get('/',
  validator.validateQuery,
  validator.handleValidationErrors,
  productController.getAll
);

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.getById
);

/**
 * POST /api/products
 * Create new product
 */
router.post('/',
  validator.createProduct,
  validator.handleValidationErrors,
  productController.create
);

/**
 * PUT /api/products/:id
 * Update product (full replacement)
 */
router.put('/:id',
  validator.updateProduct,
  validator.handleValidationErrors,
  productController.update
);

/**
 * PATCH /api/products/:id
 * Partial update product
 */
router.patch('/:id',
  validator.patchProduct,
  validator.handleValidationErrors,
  productController.partialUpdate
);

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.remove
);

module.exports = router;
```

**💾 Commit:**
```bash
git add src/routes/
git commit -m "Add product routes with validation"
```

---

## ⚙️ Step 6: Express App & Middleware

### 6.1 สร้าง `src/middleware/errorHandler.js`

```javascript
// src/middleware/errorHandler.js

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;
```

### 6.2 สร้าง `src/app.js`

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*', // ในโปรเจคจริงควรกำหนด origin ที่อนุญาต
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Product Management API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      documentation: '/api/docs'
    }
  });
});

// API routes
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.url} not found`
    }
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
```

### 6.3 สร้าง `server.js`

```javascript
// server.js
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Product API Server`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/products`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
  
  // Force shutdown after 10s
  setTimeout(() => {
    console.error('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

**💾 Commit:**
```bash
git add src/app.js src/middleware/ server.js
git commit -m "Add Express app configuration and middleware"
```

---

## 🧪 Step 7: ทดสอบ API

### 7.1 Start server

```bash
npm run dev
```

### 7.2 ทดสอบด้วย Postman

**1. GET All Products**
```
GET http://localhost:3000/api/products
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  },
  "count": 3,
  "data": [...]
}
```

**2. GET with Filters**
```
GET http://localhost:3000/api/products?category=Electronics
GET http://localhost:3000/api/products?minPrice=10000&maxPrice=50000
GET http://localhost:3000/api/products?search=Pro
```

**3. GET by ID**
```
GET http://localhost:3000/api/products/1
```

**4. POST Create Product**
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship",
  "price": 32900,
  "category": "Electronics",
  "stock": 25
}
```

**5. PUT Update (Full)**
```
PUT http://localhost:3000/api/products/4
Content-Type: application/json

{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Ultra version",
  "price": 45900,
  "category": "Electronics",
  "stock": 15
}
```

**6. PATCH Update (Partial)**
```
PATCH http://localhost:3000/api/products/4
Content-Type: application/json

{
  "price": 43900,
  "stock": 20
}
```

**7. DELETE Product**
```
DELETE http://localhost:3000/api/products/4
```

---

## 🎯 Challenge Tasks

### Challenge 1: Sorting
เพิ่มความสามารถในการเรียงลำดับสินค้า

```javascript
// GET /api/products?sort=price&order=asc
// GET /api/products?sort=name&order=desc
```

### Challenge 2: Stock Status Filter
เพิ่ม filter สำหรับสินค้าที่มีสต็อก/หมดสต็อก

```javascript
// GET /api/products?inStock=true
// GET /api/products?inStock=false
```

### Challenge 3: Bulk Operations
เพิ่ม endpoint สำหรับอัพเดทหลายรายการพร้อมกัน

```javascript
// PATCH /api/products/bulk
// Body: { ids: [1, 2, 3], updates: { category: "Sale" } }
```

---

## 📝 สรุป

✅ สร้าง RESTful API ตามหลักการ  
✅ ใช้ express-validator ตรวจสอบ input  
✅ CRUD operations ครบถ้วน  
✅ HTTP methods และ status codes ถูกต้อง  
✅ CORS และ Security headers  
✅ Error handling ครบถ้วน  
✅ Filtering และ Pagination  

---

**เก่งมาก! Product API แรกของคุณพร้อมแล้ว! 🎉**

**Next:** เฉลย Challenge Tasks → [Solutions](./solutions/CHALLENGE_SOLUTIONS.md)
