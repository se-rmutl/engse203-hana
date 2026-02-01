# 📚 เฉลย: Book.js (สำหรับอาจารย์)

## เฉลยฉบับสมบูรณ์

```javascript
// models/Book.js - COMPLETE SOLUTION
const { db } = require('../db');

class Book {
  /**
   * ดึงหนังสือทั้งหมด (ให้มาครบแล้ว)
   */
  static getAll() {
    const sql = 'SELECT * FROM books';
    return db.prepare(sql).all();
  }

  /**
   * ดึงหนังสือที่ว่าง (available = 1)
   * 🔨 นักศึกษาต้องเขียนเอง
   */
  static getAvailable() {
    const sql = 'SELECT * FROM books WHERE available = 1';
    return db.prepare(sql).all();
  }

  /**
   * ค้นหาหนังสือ
   * 🔨 นักศึกษาต้องเขียนเอง
   */
  static search(keyword) {
    const sql = `
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ?
    `;
    const pattern = `%${keyword}%`;
    return db.prepare(sql).all(pattern, pattern);
  }

  /**
   * เพิ่มหนังสือใหม่
   * 🔨 นักศึกษาต้องเขียนเอง
   */
  static add(title, author) {
    const sql = `
      INSERT INTO books (title, author)
      VALUES (?, ?)
    `;
    const result = db.prepare(sql).run(title, author);
    
    // Return หนังสือที่เพิ่ม
    return db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
  }

  /**
   * ดึงหนังสือตาม ID (เพิ่มเติม - ไม่บังคับ)
   */
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

**วัตถุประสงค์:** ดึงหนังสือที่ยังว่างอยู่ (พร้อมให้ยืม)

**SQL สำคัญ:**
```sql
SELECT * FROM books WHERE available = 1
```

**จุดสำคัญ:**
- `available = 1` หมายถึงหนังสือว่าง
- `available = 0` หมายถึงหนังสือถูกยืมไปแล้ว

**ตัวอย่างผลลัพธ์:**
```javascript
[
  { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', available: 1 },
  { id: 4, title: 'Python Programming', author: 'John Doe', available: 1 }
]
```

---

### 2. search()

**วัตถุประสงค์:** ค้นหาหนังสือจากชื่อหรือชื่อผู้แต่ง

**SQL สำคัญ:**
```sql
SELECT * FROM books 
WHERE title LIKE '%keyword%' OR author LIKE '%keyword%'
```

**จุดสำคัญ:**
- ใช้ `LIKE` สำหรับค้นหาแบบ partial match
- `%keyword%` หมายถึงหา keyword ที่อยู่ตรงไหนก็ได้
- ต้องค้นหาทั้ง title และ author

**ตัวอย่าง:**
```javascript
// ค้นหา "harry"
Book.search('harry');
// ผลลัพธ์: [{ id: 1, title: 'Harry Potter', ... }]

// ค้นหา "tolkien"
Book.search('tolkien');
// ผลลัพธ์: [{ id: 2, author: 'J.R.R. Tolkien', ... }]
```

**ป้องกัน SQL Injection:**
```javascript
// ❌ Wrong - SQL Injection
const sql = `SELECT * FROM books WHERE title LIKE '%${keyword}%'`;

// ✅ Correct - Parameterized Query
const sql = `SELECT * FROM books WHERE title LIKE ?`;
const pattern = `%${keyword}%`;
db.prepare(sql).all(pattern);
```

---

### 3. add()

**วัตถุประสงค์:** เพิ่มหนังสือใหม่เข้า database

**SQL สำคัญ:**
```sql
INSERT INTO books (title, author) VALUES (?, ?)
```

**จุดสำคัญ:**
- ไม่ต้องใส่ `id` (AUTOINCREMENT)
- ไม่ต้องใส่ `available` (DEFAULT 1)
- ไม่ต้องใส่ `created_at` (DEFAULT CURRENT_TIMESTAMP)
- ใช้ `lastInsertRowid` เพื่อดึง id ที่เพิ่งสร้าง

**ตัวอย่าง:**
```javascript
const newBook = Book.add('Clean Code', 'Robert Martin');
console.log(newBook);
// { id: 6, title: 'Clean Code', author: 'Robert Martin', available: 1 }
```

---

## ❌ Common Mistakes

### Mistake 1: ใช้ SELECT * ผิด

```javascript
// ❌ Wrong - ดึงทุกอัน แล้วกรองใน JavaScript
static getAvailable() {
  const books = db.prepare('SELECT * FROM books').all();
  return books.filter(book => book.available === 1);
}

// ✅ Correct - กรองใน SQL
static getAvailable() {
  return db.prepare('SELECT * FROM books WHERE available = 1').all();
}
```

**ทำไมผิด:** 
- ช้ากว่า (ดึงข้อมูลมาเยอะ)
- ใช้ memory มากกว่าที่จำเป็น
- Database ทำได้ดีกว่า JavaScript

---

### Mistake 2: SQL Injection

```javascript
// ❌ Wrong - เสี่ยง SQL Injection
static search(keyword) {
  const sql = `SELECT * FROM books WHERE title LIKE '%${keyword}%'`;
  return db.prepare(sql).all();
}

// ตัวอย่างการโจมตี:
Book.search("'; DROP TABLE books; --");
// จะทำให้ลบ table ทิ้ง!
```

```javascript
// ✅ Correct - Parameterized Query
static search(keyword) {
  const sql = `SELECT * FROM books WHERE title LIKE ?`;
  return db.prepare(sql).all(`%${keyword}%`);
}
```

---

### Mistake 3: ไม่ Return ค่า

```javascript
// ❌ Wrong - ไม่ return
static add(title, author) {
  const sql = `INSERT INTO books (title, author) VALUES (?, ?)`;
  db.prepare(sql).run(title, author);
  // ไม่มี return!
}

// ✅ Correct - Return หนังสือที่เพิ่ม
static add(title, author) {
  const sql = `INSERT INTO books (title, author) VALUES (?, ?)`;
  const result = db.prepare(sql).run(title, author);
  return db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
}
```

---

### Mistake 4: ลืมใส่ %

```javascript
// ❌ Wrong - ค้นหาแบบ exact match
static search(keyword) {
  return db.prepare('SELECT * FROM books WHERE title LIKE ?').all(keyword);
}

// ค้นหา "harry" จะไม่เจอ "Harry Potter"

// ✅ Correct - ใช้ wildcard
static search(keyword) {
  return db.prepare('SELECT * FROM books WHERE title LIKE ?').all(`%${keyword}%`);
}
```

---

## 📊 เกณฑ์การให้คะแนน

### getAvailable() - 30 คะแนน

| รายการ | คะแนน |
|--------|-------|
| SQL query ถูกต้อง (WHERE available = 1) | 15 |
| ใช้ prepared statement | 10 |
| Return ข้อมูลถูกต้อง | 5 |

**ข้อดี:** ถ้าใช้ `.get()` แทน `.all()` -5 (เพราะอาจมีหลายเล่ม)

---

### search() - 40 คะแนน

| รายการ | คะแนน |
|--------|-------|
| ค้นหาทั้ง title และ author | 15 |
| ใช้ LIKE ถูกต้อง | 10 |
| ใช้ parameterized query (ป้องกัน SQL injection) | 10 |
| ใส่ % wildcard ถูกต้อง | 5 |

**Bonus:** +5 ถ้าทำ case-insensitive (ใช้ LOWER())

---

### add() - 30 คะแนน

| รายการ | คะแนน |
|--------|-------|
| INSERT statement ถูกต้อง | 10 |
| ใช้ parameterized query | 10 |
| Return หนังสือที่เพิ่ม | 10 |

**ข้อดี:** ถ้าใส่ id, available, created_at ด้วยตัวเอง -5 (ไม่จำเป็น)

---

## 🧪 Test Cases

### Test getAvailable()

```javascript
// สร้างข้อมูลทดสอบ
db.exec(`
  INSERT INTO books (title, author, available) VALUES
  ('Book A', 'Author A', 1),
  ('Book B', 'Author B', 0),
  ('Book C', 'Author C', 1);
`);

// Test
const available = Book.getAvailable();

// ควรได้ 2 เล่ม (Book A และ Book C)
console.assert(available.length === 2, 'Should return 2 available books');
console.assert(available.every(book => book.available === 1), 'All books should be available');
```

---

### Test search()

```javascript
// Test: ค้นหาจาก title
const harryBooks = Book.search('Harry');
console.assert(harryBooks.length > 0, 'Should find Harry Potter');

// Test: ค้นหาจาก author
const tolkienBooks = Book.search('Tolkien');
console.assert(tolkienBooks.length > 0, 'Should find books by Tolkien');

// Test: case-insensitive
const lowerCase = Book.search('harry');
console.assert(lowerCase.length > 0, 'Should work with lowercase');

// Test: SQL Injection
const malicious = Book.search("'; DROP TABLE books; --");
// ควรไม่ error และไม่ลบ table
```

---

### Test add()

```javascript
// Test: เพิ่มหนังสือ
const before = Book.getAll().length;
const newBook = Book.add('Test Book', 'Test Author');

// ตรวจสอบ
console.assert(newBook.id > 0, 'Should have ID');
console.assert(newBook.title === 'Test Book', 'Title should match');
console.assert(newBook.available === 1, 'Should be available by default');
console.assert(Book.getAll().length === before + 1, 'Should increase count');
```

---

## 💡 Tips สำหรับอาจารย์

### การให้คะแนน

1. **ทำงานได้ถูกต้อง = 70%**
   - Query ถูกต้อง
   - Return ค่าถูกต้อง

2. **Code Quality = 20%**
   - ใช้ parameterized queries
   - ไม่มี SQL injection
   - Clean code

3. **Best Practices = 10%**
   - Error handling
   - Return ค่าที่เป็นประโยชน์
   - Comments (ถ้ามี)

### สิ่งที่ควรเช็ค

- ✅ ใช้ prepared statements
- ✅ ไม่มี SQL injection
- ✅ ใช้ `.all()` กับ `.get()` ถูกต้อง
- ✅ Return ค่าที่เหมาะสม
- ❌ ไม่มี `SELECT *` แล้วกรองใน JS

### Alternative Solutions

บางทีนักศึกษาอาจเขียนแบบนี้ (ก็ถูกนะ):

```javascript
// Alternative 1: ใช้ template string
static search(keyword) {
  const sql = `
    SELECT * FROM books 
    WHERE title LIKE $pattern OR author LIKE $pattern
  `;
  return db.prepare(sql).all({ pattern: `%${keyword}%` });
}

// Alternative 2: แยก query
static search(keyword) {
  const titleMatch = db.prepare('SELECT * FROM books WHERE title LIKE ?').all(`%${keyword}%`);
  const authorMatch = db.prepare('SELECT * FROM books WHERE author LIKE ?').all(`%${keyword}%`);
  return [...titleMatch, ...authorMatch];
}
// แต่วิธีนี้อาจได้ซ้ำ
```

---

## 🎓 สรุป

เมธอดทั้ง 3 นี้ฝึก:
- ✅ SQL WHERE clause
- ✅ LIKE operator
- ✅ INSERT statement
- ✅ Parameterized queries
- ✅ SQL injection prevention
- ✅ lastInsertRowid

**ง่ายแต่ครอบคลุมพื้นฐานที่สำคัญ!**
