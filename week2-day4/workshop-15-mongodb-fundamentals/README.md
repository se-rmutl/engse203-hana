# 🍃 Workshop 15: MongoDB Fundamentals

**ระยะเวลา:** 90 นาที (13:00-14:30)  
**ระดับ:** เริ่มต้น-ปานกลาง

## 🎯 วัตถุประสงค์

หลังจากทำ workshop นี้เสร็จ นักศึกษาจะสามารถ:
1. **เข้าใจ** NoSQL และ MongoDB basics
2. **เชื่อมต่อ** MongoDB กับ Node.js
3. **ใช้งาน** CRUD operations (Create, Read, Update, Delete)
4. **ใช้** MongoDB native driver และ Mongoose ODM
5. **สร้าง** schemas และ validation
6. **ทำความเข้าใจ** documents และ collections

---

## 💡 SQL vs MongoDB

### เปรียบเทียบโครงสร้าง

```
┌─────────────────────────────────────────┐
│     SQL (SQLite)   vs   NoSQL (MongoDB) │
└─────────────────────────────────────────┘

Database          →    Database
  ↓                      ↓
Table             →    Collection
  ↓                      ↓
Row               →    Document
  ↓                      ↓
Column            →    Field
```

### ตัวอย่างข้อมูล

**SQL (SQLite):**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER
);

INSERT INTO users (name, email, age)
VALUES ('สมชาย', 'somchai@email.com', 25);
```

**MongoDB:**
```javascript
// ไม่ต้องสร้าง schema ล่วงหน้า!

db.users.insertOne({
  name: 'สมชาย',
  email: 'somchai@email.com',
  age: 25
});
```

---

## 📊 Document Structure

### MongoDB Document = JSON Object

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "สมชาย",
  age: 25,
  email: "somchai@email.com",
  hobbies: ["reading", "coding"],
  address: {
    street: "123 ถ.สุขุมวิท",
    city: "กรุงเทพฯ",
    zip: "10110"
  },
  createdAt: ISODate("2024-01-31T10:00:00Z")
}
```

**จุดเด่น:**
- ✅ Flexible schema (fields ต่างกันได้)
- ✅ Nested objects
- ✅ Arrays
- ✅ เหมาะกับข้อมูล hierarchical

---

## 🔄 Request Flow

```
┌──────────────────────────────────────────┐
│    Express + MongoDB Integration         │
└──────────────────────────────────────────┘

Client (Browser/Postman)
  │
  ├─► HTTP Request
  │   GET /api/users
  │
  ▼
Express API
  │
  ├─► Route: /api/users
  │   router.get('/', controller.getAll)
  │
  ▼
Controller
  │
  ├─► Business Logic
  │   const users = await User.find()
  │
  ▼
Model (Mongoose)
  │
  ├─► Schema + Validation
  │   UserSchema = { name, email, age }
  │
  ▼
MongoDB Database
  │
  ├─► Collection: users
  │   [ {doc1}, {doc2}, ... ]
  │
  ▼
Response (JSON)
  {
    "success": true,
    "data": [...]
  }
```

---

## 🔧 สองวิธีในการใช้งาน MongoDB

### 1. MongoDB Native Driver

```javascript
const { MongoClient } = require('mongodb');

// เชื่อมต่อ
const client = new MongoClient(uri);
await client.connect();

// ใช้งาน
const db = client.db('mydb');
const users = db.collection('users');

// Insert
await users.insertOne({ name: 'สมชาย', age: 25 });

// Find
const allUsers = await users.find().toArray();
```

**ข้อดี:**
- ✅ ควบคุมทุกอย่างได้เอง
- ✅ Flexible มาก
- ✅ Performance ดี

**ข้อเสีย:**
- ❌ ไม่มี schema validation
- ❌ เขียน code เยอะ
- ❌ ต้องจัดการ connection เอง

### 2. Mongoose ODM (แนะนำ)

```javascript
const mongoose = require('mongoose');

// Define Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 }
});

// Create Model
const User = mongoose.model('User', userSchema);

// ใช้งาน
const user = new User({ name: 'สมชาย', age: 25 });
await user.save();

const allUsers = await User.find();
```

**ข้อดี:**
- ✅ มี schema & validation
- ✅ เขียน code น้อยกว่า
- ✅ Middleware (hooks)
- ✅ Population (like JOIN)

**ข้อเสีย:**
- ❌ Abstraction layer = ช้ากว่านิดหน่อย
- ❌ เรียนรู้ต้องใช้เวลา

---

## 🏗️ โครงสร้าง Workshop

```
workshop-15-mongodb-fundamentals/
│
├── README.md                    # ภาพรวม
│
├── level-1-guided/              # Todo App
│   ├── README.md
│   ├── package.json
│   ├── server.js
│   │
│   └── src/
│       ├── config/
│       │   └── database.js      # MongoDB connection
│       │
│       ├── models/
│       │   └── Todo.js          # Mongoose schema
│       │
│       ├── controllers/
│       │   └── todoController.js
│       │
│       ├── routes/
│       │   └── todos.js
│       │
│       └── app.js
│
└── level-2-challenge/           # Blog System
    └── ...
```

---

## 📝 CRUD Operations

### Create (สร้าง)

