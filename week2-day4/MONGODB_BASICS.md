# 🍃 MongoDB พื้นฐาน สำหรับผู้เริ่มต้น

## 📚 MongoDB คืออะไร?

**MongoDB** เป็น NoSQL Database ที่:
- เก็บข้อมูลเป็น **Documents** (JSON-like)
- ไม่ต้องกำหนด Schema ล่วงหน้า (Flexible)
- Scale ได้ง่าย (Horizontal Scaling)
- เหมาะกับ Modern Applications

---

## 💡 SQL vs NoSQL (MongoDB)

### การเปรียบเทียบ

| Concept | SQL (SQLite) | NoSQL (MongoDB) |
|---------|--------------|-----------------|
| เก็บข้อมูล | Tables | Collections |
| แต่ละรายการ | Row | Document |
| โครงสร้าง | Fixed Schema | Flexible Schema |
| ความสัมพันธ์ | JOINs | Embedded / References |
| ภาษา | SQL | JavaScript-like |

### ตัวอย่างเปรียบเทียบ

**SQL (SQLite):**
```sql
-- Table: users
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER
);

INSERT INTO users (name, email, age)
VALUES ('สมชาย', 'somchai@email.com', 25);

SELECT * FROM users WHERE age > 20;
```

**NoSQL (MongoDB):**
```javascript
// Collection: users
// ไม่ต้องสร้าง schema!

// เพิ่มข้อมูล
db.users.insertOne({
  name: 'สมชาย',
  email: 'somchai@email.com',
  age: 25
});

// ดึงข้อมูล
db.users.find({ age: { $gt: 20 } });
```

---

## 📊 โครงสร้างของ MongoDB

```
MongoDB Server
└── Databases
    └── Collections
        └── Documents
            └── Fields
```

### อธิบายแต่ละส่วน

**1. Database**
- เหมือนตู้เก็บเอกสารทั้งตู้
- แต่ละ Database เก็บ Collections หลายอัน

**2. Collection**
- เหมือนลิ้นชักในตู้
- เก็บ Documents ที่คล้ายๆ กัน
- ไม่ต้องกำหนด schema

**3. Document**
- เหมือนกระดาษแต่ละแผ่น
- เก็บเป็น JSON (BSON จริงๆ)
- แต่ละ document มี structure ต่างกันได้

**4. Field**
- เหมือนข้อมูลในกระดาษ
- Key-Value pairs

### ตัวอย่าง

```javascript
// Database: school

// Collection: students
{
  _id: ObjectId("..."),
  name: "สมชาย",
  age: 20,
  courses: ["Math", "English"],
  address: {
    city: "Bangkok",
    zip: "10110"
  }
}

// Collection: courses
{
  _id: ObjectId("..."),
  code: "CS101",
  name: "Programming",
  credits: 3
}
```

---

## 🔑 MongoDB Document

### Document = JSON Object

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // Auto-generated
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

### จุดเด่นของ Document

**1. Flexible Schema**
```javascript
// Document 1
{ name: "สมชาย", age: 25, email: "s@email.com" }

// Document 2 - fields ต่างกันได้!
{ name: "สมหญิง", age: 23, phone: "081-234-5678", hobbies: ["music"] }
```

**2. Nested Objects**
```javascript
{
  name: "สมชาย",
  address: {  // Object ซ้อน Object
    home: {
      street: "123",
      city: "Bangkok"
    },
    work: {
      street: "456",
      city: "Bangkok"
    }
  }
}
```

**3. Arrays**
```javascript
{
  name: "สมชาย",
  hobbies: ["reading", "coding", "gaming"],
  scores: [85, 90, 78],
  friends: [
    { name: "สมหญิง", age: 23 },
    { name: "ชาติชาย", age: 25 }
  ]
}
```

---

## 🎯 CRUD Operations

### C - Create (เพิ่มข้อมูล)

```javascript
// เพิ่มทีละ document
db.users.insertOne({
  name: "สมชาย",
  age: 25,
  email: "somchai@email.com"
});

// เพิ่มหลาย documents
db.users.insertMany([
  { name: "สมหญิง", age: 23 },
  { name: "ชาติชาย", age: 27 }
]);
```

### R - Read (ดึงข้อมูล)

```javascript
// ดึงทั้งหมด
db.users.find();

// ดึงตาม condition
db.users.find({ age: 25 });

// ดึงทีละ document
db.users.findOne({ name: "สมชาย" });

// ดึงเฉพาะ fields
db.users.find({}, { name: 1, age: 1, _id: 0 });

// เรียงลำดับ
db.users.find().sort({ age: -1 });  // -1 = DESC, 1 = ASC

// จำกัดจำนวน
db.users.find().limit(5);

// ข้าม
db.users.find().skip(10).limit(5);  // Pagination
```

### U - Update (แก้ไขข้อมูล)

