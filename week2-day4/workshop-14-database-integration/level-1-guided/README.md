# 🎓 Workshop 14 - Level 1: Todo API with Database

## 📌 ภาพรวม

Workshop นี้จะสอนการสร้าง **Todo API** ที่เชื่อมต่อกับ SQLite database:
- ✅ CRUD operations
- ✅ RESTful endpoints
- ✅ Error handling
- ✅ Input validation

**Code เต็ม 100%** - เน้นเรียนรู้และทำความเข้าใจ

---

## 🎯 API Endpoints

```
┌─────────────────────────────────────────────┐
│           Todo API Endpoints                │
└─────────────────────────────────────────────┘

GET    /api/todos          → ดึง todos ทั้งหมด
GET    /api/todos/:id      → ดึง todo ตาม ID
POST   /api/todos          → สร้าง todo ใหม่
PATCH  /api/todos/:id      → อัพเดทสถานะ
DELETE /api/todos/:id      → ลบ todo
GET    /api/todos/stats    → ดูสถิติ
```

---

## 📁 โครงสร้างโปรเจค

```
level-1-guided/
├── .env
├── .gitignore
├── package.json
├── server.js                 # Entry point
│
├── database/
│   ├── schema.sql           # Database structure
│   ├── seed.sql             # Sample data
│   └── database.db          # (auto-created)
│
└── src/
    ├── app.js               # Express setup
    ├── db.js                # Database connection
    │
    ├── models/
    │   └── Todo.js          # Database queries
    │
    ├── controllers/
    │   └── todoController.js # Business logic
    │
    ├── routes/
    │   └── todos.js         # API endpoints
    │
    └── middleware/
        ├── errorHandler.js  # Error handling
        └── validate.js      # Validation
```

---

## 🚀 Step 1: Setup Project

### 1.1 สร้างโฟลเดอร์

```bash
mkdir todo-api
cd todo-api

mkdir -p database src/models src/controllers src/routes src/middleware
```

### 1.2 Initialize npm

```bash
npm init -y
```

### 1.3 ติดตั้ง dependencies

```bash
npm install express better-sqlite3 cors dotenv
npm install --save-dev nodemon
```

### 1.4 แก้ไข `package.json`

```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "description": "Todo API with SQLite",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "db:reset": "node src/db.js --reset"
  },
  "keywords": ["api", "sqlite", "todos"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 1.5 สร้าง `.env`

```bash
PORT=3000
DB_PATH=./database/database.db
NODE_ENV=development
```

### 1.6 สร้าง `.gitignore`

```bash
node_modules/
.env
*.db
*.db-shm
*.db-wal
*.log
```

**💾 Commit:**
```bash
git init
git add .
git commit -m "Initial project setup"
```

---

## 🗄️ Step 2: สร้าง Database

### 2.1 สร้าง `database/schema.sql`

```sql
-- database/schema.sql

-- ลบ table เก่า
DROP TABLE IF EXISTS todos;

-- สร้าง table todos
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาเร็วขึ้น
CREATE INDEX idx_todos_done ON todos(done);

-- Trigger สำหรับ updated_at
CREATE TRIGGER update_todos_timestamp
AFTER UPDATE ON todos
FOR EACH ROW
BEGIN
  UPDATE todos SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;
```

### 2.2 สร้าง `database/seed.sql`

```sql
-- database/seed.sql

-- ข้อมูลตัวอย่าง
INSERT INTO todos (task, done) VALUES
  ('ซื้อของที่ตลาด', 0),
  ('ทำการบ้านคณิตศาสตร์', 1),
  ('ออกกำลังกาย', 0),
  ('อ่านหนังสือ', 0),
  ('ทำความสะอาดห้อง', 1);
