# 🎓 Workshop 10 - Level 1: Guided Workshop

## 📌 ภาพรวม

Workshop นี้จะสอนการสร้าง **Express.js API Server** พื้นฐานที่มี:
- Static file serving
- Custom middleware (logger, request timer)
- Multiple routes (home, users, products)
- Route parameters และ query strings
- Error handling middleware
- 404 Not Found handler

## 🎯 สิ่งที่จะได้เรียนรู้

✅ Setup Express application  
✅ Application-level middleware  
✅ Router-level middleware  
✅ Route parameters (`/users/:id`)  
✅ Query strings (`/search?q=keyword`)  
✅ Error handling  
✅ Static file serving  

---

## 📁 โครงสร้างโปรเจค

```
level-1-guided/
├── .env
├── .gitignore
├── package.json
├── server.js
├── app.js
├── routes/
│   ├── index.js
│   ├── users.js
│   └── products.js
├── middleware/
│   ├── logger.js
│   ├── requestTimer.js
│   └── errorHandler.js
└── public/
    └── index.html
```

---

## 🚀 Step 1: Setup Project

### 1.1 สร้างโครงสร้าง

```bash
mkdir -p level-1-guided/routes
mkdir -p level-1-guided/middleware
mkdir -p level-1-guided/public
cd level-1-guided
```

### 1.2 Initialize npm และติดตั้ง packages

```bash
npm init -y
npm install express dotenv morgan cors
npm install --save-dev nodemon
```

### 1.3 แก้ไข package.json

```json
{
  "name": "express-basics-level1",
  "version": "1.0.0",
  "description": "Express.js Basics - Guided Workshop",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["express", "api", "nodejs"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 1.4 สร้าง .env

```bash
# .env
PORT=3000
NODE_ENV=development
```

### 1.5 สร้าง .gitignore

```bash
# .gitignore
node_modules/
.env
*.log
.DS_Store
```

**💾 Commit:**
```bash
git add .
git commit -m "Setup Express.js project structure"
```

---

## 🛠️ Step 2: สร้าง Middleware

### 2.1 Logger Middleware

สร้างไฟล์ `middleware/logger.js`:

```javascript
// middleware/logger.js

/**
 * Logger middleware - บันทึกข้อมูล request
 * จะแสดง: HTTP Method, URL, Timestamp
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  
  // เรียก next() เพื่อส่งต่อไปยัง middleware ถัดไป
  next();
};

module.exports = logger;
```

**📝 อธิบาย:**
- `req.method` - HTTP method (GET, POST, etc.)
- `req.url` - URL path ที่ request
- `next()` - เรียกเพื่อส่งต่อไปยัง middleware/route ถัดไป
- ถ้าไม่เรียก `next()` request จะค้างไม่ได้ response

### 2.2 Request Timer Middleware

สร้างไฟล์ `middleware/requestTimer.js`:

```javascript
// middleware/requestTimer.js

/**
 * Request Timer middleware - วัดเวลาที่ใช้ในการ process request
 */
const requestTimer = (req, res, next) => {
  // บันทึกเวลาเริ่มต้น
  const start = Date.now();

  // Intercept res.send() เพื่อคำนวณเวลา
  const originalSend = res.send;
  
  res.send = function(...args) {
    // คำนวณเวลาที่ใช้
    const duration = Date.now() - start;
    console.log(`Request took ${duration}ms`);
    
    // เรียก original send
    originalSend.apply(res, args);
  };

  next();
};

module.exports = requestTimer;
```

**📝 อธิบาย:**
- Monkey patching `res.send()` เพื่อดัก response
- คำนวณเวลาจาก start ถึงเมื่อส่ง response
- แสดงเวลาที่ใช้ใน milliseconds

### 2.3 Error Handler Middleware

สร้างไฟล์ `middleware/errorHandler.js`:

```javascript
// middleware/errorHandler.js

