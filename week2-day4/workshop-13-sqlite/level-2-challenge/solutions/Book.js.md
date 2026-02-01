# 📚 เฉลย: Book.js (สำหรับอาจารย์)

## ✅ Code เต็มรูปแบบ

```javascript
// models/Book.js
const { db } = require('../db');

class Book {
  // ดึงหนังสือทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM books ORDER BY title';
    return db.prepare(sql).all();
  }

  // ดึงหนังสือที่ว่าง (available = 1)
  static getAvailable() {
    const sql = `
      SELECT * FROM books 
      WHERE available = 1
      ORDER BY title
    `;
    return db.prepare(sql).all();
  }

  // ค้นหาหนังสือ
  static search(keyword) {
    const sql = `
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ?
      ORDER BY title
    `;
    const pattern = `%${keyword}%`;
    return db.prepare(sql).all(pattern, pattern);
  }

  // เพิ่มหนังสือใหม่
  static add(title, author) {
    const sql = `
      INSERT INTO books (title, author)
      VALUES (?, ?)
    `;
    const result = db.prepare(sql).run(title, author);
    console.log(`✅ Added book: "${title}" by ${author} (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  }

  // ดึงหนังสือตาม ID
  static getById(id) {
    const sql = 'SELECT * FROM books WHERE id = ?';
    return db.prepare(sql).get(id);
  }
}

module.exports = Book;
```

---

## 📝 คำอธิบายแต่ละ Method

### 1. getAvailable()

**สิ่งที่ต้องทำ:**
- SELECT หนังสือที่ `available = 1`
- เรียงตามชื่อ (ORDER BY title)

**จุดสำคัญ:**
- WHERE clause กรองเฉพาะที่ available = 1
- ใช้ `.all()` เพราะต้องการหลายแถว

**ตัวอย่าง:**
```javascript
const available = Book.getAvailable();
// [
//   { id: 2, title: 'Python Programming', available: 1 },
//   { id: 4, title: 'The Hobbit', available: 1 }
// ]
```

---

### 2. search(keyword)

**สิ่งที่ต้องทำ:**
- ค้นหาจาก `title` หรือ `author`
- ใช้ LIKE กับ wildcard `%`

**จุดสำคัญ:**
- `%keyword%` = match ทุกที่ที่มี keyword
- ต้องส่ง pattern 2 ครั้ง (title และ author)
- ใช้ parameterized query (ป้องกัน SQL injection)

**ตัวอย่าง:**
```javascript
// ค้นหา "Harry"
Book.search('Harry');
// [{ id: 1, title: 'Harry Potter', author: 'J.K. Rowling' }]

// ค้นหา "Tolkien" (ผู้แต่ง)
Book.search('Tolkien');
// [{ id: 3, title: 'The Hobbit', author: 'J.R.R. Tolkien' }]
```

---

### 3. add(title, author)

**สิ่งที่ต้องทำ:**
- INSERT หนังสือใหม่
- return ID ที่เพิ่ง INSERT

**จุดสำคัญ:**
- ใช้ `.run()` สำหรับ INSERT
- `result.lastInsertRowid` = ID ที่เพิ่ง INSERT
- `available` เป็น 1 อัตโนมัติ (DEFAULT)

**ตัวอย่าง:**
```javascript
const newId = Book.add('Clean Code', 'Robert Martin');
// ✅ Added book: "Clean Code" by Robert Martin (ID: 6)
console.log(newId); // 6
```

---

## ❌ Common Mistakes

### Mistake 1: ลืม % ใน LIKE
```javascript
// ❌ ผิด - ต้อง match ทุกตัวอักษร
const pattern = keyword;

// ✅ ถูก - match ส่วนใดส่วนหนึ่ง
const pattern = `%${keyword}%`;
```

### Mistake 2: ส่ง parameter ไม่ครบ
```javascript
// ❌ ผิด - มี ? 2 อัน แต่ส่ง 1
return db.prepare(sql).all(pattern);

// ✅ ถูก - ส่ง 2
return db.prepare(sql).all(pattern, pattern);
```

### Mistake 3: ใช้ .get() แทน .all()
```javascript
// ❌ ผิด - ได้แค่ 1 เล่ม
static getAvailable() {
  return db.prepare(sql).get();
}

// ✅ ถูก - ได้ทุกเล่ม
static getAvailable() {
  return db.prepare(sql).all();
}
```

---

## 📊 เกณฑ์การให้คะแนน

### getAvailable() - 30 คะแนน
- WHERE clause (15)
- ใช้ .all() (10)
- ORDER BY (5 - bonus)

### search() - 40 คะแนน
- LIKE syntax (15)
- OR condition (10)
- Parameterized query (15)

### add() - 30 คะแนน
- INSERT syntax (15)
- return lastInsertRowid (10)
- console.log (5)

**รวม 100 คะแนน**

---

**เฉลยง่าย เข้าใจได้ พร้อมใช้! ✅**