```

### 2.3 สร้าง `src/db.js`

```javascript
// src/db.js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class DatabaseManager {
  constructor() {
    this.dbPath = process.env.DB_PATH || './database/database.db';
    this.db = null;
  }

  /**
   * เชื่อมต่อ database
   */
  connect() {
    try {
      // สร้างโฟลเดอร์ถ้ายังไม่มี
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // เชื่อมต่อ database
      this.db = new Database(this.dbPath, {
        verbose: process.env.NODE_ENV === 'development' ? console.log : null
      });

      // เปิด foreign keys (ถ้ามี)
      this.db.pragma('foreign_keys = ON');

      console.log('✅ Connected to database');
      return this.db;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * รัน SQL script
   */
  runScript(scriptPath) {
    try {
      const fullPath = path.join(__dirname, '..', scriptPath);
      const sql = fs.readFileSync(fullPath, 'utf-8');
      this.db.exec(sql);
      console.log(`✅ Executed: ${path.basename(scriptPath)}`);
    } catch (error) {
      console.error(`❌ Script failed: ${scriptPath}`, error);
      throw error;
    }
  }

  /**
   * สร้าง schema
   */
  createSchema() {
    this.runScript('database/schema.sql');
  }

  /**
   * เพิ่มข้อมูลตัวอย่าง
   */
  seedData() {
    this.runScript('database/seed.sql');
  }

  /**
   * Reset database
   */
  reset() {
    console.log('🔄 Resetting database...');
    this.createSchema();
    this.seedData();
    console.log('✅ Database reset complete');
  }

  /**
   * ปิดการเชื่อมต่อ
   */
  close() {
    if (this.db) {
      this.db.close();
      console.log('👋 Database closed');
    }
  }

  /**
   * ดึง database instance
   */
  getDb() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

// ถ้ารันไฟล์นี้โดยตรง
if (require.main === module) {
  const args = process.argv.slice(2);
  
  dbManager.connect();
  
  if (args.includes('--reset')) {
    dbManager.reset();
  } else {
    dbManager.createSchema();
  }
  
  dbManager.close();
  process.exit(0);
}

module.exports = dbManager;
```

### 2.4 ทดสอบสร้าง database

```bash
npm run db:reset
```

**ผลลัพธ์:**
```
🔄 Resetting database...
✅ Executed: schema.sql
✅ Executed: seed.sql
✅ Database reset complete
```

**💾 Commit:**
```bash
git add .
git commit -m "Add database schema and seed data"
```

---

## 📊 Step 3: สร้าง Model

### 3.1 สร้าง `src/models/Todo.js`

```javascript
// src/models/Todo.js
const dbManager = require('../db');

class Todo {
  constructor() {
    this.db = dbManager.getDb();
  }

  /**
   * ดึง todos ทั้งหมด
   */
  getAll() {
    const sql = `
      SELECT * FROM todos
      ORDER BY created_at DESC
    `;
    return this.db.prepare(sql).all();
  }

  /**
   * ดึง todo ตาม ID
   */
  getById(id) {
    const sql = `SELECT * FROM todos WHERE id = ?`;
    return this.db.prepare(sql).get(id);
  }

  /**
   * สร้าง todo ใหม่
   */
  create(task) {
    const sql = `
      INSERT INTO todos (task)
      VALUES (?)
    `;
    const result = this.db.prepare(sql).run(task);
    return this.getById(result.lastInsertRowid);
  }

  /**
   * อัพเดทสถานะ
   */
  updateStatus(id, done) {
    const sql = `
      UPDATE todos
      SET done = ?
      WHERE id = ?
    `;
    const result = this.db.prepare(sql).run(done, id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.getById(id);
  }

  /**
   * ลบ todo
   */
  delete(id) {
    const sql = `DELETE FROM todos WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  /**
   * ดูสถิติ
   */
  getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    return this.db.prepare(sql).get();
  }
}

module.exports = new Todo();
```

**📝 อธิบาย:**
- ทุก method ใช้ prepared statements (ป้องกัน SQL injection)
- `getById()` ใช้ `.get()` - return 1 แถว
- `getAll()` ใช้ `.all()` - return array
- `create()` return todo ที่เพิ่ง INSERT
- `updateStatus()` return null ถ้าไม่พบ

**💾 Commit:**
```bash
git add src/models/
git commit -m "Add Todo model"
```

---

## 🎮 Step 4: สร้าง Controller

### 4.1 สร้าง `src/controllers/todoController.js`

```javascript
// src/controllers/todoController.js
const Todo = require('../models/Todo');

/**
 * ดึง todos ทั้งหมด
 * GET /api/todos
 */
exports.getAll = (req, res) => {
  try {
    const todos = Todo.getAll();
    
    res.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch todos',
        details: error.message
      }
    });
  }
};

/**
 * ดึง todo ตาม ID
 * GET /api/todos/:id
 */
exports.getById = (req, res) => {
  try {
    const { id } = req.params;
    const todo = Todo.getById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          code: 'TODO_NOT_FOUND'
        }
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch todo',
        details: error.message
      }
    });
  }
};

/**
 * สร้าง todo ใหม่
 * POST /api/todos
 */
exports.create = (req, res) => {
  try {
    const { task } = req.body;
    
    // Validation
    if (!task || task.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Task is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    if (task.length > 200) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Task must be less than 200 characters',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const newTodo = Todo.create(task.trim());
    
    res.status(201).json({
      success: true,
      data: newTodo
    });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create todo',
        details: error.message
      }
    });
  }
};

/**
 * อัพเดทสถานะ
 * PATCH /api/todos/:id
 */
exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    
    // Validation
    if (done === undefined || done === null) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'done field is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    if (typeof done !== 'boolean' && done !== 0 && done !== 1) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'done must be boolean or 0/1',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const doneValue = done ? 1 : 0;
    const updatedTodo = Todo.updateStatus(id, doneValue);
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          code: 'TODO_NOT_FOUND'
        }
      });
    }
    
    res.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update todo',
        details: error.message
      }
    });
  }
};

/**
 * ลบ todo
 * DELETE /api/todos/:id
 */
exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = Todo.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          code: 'TODO_NOT_FOUND'
        }
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in delete:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete todo',
        details: error.message
      }
    });
  }
};

/**
 * ดูสถิติ
 * GET /api/todos/stats
 */
exports.getStats = (req, res) => {
  try {
    const stats = Todo.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch stats',
        details: error.message
      }
    });
  }
};
```

**📝 อธิบาย:**
- ทุก method มี try-catch
- Validation input ก่อนบันทึก
- Return status codes ที่เหมาะสม
- Response format สม่ำเสมอ

**💾 Commit:**
```bash
git add src/controllers/
git commit -m "Add todo controller"
```

---

## 🛣️ Step 5: สร้าง Routes

### 5.1 สร้าง `src/routes/todos.js`

```javascript
// src/routes/todos.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// ⚠️ สำคัญ: /stats ต้องมาก่อน /:id
router.get('/stats', todoController.getStats);

// CRUD routes
router.get('/', todoController.getAll);
router.get('/:id', todoController.getById);
router.post('/', todoController.create);
router.patch('/:id', todoController.updateStatus);
router.delete('/:id', todoController.delete);

module.exports = router;
```

**⚠️ หมายเหตุ:**
```javascript
// ❌ ผิด - /:id จะจับ /stats ก่อน
router.get('/:id', todoController.getById);
router.get('/stats', todoController.getStats);

// ✅ ถูก - /stats อยู่ก่อน /:id
router.get('/stats', todoController.getStats);
router.get('/:id', todoController.getById);
```

**💾 Commit:**
```bash
git add src/routes/
git commit -m "Add todo routes"
```

---

## ⚙️ Step 6: สร้าง Express App

### 6.1 สร้าง `src/app.js`

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos'
    }
  });
});