/**
 * Error handling middleware - จัดการ errors แบบ centralized
 * ต้องมี 4 parameters (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  // Log error สำหรับ debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // กำหนด status code (default 500)
  const statusCode = err.statusCode || 500;

  // ส่ง error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
```

**📝 อธิบาย:**
- Error handling middleware ต้องมี 4 parameters
- `err.statusCode` - HTTP status code ที่ต้องการ
- แสดง stack trace เฉพาะ development mode
- `notFoundHandler` - สร้าง 404 error และส่งต่อไปยัง errorHandler

**💾 Commit:**
```bash
git add middleware/
git commit -m "Add custom middleware (logger, timer, error handler)"
```

---

## 🛣️ Step 3: สร้าง Routes

### 3.1 Home Routes

สร้างไฟล์ `routes/index.js`:

```javascript
// routes/index.js
const express = require('express');
const router = express.Router();

/**
 * GET / - Home page
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Express.js API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products'
    }
  });
});

/**
 * GET /health - Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /info - Server information
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    info: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV
    }
  });
});

module.exports = router;
```

### 3.2 Users Routes

สร้างไฟล์ `routes/users.js`:

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// Dummy data (จะใช้ database ในภายหลัง)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

/**
 * GET /api/users - Get all users
 * Query params: ?role=admin
 */
router.get('/', (req, res) => {
  // ตรวจสอบ query parameter
  const { role } = req.query;

  let filteredUsers = users;

  // กรองตาม role ถ้ามี
  if (role) {
    filteredUsers = users.filter(u => u.role === role);
  }

  res.json({
    success: true,
    count: filteredUsers.length,
    data: filteredUsers
  });
});

/**
 * GET /api/users/:id - Get user by ID
 * Route parameter: id
 */
router.get('/:id', (req, res) => {
  // แปลง id จาก string เป็น number
  const id = parseInt(req.params.id);

  // หา user
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users - Create new user
 * Body: { name, email, role }
 */
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name and email are required'
      }
    });
  }

  // สร้าง user ใหม่
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id - Update user
 * Body: { name, email, role }
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

/**
 * DELETE /api/users/:id - Delete user
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // ลบ user
  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;
```

### 3.3 Products Routes

สร้างไฟล์ `routes/products.js`:

```javascript
// routes/products.js
const express = require('express');
const router = express.Router();

// Dummy data
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'electronics', stock: 50 },
  { id: 2, name: 'Mouse', price: 29.99, category: 'electronics', stock: 200 },
  { id: 3, name: 'Desk', price: 199.99, category: 'furniture', stock: 30 }
];

/**
 * GET /api/products - Get all products
 * Query params: ?category=electronics&minPrice=100
 */
router.get('/', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  let filteredProducts = products;

  // กรองตาม category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // กรองตาม minPrice
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }

  // กรองตาม maxPrice
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
});

/**
 * GET /api/products/:id - Get product by ID
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        message: `Product with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: product
  });
});

/**
 * POST /api/products - Create new product
 */
