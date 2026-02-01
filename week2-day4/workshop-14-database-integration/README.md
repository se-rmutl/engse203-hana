# 🔌 Workshop 14: Database Integration with Node.js

**ระยะเวลา:** 75 นาที (10:45-12:00)  
**ระดับ:** ปานกลาง

## 🎯 วัตถุประสงค์

หลังจากทำ workshop นี้เสร็จ นักศึกษาจะสามารถ:
1. **เชื่อมต่อ** SQLite database กับ Express API
2. **สร้าง** RESTful API endpoints ที่ใช้งาน database
3. **ทำความเข้าใจ** Request → Controller → Database → Response flow
4. **จัดการ** errors และ validations
5. **ทดสอบ** API ด้วย Postman/Thunder Client

---

## 💡 ทำไมต้องเชื่อม Database กับ API?

### ก่อนมี Database

```
┌─────────────┐
│   Express   │
│     API     │
├─────────────┤
│   Memory    │ ← ข้อมูลหายเมื่อปิดโปรแกรม
│   (Array)   │
└─────────────┘
```

**ปัญหา:**
- ❌ ข้อมูลหายเมื่อ restart server
- ❌ ไม่สามารถ scale ได้
- ❌ ไม่มี data persistence

### หลังมี Database

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│   Express   │
│     API     │
└──────┬──────┘
       │ SQL Query
       ▼
┌─────────────┐
│   SQLite    │
│  Database   │ ← ข้อมูลถาวร
└─────────────┘
```

**ข้อดี:**
- ✅ ข้อมูลถาวร (persistent)
- ✅ Scalable
- ✅ Transaction support
- ✅ Data integrity

---

## 📊 Request-Response Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Complete Flow                         │
└──────────────────────────────────────────────────────────┘

1. Client Request
   │
   ├─► GET /api/users
   │
   ▼
2. Express Router
   │
   ├─► routes/users.js
   │   app.get('/api/users', controller.getAll)
   │
   ▼
3. Controller
   │
   ├─► controllers/userController.js
   │   const users = User.getAll()
   │
   ▼
4. Model (Database)
   │
   ├─► models/User.js
   │   db.prepare('SELECT * FROM users').all()
   │
   ▼
5. SQLite Database
   │
   ├─► database.db
   │   [data stored here]
   │
   ▼
6. Response Flow (reverse)
   │
   ├─► Model returns data
   ├─► Controller processes
   ├─► Router sends response
   │
   ▼
7. Client receives JSON
   {
     "success": true,
     "data": [...]
   }
```

---

## 🏗️ โครงสร้าง API + Database

```
project/
│
├── database/
│   ├── schema.sql       # Database structure
│   ├── seed.sql         # Sample data
│   └── database.db      # SQLite file
│
├── src/
│   ├── models/          # Database queries
│   │   └── User.js
│   │
│   ├── controllers/     # Business logic
│   │   └── userController.js
│   │
│   ├── routes/          # API endpoints
│   │   └── users.js
│   │
│   ├── middleware/      # Validation, auth, etc.
│   │   └── validate.js
│   │
│   └── app.js          # Express setup
│
└── server.js           # Entry point
```

---

## 🔄 MVC Pattern (แบบง่าย)

**MVC = Model-View-Controller**

```
┌─────────────────────────────────────────────────┐
│                  MVC Pattern                    │
└─────────────────────────────────────────────────┘

      Client
        │
        ├─► Request: GET /api/users
        │
        ▼
┌───────────────┐
│   ROUTES      │ ← กำหนด endpoints
│               │
│ GET /users    │
│ POST /users   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  CONTROLLER   │ ← Business logic
│               │
│- Validate     │
│- Call Model   │
│- Send Response│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    MODEL      │ ← Database operations
│               │
│ - getAll()    │
│ - create()    │
│ - update()    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   DATABASE    │ ← Data storage
│               │
│ SQLite .db    │
└───────────────┘
```

**แต่ละส่วนทำอะไร:**

**1. Routes (เส้นทาง):**
```javascript
// routes/users.js
router.get('/users', userController.getAll);
router.post('/users', userController.create);
```

**2. Controller (ควบคุม):**
```javascript
// controllers/userController.js
exports.getAll = (req, res) => {
  const users = User.getAll();  // เรียก Model
  res.json({ success: true, data: users });
};
```

**3. Model (ฐานข้อมูล):**
```javascript
// models/User.js
static getAll() {
  return db.prepare('SELECT * FROM users').all();
}
```

---

## 📝 RESTful API Design

### REST Principles

```
Resource: /api/users

GET    /api/users       → ดึงทั้งหมด
GET    /api/users/:id   → ดึงตาม ID
POST   /api/users       → สร้างใหม่
PUT    /api/users/:id   → แก้ไขทั้งหมด
PATCH  /api/users/:id   → แก้ไขบางส่วน
DELETE /api/users/:id   → ลบ
```

### HTTP Status Codes

```
┌──────────────────────────────────────┐
│         Status Codes                 │
└──────────────────────────────────────┘

2xx Success
├─ 200 OK              ← GET, PUT, PATCH สำเร็จ
├─ 201 Created         ← POST สำเร็จ
└─ 204 No Content      ← DELETE สำเร็จ

4xx Client Errors
├─ 400 Bad Request     ← ข้อมูลไม่ถูกต้อง
├─ 404 Not Found       ← ไม่พบข้อมูล
└─ 422 Unprocessable   ← Validation error

5xx Server Errors
└─ 500 Internal Error  ← Server error
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "สมชาย",
    "email": "somchai@email.com"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND"
  }
}
```