app.use('/api/todos', todoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND'
    }
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

module.exports = app;
```

### 6.2 สร้าง `server.js`

```javascript
// server.js
require('dotenv').config();
const app = require('./src/app');
const dbManager = require('./src/db');

const PORT = process.env.PORT || 3000;

// เชื่อมต่อ database
dbManager.connect();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/todos`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  dbManager.close();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
```

**💾 Commit:**
```bash
git add src/app.js server.js
git commit -m "Add Express app and server"
```

---

## 🧪 Step 7: ทดสอบ API

### 7.1 Start server

```bash
npm run dev
```

**ผลลัพธ์:**
```
✅ Connected to database
🚀 Server running on http://localhost:3000
📚 API docs: http://localhost:3000/api/todos
```

### 7.2 ทดสอบด้วย Postman

**1. GET All Todos**
```
GET http://localhost:3000/api/todos
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task": "ซื้อของที่ตลาด",
      "done": 0,
      "created_at": "2024-01-31 10:00:00"
    },
    ...
  ]
}
```

**2. POST Create Todo**
```
POST http://localhost:3000/api/todos
Content-Type: application/json

{
  "task": "เรียน MongoDB"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "task": "เรียน MongoDB",
    "done": 0,
    "created_at": "2024-01-31 11:00:00"
  }
}
```

**3. PATCH Update Status**
```
PATCH http://localhost:3000/api/todos/1
Content-Type: application/json

{
  "done": true
}
```

**4. DELETE Todo**
```
DELETE http://localhost:3000/api/todos/1
```

**Response:** `204 No Content`

**5. GET Stats**
```
GET http://localhost:3000/api/todos/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "completed": 2,
    "pending": 3
  }
}
```

---

## 🎯 Challenge Tasks

ลองเพิ่มฟีเจอร์เหล่านี้:

### Challenge 1: Filter by Status
```javascript
// GET /api/todos?done=true
exports.getAll = (req, res) => {
  const { done } = req.query;
  // TODO: filter by done status
};
```

### Challenge 2: Search
```javascript
// GET /api/todos?search=ซื้อ
exports.getAll = (req, res) => {
  const { search } = req.query;
  // TODO: search in task
};
```

### Challenge 3: Pagination
```javascript
// GET /api/todos?page=1&limit=10
exports.getAll = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  // TODO: implement pagination
};
```

---

## 📝 สรุปสิ่งที่ได้เรียนรู้

✅ เชื่อมต่อ SQLite กับ Express  
✅ MVC pattern (Model-Controller-Router)  
✅ RESTful API design  
✅ Error handling  
✅ Input validation  
✅ Prepared statements (security)  
✅ Testing with Postman  

---

**เก่งมาก! API แรกของคุณพร้อมแล้ว! 🎉**

**Next:** [Level 2: Product API](../level-2-challenge/README.md)