router.post('/', (req, res) => {
  const { name, price, category, stock } = req.body;

  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name, price, and category are required'
      }
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category,
    stock: stock || 0
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

module.exports = router;
```

**💾 Commit:**
```bash
git add routes/
git commit -m "Add routes (home, users, products) with CRUD operations"
```

---

## 📄 Step 4: สร้าง Static HTML Page

สร้างไฟล์ `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Express.js API Server</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 800px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    h1 {
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 30px;
    }
    
    .endpoints {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
    
    .endpoint {
      display: flex;
      align-items: center;
      padding: 10px;
      margin: 5px 0;
      background: white;
      border-radius: 5px;
    }
    
    .method {
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: bold;
      margin-right: 10px;
      font-size: 12px;
    }
    
    .get { background: #61affe; color: white; }
    .post { background: #49cc90; color: white; }
    .put { background: #fca130; color: white; }
    .delete { background: #f93e3e; color: white; }
    
    .path {
      color: #333;
      font-family: monospace;
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Express.js API Server</h1>
    <p class="subtitle">Welcome to the Express.js Basics Workshop!</p>
    
    <div class="endpoints">
      <h2>📍 Available Endpoints</h2>
      
      <h3 style="margin-top: 20px; color: #667eea;">General</h3>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/health</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/info</span>
      </div>
      
      <h3 style="margin-top: 20px; color: #667eea;">Users</h3>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/api/users</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/api/users/:id</span>
      </div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="path">/api/users</span>
      </div>
      <div class="endpoint">
        <span class="method put">PUT</span>
        <span class="path">/api/users/:id</span>
      </div>
      <div class="endpoint">
        <span class="method delete">DELETE</span>
        <span class="path">/api/users/:id</span>
      </div>
      
      <h3 style="margin-top: 20px; color: #667eea;">Products</h3>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/api/products</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/api/products/:id</span>
      </div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="path">/api/products</span>
      </div>
    </div>
    
    <div class="footer">
      Made with ❤️ using Express.js
    </div>
  </div>
</body>
</html>
```

**💾 Commit:**
```bash
git add public/
git commit -m "Add static HTML page for API documentation"
```

---

## ⚙️ Step 5: สร้าง Main Application Files

### 5.1 app.js - Application Configuration

สร้างไฟล์ `app.js`:

```javascript
// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Import custom middleware
const logger = require('./middleware/logger');
const requestTimer = require('./middleware/requestTimer');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

// Create Express app
const app = express();

// ========================================
// Middleware Setup
// ========================================

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Third-party middleware
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logger

// Custom middleware
app.use(logger); // Custom logger
app.use(requestTimer); // Request timer

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// Routes
// ========================================

app.use('/', indexRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

// ========================================
// Error Handling
// ========================================

// 404 handler (ต้องอยู่หลัง routes ทั้งหมด)
app.use(notFoundHandler);

// Error handler (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

module.exports = app;
```

### 5.2 server.js - Server Startup

สร้างไฟล์ `server.js`:

```javascript
// server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});
```

**💾 Commit:**
```bash
git add app.js server.js
git commit -m "Add main application and server files"
```

---

## 🧪 Step 6: ทดสอบการทำงาน

### 6.1 เริ่มต้น Server

```bash
npm run dev
```

**ผลลัพธ์ที่คาดหวัง:**
```
==================================================
🚀 Server is running on port 3000
📍 URL: http://localhost:3000
🌍 Environment: development
==================================================
```

### 6.2 ทดสอบ Endpoints

**ทดสอบด้วย Browser:**
```
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/info
http://localhost:3000/api/users
http://localhost:3000/api/products
```

**ทดสอบด้วย curl:**

```bash
# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Filter users by role
curl http://localhost:3000/api/users?role=admin

# Create new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"user"}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/3

# Test 404
curl http://localhost:3000/nonexistent
```

### 6.3 สังเกตุ Console Log

เมื่อทำ request จะเห็น:
```
[2024-01-15T10:30:00.000Z] GET /api/users
GET /api/users 200 15.234 ms - 234
Request took 15ms
```

---

## 📝 Step 7: Challenge Tasks

### Challenge 1: เพิ่ม Search Endpoint

เพิ่ม endpoint สำหรับค้นหา users

```javascript
// GET /api/users/search?q=john
router.get('/search', (req, res) => {
  // TODO: ค้นหา users ที่มี name หรือ email ตรงกับ query
});
```

### Challenge 2: Pagination

เพิ่ม pagination สำหรับ users

```javascript
// GET /api/users?page=1&limit=10
router.get('/', (req, res) => {
  // TODO: เพิ่ม pagination logic
});
```

### Challenge 3: Validation Middleware

สร้าง middleware สำหรับ validate input

```javascript
// middleware/validateUser.js
const validateUser = (req, res, next) => {
  // TODO: validate user data
};
```

---

## 📊 บันทึกผลการทดลอง

สร้างไฟล์ `EXPERIMENT_RESULTS.md`:

```markdown
# 📊 ผลการทดลอง - Workshop 10 Level 1

## ผู้ทดลอง
- ชื่อ: [ระบุชื่อ]
- วันที่: [ระบุวันที่]

## การทดสอบ Endpoints

### 1. GET /api/users
**Request:**
```bash
curl http://localhost:3000/api/users
```

**Response:**
[บันทึก response]

**สังเกต:**
[บันทึกสิ่งที่สังเกตเห็น]

### 2. POST /api/users
[บันทึกผลการทดสอบ]

### 3. Middleware Testing
[บันทึกการทำงานของ middleware]

## สรุป
[สรุปสิ่งที่ได้เรียนรู้]
```

**💾 Commit:**
```bash
git add .
git commit -m "Complete Workshop 10 Level 1"
```

---

## 🎓 สิ่งที่ได้เรียนรู้

✅ Express.js setup และ configuration  
✅ Middleware concepts และการใช้งาน  
✅ Routing และ route parameters  
✅ Query strings  
✅ Request/Response handling  
✅ Error handling  
✅ Static file serving  

---

## 📚 Next Steps

เมื่อทำ Level 1 เสร็จแล้ว ไปทำ:
👉 [Level 2: Challenge Workshop](../level-2-challenge/README.md)

---

**💡 Tips:**
- ศึกษา Express.js middleware flow
- ทดสอบทุก endpoint
- ใช้ Postman สร้าง collection
- อ่าน Express.js documentation