---

## 🛠️ Tools ที่ต้องใช้

### 1. better-sqlite3
```bash
npm install better-sqlite3
```

**ทำไมใช้ better-sqlite3:**
- ✅ Synchronous (ง่ายกว่า async)
- ✅ เร็วกว่า node-sqlite3
- ✅ ไม่ต้อง callback hell

### 2. Express & Middleware
```bash
npm install express cors dotenv
```

### 3. Validation
```bash
npm install joi
# หรือ
npm install express-validator
```

### 4. Testing Tools
- **Postman** - https://www.postman.com/downloads/
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

---

## 🎨 Workshop Structure

### Level 1: Todo API (Guided)
- ✅ Complete code 100%
- ✅ CRUD operations
- ✅ Error handling
- ✅ Testing guide

**Project:** Simple Todo API
```
GET    /api/todos       → ดึงทั้งหมด
POST   /api/todos       → สร้าง todo
PATCH  /api/todos/:id   → อัพเดทสถานะ
DELETE /api/todos/:id   → ลบ
```

### Level 2: Product API (Challenge)
- 🔨 Code 70% + ต้องเขียนเอง 30%
- 🔨 Categories + Products
- 🔨 Search & Filter
- 🔨 Validation

**Project:** Product Management API
```
Products:
  GET    /api/products
  POST   /api/products
  PUT    /api/products/:id
  DELETE /api/products/:id

Categories:
  GET    /api/categories
  POST   /api/categories
```

---

## 🔍 Key Concepts

### 1. Prepared Statements (Security)

```javascript
// ❌ SQL Injection Risk
const name = req.body.name;
const sql = `SELECT * FROM users WHERE name = '${name}'`;
db.prepare(sql).all();

// ✅ Safe - Parameterized Query
const name = req.body.name;
const sql = 'SELECT * FROM users WHERE name = ?';
db.prepare(sql).all(name);
```

### 2. Error Handling

```javascript
try {
  const user = User.getById(id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }
  
  res.json({ success: true, data: user });
} catch (error) {
  res.status(500).json({
    success: false,
    error: { message: error.message }
  });
}
```

### 3. Validation

```javascript
// ตรวจสอบก่อนบันทึก
const { name, email } = req.body;

if (!name || !email) {
  return res.status(400).json({
    success: false,
    error: { message: 'Name and email are required' }
  });
}

// Email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    error: { message: 'Invalid email format' }
  });
}
```

---

## 🧪 Testing with Postman

### Request Flow

```
┌──────────────────────────────────────┐
│          Testing Flow                │
└──────────────────────────────────────┘

1. Start Server
   node server.js
   
2. Open Postman

3. Create Request
   ├─ Method: GET
   ├─ URL: http://localhost:3000/api/users
   └─ Send
   
4. Check Response
   ├─ Status: 200 OK
   ├─ Body: JSON data
   └─ Time: 25ms
```

### Example Requests

**GET All:**
```
GET http://localhost:3000/api/todos
```

**POST Create:**
```
POST http://localhost:3000/api/todos
Content-Type: application/json

{
  "task": "ซื้อของ",
  "done": false
}
```

**PATCH Update:**
```
PATCH http://localhost:3000/api/todos/1
Content-Type: application/json

{
  "done": true
}
```

**DELETE:**
```
DELETE http://localhost:3000/api/todos/1
```

---

## 📋 Workshop Links

- [Level 1: Todo API (Guided)](./level-1-guided/README.md)
- [Level 2: Product API (Challenge)](./level-2-challenge/README.md)

---

## 💡 Tips

### 1. ใช้ dotenv สำหรับ config
```javascript
// .env
PORT=3000
DB_PATH=./database/database.db

// server.js
require('dotenv').config();
const port = process.env.PORT || 3000;
```

### 2. แยก concerns ชัดเจน
- Routes: endpoints เท่านั้น
- Controllers: logic
- Models: database

### 3. Error handling ทุกที่
- try-catch ใน controllers
- validation ก่อน database
- meaningful error messages

### 4. ทดสอบบ่อยๆ
- ทดสอบทุก endpoint
- Test edge cases
- Check error responses

---

## 🎓 Learning Outcomes

หลังจากจบ workshop นี้ คุณจะ:

✅ เข้าใจ API + Database integration  
✅ สร้าง RESTful API ได้  
✅ ใช้ MVC pattern  
✅ Handle errors properly  
✅ Validate input data  
✅ Test APIs with tools  
✅ Deploy-ready code structure  

---

## 🔗 Prerequisites

ก่อนเริ่ม workshop ควรรู้:
- ✅ Express basics (Workshop วันที่ 3)
- ✅ SQLite basics (Workshop 13)
- ✅ JavaScript async/callbacks
- ✅ REST API concepts

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [better-sqlite3 Docs](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

**พร้อมเริ่ม!** → [Level 1: Todo API](./level-1-guided/README.md)

**Let's build a real API! 🚀**
