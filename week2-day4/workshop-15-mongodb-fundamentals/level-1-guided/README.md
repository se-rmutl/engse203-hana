# 🎓 Workshop 15 - Level 1: Todo App with MongoDB

## 📌 ภาพรวม

Workshop นี้จะสอนการสร้าง **Todo API** ด้วย MongoDB + Mongoose:
- ✅ เชื่อมต่อ MongoDB
- ✅ สร้าง Mongoose schemas
- ✅ CRUD operations
- ✅ Validation
- ✅ Query operators

**Code เต็ม 100%** - เน้นเรียนรู้และทำความเข้าใจ

---

## 🎯 API Endpoints

```
GET    /api/todos          → ดึงทั้งหมด
GET    /api/todos/:id      → ดึงตาม ID
POST   /api/todos          → สร้างใหม่
PUT    /api/todos/:id      → แก้ไขทั้งหมด
PATCH  /api/todos/:id/done → toggle สถานะ
DELETE /api/todos/:id      → ลบ
GET    /api/todos/stats    → สถิติ
```

---

## 📁 โครงสร้างโปรเจค

```
level-1-guided/
├── .env
├── .gitignore
├── package.json
├── server.js
│
└── src/
    ├── config/
    │   └── database.js       # MongoDB connection
    │
    ├── models/
    │   └── Todo.js           # Mongoose schema
    │
    ├── controllers/
    │   └── todoController.js
    │
    ├── routes/
    │   └── todos.js
    │
    └── app.js
```

---

## 🚀 Step 1: Setup Project

### 1.1 สร้างโฟลเดอร์

```bash
mkdir todo-api-mongodb
cd todo-api-mongodb

mkdir -p src/config src/models src/controllers src/routes
```

### 1.2 Initialize npm

```bash
npm init -y
```

### 1.3 ติดตั้ง dependencies

```bash
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

### 1.4 แก้ไข `package.json`

```json
{
  "name": "todo-api-mongodb",
  "version": "1.0.0",
  "description": "Todo API with MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["api", "mongodb", "mongoose", "todos"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^8.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 1.5 สร้าง `.env`

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development
```

**หมายเหตุ:**
- ถ้าใช้ MongoDB Atlas (cloud): `MONGODB_URI=mongodb+srv://...`
- ถ้าใช้ WSL: `MONGODB_URI=mongodb://172.28.x.x:27017/todo-app`

### 1.6 สร้าง `.gitignore`

```bash
node_modules/
.env
*.log
```

**💾 Commit:**
```bash
git init
git add .
git commit -m "Initial setup"
```

---

## 🔌 Step 2: เชื่อมต่อ MongoDB

### 2.1 สร้าง `src/config/database.js`

```javascript
// src/config/database.js
const mongoose = require('mongoose');

/**
 * เชื่อมต่อ MongoDB
 */
const connectDB = async () => {
  try {
    const options = {
      // ไม่ต้องใส่ useNewUrlParser และ useUnifiedTopology แล้ว (deprecated)
      // autoIndex: process.env.NODE_ENV === 'development', // สร้าง index อัตโนมัติใน dev
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);

    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 MongoDB connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**📝 อธิบาย:**
- `mongoose.connect()` - เชื่อมต่อ database
- Event listeners - ตรวจจับ errors และ disconnections
- Graceful shutdown - ปิด connection ก่อน exit

**💾 Commit:**
```bash
git add src/config/
git commit -m "Add MongoDB connection"
```

---

## 📊 Step 3: สร้าง Mongoose Model

### 3.1 สร้าง `src/models/Todo.js`

```javascript
// src/models/Todo.js
const mongoose = require('mongoose');

/**
 * Todo Schema
 */
const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Task is required'],
      trim: true,
      maxlength: [200, 'Task must be less than 200 characters']
    },
    done: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true  // เพิ่ม createdAt และ updatedAt อัตโนมัติ
  }
);

/**
 * Virtual - fullInfo
 * (ไม่เก็บใน database)
 */
todoSchema.virtual('fullInfo').get(function() {
  return `${this.task} [${this.done ? 'Done' : 'Pending'}]`;
});

/**
 * Instance Method - toggle done status
 */
todoSchema.methods.toggleDone = function() {
  this.done = !this.done;
  return this.save();
};

/**
 * Static Method - get statistics
 */
todoSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ['$done', 1, 0] }
        },
        pending: {
          $sum: { $cond: ['$done', 0, 1] }
        }
      }
    }
  ]);

  return stats[0] || { total: 0, completed: 0, pending: 0 };
};

/**
 * Pre-save Hook
 * (รันก่อน save)
 */
todoSchema.pre('save', function(next) {
  console.log('💾 Saving todo:', this.task);
  next();
});

/**
 * Post-save Hook
 * (รันหลัง save)
 */
todoSchema.post('save', function(doc) {
  console.log('✅ Todo saved:', doc._id);
});

// Export model
module.exports = mongoose.model('Todo', todoSchema);
```

**📝 อธิบาย Schema:**

**1. Field Types:**
- `String` - ข้อความ
- `Boolean` - true/false
- `Date` - วันที่
- `enum` - ค่าที่กำหนดไว้

**2. Validations:**
- `required` - ต้องมีค่า
- `trim` - ตัดช่องว่างหัวท้าย
- `maxlength` - ความยาวสูงสุด
- `enum` - เฉพาะค่าที่กำหนด

**3. Options:**
- `timestamps: true` - เพิ่ม createdAt, updatedAt

**4. Virtuals:**
- ไม่เก็บใน database
- คำนวณแบบ on-the-fly

**5. Methods:**
- Instance methods: `todo.toggleDone()`
- Static methods: `Todo.getStats()`

**6. Hooks (Middleware):**
- `pre('save')` - ก่อน save
- `post('save')` - หลัง save

**💾 Commit:**
```bash
git add src/models/
git commit -m "Add Todo model with Mongoose"
```

---

## 🎮 Step 4: สร้าง Controller

### 4.1 สร้าง `src/controllers/todoController.js`

```javascript
// src/controllers/todoController.js
const Todo = require('../models/Todo');