```javascript
// แก้ไข document เดียว
db.users.updateOne(
  { name: "สมชาย" },  // Filter
  { $set: { age: 26 } }  // Update
);

// แก้ไขหลาย documents
db.users.updateMany(
  { age: { $lt: 20 } },
  { $set: { status: "minor" } }
);

// แทนที่ทั้ง document
db.users.replaceOne(
  { name: "สมชาย" },
  { name: "สมชาย", age: 26, email: "new@email.com" }
);
```

### D - Delete (ลบข้อมูล)

```javascript
// ลบ document เดียว
db.users.deleteOne({ name: "สมชาย" });

// ลบหลาย documents
db.users.deleteMany({ age: { $lt: 18 } });

// ลบทั้งหมด
db.users.deleteMany({});
```

---

## 🔍 Query Operators

### Comparison Operators

```javascript
// $eq - เท่ากับ
db.users.find({ age: { $eq: 25 } });
// เหมือนกับ
db.users.find({ age: 25 });

// $gt - มากกว่า
db.users.find({ age: { $gt: 20 } });

// $gte - มากกว่าเท่ากับ
db.users.find({ age: { $gte: 20 } });

// $lt - น้อยกว่า
db.users.find({ age: { $lt: 30 } });

// $lte - น้อยกว่าเท่ากับ
db.users.find({ age: { $lte: 30 } });

// $ne - ไม่เท่ากับ
db.users.find({ status: { $ne: "inactive" } });

// $in - อยู่ใน array
db.users.find({ age: { $in: [20, 25, 30] } });

// $nin - ไม่อยู่ใน array
db.users.find({ status: { $nin: ["banned", "deleted"] } });
```

### Logical Operators

```javascript
// $and
db.users.find({
  $and: [
    { age: { $gte: 20 } },
    { age: { $lte: 30 } }
  ]
});

// $or
db.users.find({
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 60 } }
  ]
});

// $not
db.users.find({ age: { $not: { $gt: 25 } } });

// $nor (ไม่เป็นทั้งหมด)
db.users.find({
  $nor: [
    { status: "banned" },
    { age: { $lt: 18 } }
  ]
});
```

### Array Operators

```javascript
// $all - มีทุกตัว
db.users.find({ hobbies: { $all: ["coding", "gaming"] } });

// $elemMatch - match อย่างน้อย 1 element
db.users.find({
  scores: { $elemMatch: { $gte: 80, $lt: 90 } }
});

// $size - ขนาด array
db.users.find({ hobbies: { $size: 3 } });
```

### String Operators

```javascript
// $regex - Regular expression
db.users.find({ name: { $regex: /^สม/ } });  // ขึ้นต้นด้วย "สม"

// Case insensitive
db.users.find({ 
  email: { $regex: /gmail/i }  // i = case insensitive
});
```

---

## 🔄 Update Operators

```javascript
// $set - ตั้งค่า field
db.users.updateOne(
  { name: "สมชาย" },
  { $set: { age: 26, email: "new@email.com" } }
);

// $unset - ลบ field
db.users.updateOne(
  { name: "สมชาย" },
  { $unset: { phone: "" } }
);

// $inc - เพิ่มค่า
db.users.updateOne(
  { name: "สมชาย" },
  { $inc: { age: 1, score: 10 } }
);

// $mul - คูณค่า
db.products.updateOne(
  { name: "Laptop" },
  { $mul: { price: 1.1 } }  // เพิ่ม 10%
);

// $rename - เปลี่ยนชื่อ field
db.users.updateMany(
  {},
  { $rename: { "phone": "phoneNumber" } }
);

// $currentDate - ตั้งเป็นวันที่ปัจจุบัน
db.users.updateOne(
  { name: "สมชาย" },
  { $currentDate: { lastModified: true } }
);
```

### Array Update Operators

```javascript
// $push - เพิ่มใน array
db.users.updateOne(
  { name: "สมชาย" },
  { $push: { hobbies: "swimming" } }
);

// $push หลายตัว
db.users.updateOne(
  { name: "สมชาย" },
  { $push: { hobbies: { $each: ["swimming", "running"] } } }
);

// $pull - ลบออกจาก array
db.users.updateOne(
  { name: "สมชาย" },
  { $pull: { hobbies: "gaming" } }
);

// $addToSet - เพิ่มถ้ายังไม่มี (ไม่ซ้ำ)
db.users.updateOne(
  { name: "สมชาย" },
  { $addToSet: { hobbies: "coding" } }
);

// $pop - ลบตัวแรก (-1) หรือตัวสุดท้าย (1)
db.users.updateOne(
  { name: "สมชาย" },
  { $pop: { hobbies: 1 } }  // ลบตัวสุดท้าย
);
```

---

## 📈 Aggregation Pipeline (พื้นฐาน)

**Aggregation** = การประมวลผลข้อมูลหลายขั้นตอน