```javascript
// insertOne
await db.collection('users').insertOne({
  name: 'สมชาย',
  age: 25
});

// insertMany
await db.collection('users').insertMany([
  { name: 'สมหญิง', age: 23 },
  { name: 'ชาติชาย', age: 27 }
]);

// Mongoose
const user = new User({ name: 'สมชาย', age: 25 });
await user.save();

// หรือ
await User.create({ name: 'สมชาย', age: 25 });
```

### Read (ดึงข้อมูล)

```javascript
// Find all
await db.collection('users').find().toArray();

// Find one
await db.collection('users').findOne({ name: 'สมชาย' });

// Find with filter
await db.collection('users').find({ age: { $gte: 20 } }).toArray();

// Mongoose
await User.find();
await User.findOne({ name: 'สมชาย' });
await User.find({ age: { $gte: 20 } });
```

### Update (แก้ไข)

```javascript
// Update one
await db.collection('users').updateOne(
  { name: 'สมชาย' },
  { $set: { age: 26 } }
);

// Update many
await db.collection('users').updateMany(
  { age: { $lt: 20 } },
  { $set: { status: 'minor' } }
);

// Mongoose
await User.updateOne({ name: 'สมชาย' }, { age: 26 });
await User.findOneAndUpdate(
  { name: 'สมชาย' },
  { age: 26 },
  { new: true } // return updated document
);
```

### Delete (ลบ)

```javascript
// Delete one
await db.collection('users').deleteOne({ name: 'สมชาย' });

// Delete many
await db.collection('users').deleteMany({ age: { $lt: 18 } });

// Mongoose
await User.deleteOne({ name: 'สมชาย' });
await User.findByIdAndDelete(id);
```

---

## 🔍 Query Operators

```javascript
// Comparison
{ age: { $gt: 20 } }      // มากกว่า 20
{ age: { $gte: 20 } }     // มากกว่าหรือเท่ากับ 20
{ age: { $lt: 30 } }      // น้อยกว่า 30
{ age: { $lte: 30 } }     // น้อยกว่าหรือเท่ากับ 30
{ status: { $ne: 'inactive' } }  // ไม่เท่ากับ

// Logical
{ $and: [{ age: { $gte: 20 } }, { age: { $lte: 30 } }] }
{ $or: [{ status: 'active' }, { vip: true }] }

// Array
{ hobbies: { $in: ['coding', 'gaming'] } }
{ tags: { $all: ['urgent', 'important'] } }

// String
{ name: { $regex: /^สม/ } }  // ขึ้นต้นด้วย "สม"
```

---

## 🛠️ Tools ที่ต้องใช้

### 1. MongoDB (ติดตั้งแล้ว)
- ดู: [MONGODB_INSTALLATION.md](../MONGODB_INSTALLATION.md)

### 2. Node.js Packages
```bash
# Mongoose (แนะนำ)
npm install mongoose

# หรือ Native Driver
npm install mongodb

# อื่นๆ
npm install express dotenv cors
```

### 3. MongoDB Compass
- GUI tool สำหรับดู database
- Download: https://www.mongodb.com/try/download/compass

---

## 📋 Workshop Links

### Level 1: Todo App with Mongoose (Guided)
- ✅ Code 100%
- ✅ Step-by-step
- ✅ CRUD operations
- ✅ Schema & Validation
- ✅ Challenge tasks

👉 [Level 1: Todo App](./level-1-guided/README.md)

### Level 2: Blog System (Challenge)
- 🔨 Code 70% + เขียนเอง 30%
- 🔨 Multiple models
- 🔨 References
- 🔨 Population

👉 [Level 2: Blog System](./level-2-challenge/README.md)

---

## 💡 Tips

### 1. _id คือ Primary Key
```javascript
// MongoDB สร้าง _id อัตโนมัติ
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "สมชาย"
}

// หรือกำหนดเอง
{
  _id: "user-001",
  name: "สมชาย"
}
```

### 2. Schema Design
```javascript
// Embedded (ฝังเข้าไป) - One-to-Few
{
  name: "สมชาย",
  addresses: [
    { type: "home", street: "123" },
    { type: "work", street: "456" }
  ]
}

// Reference (อ้างอิง) - One-to-Many
// users
{ _id: "user1", name: "สมชาย" }

// posts
{ _id: "post1", userId: "user1", title: "..." }
```

### 3. Validation
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  }
});
```

---

## 🎓 Learning Outcomes

หลังจบ workshop นี้ คุณจะ:

✅ เข้าใจ MongoDB และ NoSQL concepts  
✅ ใช้ Mongoose สร้าง schemas  
✅ CRUD operations ครบถ้วน  
✅ Query operators ($gt, $in, $regex)  
✅ Validation และ error handling  
✅ เชื่อม MongoDB กับ Express API  

---

## 📚 Prerequisites

ก่อนเริ่ม workshop ควรรู้:
- ✅ Express basics
- ✅ JavaScript async/await
- ✅ REST API concepts
- ✅ ติดตั้ง MongoDB แล้ว

---

## 📚 Resources

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) (Free courses)
- [MongoDB Basics](../MONGODB_BASICS.md)

---

**พร้อมเริ่ม!** → [Level 1: Todo App](./level-1-guided/README.md)

**Let's learn MongoDB! 🍃**