/**
 * GET /api/todos
 * ดึง todos ทั้งหมด
 */
exports.getAll = async (req, res) => {
  try {
    const { done, priority, sort } = req.query;
    
    // Build filter
    const filter = {};
    if (done !== undefined) {
      filter.done = done === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }

    // Build sort
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1 };
    }

    const todos = await Todo.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: todos.length,
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
 * GET /api/todos/:id
 * ดึง todo ตาม ID
 */
exports.getById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

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
 * POST /api/todos
 * สร้าง todo ใหม่
 */
exports.create = async (req, res) => {
  try {
    const { task, priority, dueDate } = req.body;

    const todo = await Todo.create({
      task,
      priority,
      dueDate
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }

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
 * PUT /api/todos/:id
 * แก้ไข todo ทั้งหมด
 */
exports.update = async (req, res) => {
  try {
    const { task, done, priority, dueDate } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { task, done, priority, dueDate },
      {
        new: true,           // return updated document
        runValidators: true  // run validations
      }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }

    console.error('Error in update:', error);
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
 * PATCH /api/todos/:id/done
 * Toggle done status
 */
exports.toggleDone = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    // ใช้ instance method
    await todo.toggleDone();

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

    console.error('Error in toggleDone:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to toggle todo',
        details: error.message
      }
    });
  }
};

/**
 * DELETE /api/todos/:id
 * ลบ todo
 */
exports.delete = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

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
 * GET /api/todos/stats
 * ดูสถิติ
 */
exports.getStats = async (req, res) => {
  try {
    // ใช้ static method
    const stats = await Todo.getStats();

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

**📝 จุดสำคัญ:**
- `await` ทุก query (Mongoose เป็น async)
- Handle validation errors
- Handle ObjectId errors
- Return appropriate status codes

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
router.put('/:id', todoController.update);
router.patch('/:id/done', todoController.toggleDone);
router.delete('/:id', todoController.delete);

module.exports = router;
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
    message: 'Todo API with MongoDB',
    version: '1.0.0',
    database: 'MongoDB',
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
      message: 'Endpoint not found'
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
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Start function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API docs: http://localhost:${PORT}/api/todos`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
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
✅ MongoDB Connected: localhost
📚 Database: todo-app
🚀 Server running on http://localhost:3000
📚 API docs: http://localhost:3000/api/todos
```

### 7.2 ทดสอบด้วย Postman

**1. POST Create Todo**
```
POST http://localhost:3000/api/todos
Content-Type: application/json

{
  "task": "เรียน MongoDB",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65b9f5e9c8d0a1234567890a",
    "task": "เรียน MongoDB",
    "done": false,
    "priority": "high",
    "createdAt": "2024-01-31T10:00:00.000Z",
    "updatedAt": "2024-01-31T10:00:00.000Z",
    "__v": 0
  }
}
```

**2. GET All Todos**
```
GET http://localhost:3000/api/todos
```

**3. GET with Filter**
```
GET http://localhost:3000/api/todos?done=false&priority=high
```

**4. PATCH Toggle Done**
```
PATCH http://localhost:3000/api/todos/65b9f5e9c8d0a1234567890a/done
```

**5. PUT Update**
```
PUT http://localhost:3000/api/todos/65b9f5e9c8d0a1234567890a
Content-Type: application/json

{
  "task": "เรียน MongoDB และ Mongoose",
  "done": true,
  "priority": "high"
}
```

**6. DELETE**
```
DELETE http://localhost:3000/api/todos/65b9f5e9c8d0a1234567890a
```

**7. GET Stats**
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

### Challenge 1: Search
```javascript
// GET /api/todos?search=เรียน
exports.getAll = async (req, res) => {
  const { search } = req.query;
  if (search) {
    filter.task = { $regex: search, $options: 'i' };
  }
  // TODO: implement search
};
```

### Challenge 2: Pagination
```javascript
// GET /api/todos?page=1&limit=10
exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  // TODO: implement pagination
};
```

### Challenge 3: Due Date Filter
```javascript
// GET /api/todos?overdue=true
exports.getAll = async (req, res) => {
  const { overdue } = req.query;
  if (overdue === 'true') {
    filter.dueDate = { $lt: new Date() };
    filter.done = false;
  }
  // TODO: implement overdue filter
};
```

---

## 📝 สรุปสิ่งที่ได้เรียนรู้

✅ เชื่อมต่อ MongoDB กับ Express  
✅ สร้าง Mongoose schemas  
✅ Validation และ error handling  
✅ Instance methods และ Static methods  
✅ Hooks (pre/post save)  
✅ Virtuals  
✅ CRUD operations ครบถ้วน  
✅ Query operators ($regex, $gt, etc.)  

---

**เก่งมาก! MongoDB API แรกของคุณพร้อมแล้ว! 🎉**

**Next:** เฉลย Challenge Tasks → [Solutions](./solutions/CHALLENGE_SOLUTIONS.md)