```javascript
// ตัวอย่างข้อมูล
db.orders.insertMany([
  { customer: "สมชาย", product: "Laptop", price: 30000, quantity: 1 },
  { customer: "สมชาย", product: "Mouse", price: 500, quantity: 2 },
  { customer: "สมหญิง", product: "Keyboard", price: 1500, quantity: 1 },
  { customer: "สมหญิง", product: "Monitor", price: 8000, quantity: 2 }
]);

// Pipeline
db.orders.aggregate([
  // Stage 1: คำนวณ total
  {
    $addFields: {
      total: { $multiply: ["$price", "$quantity"] }
    }
  },
  
  // Stage 2: Group by customer
  {
    $group: {
      _id: "$customer",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  
  // Stage 3: เรียงตามยอดซื้อ
  {
    $sort: { totalSpent: -1 }
  }
]);
```

**ผลลัพธ์:**
```javascript
[
  { _id: "สมหญิง", totalSpent: 17500, orderCount: 2 },
  { _id: "สมชาย", totalSpent: 31000, orderCount: 2 }
]
```

---

## 🔗 Relationships (ความสัมพันธ์)

MongoDB มี 2 วิธีจัดการ relationships:

### 1. Embedded (ฝังเข้าไป)

**ใช้เมื่อ:** ข้อมูลมี relationship แบบ One-to-Few

```javascript
// User with embedded addresses
{
  _id: ObjectId("..."),
  name: "สมชาย",
  addresses: [
    {
      type: "home",
      street: "123 ถ.สุขุมวิท",
      city: "กรุงเทพฯ"
    },
    {
      type: "work",
      street: "456 ถ.สีลม",
      city: "กรุงเทพฯ"
    }
  ]
}
```

**ข้อดี:**
- ✅ Query ครั้งเดียวได้ทุกอย่าง
- ✅ เร็วกว่า

**ข้อเสีย:**
- ❌ ข้อมูลซ้ำได้
- ❌ Document ใหญ่เกินไป (max 16MB)

### 2. References (อ้างอิง)

**ใช้เมื่อ:** ข้อมูลมี relationship แบบ One-to-Many หรือ Many-to-Many

```javascript
// Collection: users
{
  _id: ObjectId("user1"),
  name: "สมชาย"
}

// Collection: posts
{
  _id: ObjectId("post1"),
  title: "บทความแรก",
  userId: ObjectId("user1"),  // Reference
  content: "..."
}
```

**ดึงข้อมูล:** ต้อง query 2 ครั้ง

```javascript
// 1. หา user
const user = db.users.findOne({ name: "สมชาย" });

// 2. หา posts ของ user นี้
const posts = db.posts.find({ userId: user._id });
```

หรือใช้ `$lookup` (เหมือน JOIN):

```javascript
db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "userId",
      as: "posts"
    }
  }
]);
```

---

## 💡 เมื่อไหร่ใช้ SQL vs MongoDB?

### ใช้ SQL (SQLite, PostgreSQL) เมื่อ:
- ✅ ข้อมูลมี structure ชัดเจน
- ✅ มี relationships ซับซ้อน
- ✅ ต้องการ ACID transactions แบบเข้มงวด
- ✅ ใช้ aggregate queries ซับซ้อน

**ตัวอย่าง:** Banking, Accounting, ERP

### ใช้ MongoDB เมื่อ:
- ✅ Schema เปลี่ยนบ่อย
- ✅ ต้องการ scale horizontally
- ✅ เก็บข้อมูลแบบ hierarchical
- ✅ Rapid development

**ตัวอย่าง:** Social Media, IoT, Real-time Analytics

---

## 📝 Best Practices

### 1. ตั้งชื่อ Collections
```javascript
// ✅ ถูก - lowercase, plural
db.users
db.products
db.orders

// ❌ ผิด
db.Users
db.Product
db.order
```

### 2. ใช้ _id อย่างมีประสิทธิภาพ
```javascript
// MongoDB สร้าง ObjectId อัตโนมัติ
{
  _id: ObjectId("507f1f77bcf86cd799439011")
}

// หรือใช้ custom _id
{
  _id: "user-001",  // String
  name: "สมชาย"
}
```

### 3. Index สำหรับ Performance
```javascript
// สร้าง index บน field ที่ query บ่อย
db.users.createIndex({ email: 1 });

// Compound index
db.users.createIndex({ lastName: 1, firstName: 1 });

// ดู indexes
db.users.getIndexes();
```

### 4. Validation (Optional)
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      required: ["name", "email"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        age: {
          bsonType: "int",
          minimum: 0,
          maximum: 150
        }
      }
    }
  }
});
```

---

## 🎓 สรุป

### MongoDB Concepts:
- ✅ Database → Collection → Document → Field
- ✅ Document = JSON-like
- ✅ Flexible Schema
- ✅ CRUD: insertOne/Many, find, updateOne/Many, deleteOne/Many

### Query:
- ✅ Comparison: $gt, $lt, $eq, $in
- ✅ Logical: $and, $or, $not
- ✅ Array: $all, $elemMatch, $size
- ✅ String: $regex

### Update:
- ✅ $set, $unset, $inc, $mul
- ✅ Array: $push, $pull, $addToSet

### Relationships:
- ✅ Embedded (ฝัง) - One-to-Few
- ✅ References (อ้างอิง) - One-to-Many

---

**พร้อมเริ่ม Workshop แล้ว! 🚀**
