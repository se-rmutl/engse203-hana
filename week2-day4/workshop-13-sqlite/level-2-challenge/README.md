# 🏆 Workshop 13 - Level 2: Simple Library System

## 📌 ภาพรวม

สร้าง **ระบบห้องสมุดง่ายๆ** ที่มี:
- 📚 หนังสือ (books)
- 👤 สมาชิก (members)
- 📖 การยืม (borrowings)

**3 tables** - relationships พื้นฐาน - ฝึกการ JOIN

---

## 🎯 ฟีเจอร์

✅ เพิ่ม/ดูหนังสือ  
✅ เพิ่ม/ดูสมาชิก  
✅ ยืมหนังสือ  
✅ คืนหนังสือ  
✅ ดูว่าใครยืมหนังสืออะไรอยู่  
✅ ดูว่าสมาชิกคนไหนยืมอะไรไปบ้าง  

---

## 📊 Database Design

```
📚 books               👤 members              📖 borrowings
├── id                ├── id                  ├── id
├── title             ├── name                ├── book_id ──────┐
├── author            ├── email               ├── member_id ────┤
└── available         └── phone               ├── borrow_date   │
                                              └── return_date   │
                                                                │
                              ┌─────────────────────────────────┘
                              │
                              └──> foreign keys
```

---

## 📁 โครงสร้างโปรเจค

```
level-2-challenge/
├── package.json
├── schema.sql          # ✅ ให้มาครบ
├── seed.sql            # ✅ ให้มาครบ
├── db.js               # ✅ ให้มาครบ
├── models/
│   ├── Book.js         # 🔨 ต้องเขียนเอง 30%
│   ├── Member.js       # 🔨 ต้องเขียนเอง 30%
│   └── Borrowing.js    # 🔨 ต้องเขียนเอง 40%
├── index.js            # ✅ ให้มาครบ
└── solutions/          # เฉลยสำหรับอาจารย์
    ├── Book.js
    ├── Member.js
    └── Borrowing.js
```

---

## 🚀 Setup

```bash
mkdir library-system
cd library-system
npm init -y
npm install better-sqlite3
```

---

## 📝 Code ที่ให้มา (70%)

### 1. `schema.sql` (ให้มาครบ ✅)

```sql
-- schema.sql

-- ลบ tables เก่า
DROP TABLE IF EXISTS borrowings;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;

-- ตาราง books (หนังสือ)
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  available INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง members (สมาชิก)
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง borrowings (การยืม)
CREATE TABLE borrowings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  borrow_date TEXT DEFAULT CURRENT_TIMESTAMP,
  return_date TEXT,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);
```

### 2. `seed.sql` (ให้มาครบ ✅)

```sql
-- seed.sql

-- หนังสือ 5 เล่ม
INSERT INTO books (title, author) VALUES
  ('Harry Potter', 'J.K. Rowling'),
  ('The Hobbit', 'J.R.R. Tolkien'),
  ('1984', 'George Orwell'),
  ('Python Programming', 'John Doe'),
  ('Web Development', 'Jane Smith');

-- สมาชิก 3 คน
INSERT INTO members (name, email, phone) VALUES
  ('สมชาย ใจดี', 'somchai@email.com', '0812345678'),
  ('สมหญิง รักเรียน', 'somying@email.com', '0823456789'),
  ('ชาติชาย มั่นคง', 'chatichai@email.com', '0834567890');

-- การยืมบางรายการ (ยังไม่คืน)
INSERT INTO borrowings (book_id, member_id) VALUES
  (1, 1),  -- สมชายยืม Harry Potter
  (3, 2);  -- สมหญิงยืม 1984
  
-- อัพเดทว่าหนังสือถูกยืมไปแล้ว
UPDATE books SET available = 0 WHERE id IN (1, 3);
```

### 3. `db.js` (ให้มาครบ ✅)

```javascript
// db.js
const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('library.db');

// โหลดและรัน SQL file
function runSQL(filename) {
  const sql = fs.readFileSync(filename, 'utf-8');
  db.exec(sql);
  console.log(`✅ ${filename} executed`);
}

// สร้าง tables และใส่ข้อมูล
function reset() {
  console.log('🔄 Resetting database...');
  runSQL('schema.sql');
  runSQL('seed.sql');
  console.log('✅ Database ready!');
}

module.exports = { db, reset };
```

### 4. `index.js` (ให้มาครบ ✅)

```javascript
// index.js
const { db, reset } = require('./db');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Borrowing = require('./models/Borrowing');

// Reset database
reset();

console.log('\n📚 Library System Demo');
console.log('='.repeat(50));

// 1. แสดงหนังสือทั้งหมด
console.log('\n1️⃣ All Books:');
const books = Book.getAll();
console.table(books);

// 2. แสดงสมาชิกทั้งหมด
console.log('\n2️⃣ All Members:');
const members = Member.getAll();
console.table(members);

// 3. แสดงหนังสือที่ว่าง (available)
console.log('\n3️⃣ Available Books:');
const available = Book.getAvailable();
console.table(available);

// 4. ยืมหนังสือ
console.log('\n4️⃣ Borrow a book:');
Borrowing.borrow(2, 3); // ชาติชายยืม The Hobbit

// 5. แสดงการยืมทั้งหมด
console.log('\n5️⃣ All Borrowings:');
const borrowings = Borrowing.getAll();
console.table(borrowings);

// 6. ดูว่าสมาชิกคนนี้ยืมอะไรบ้าง
console.log('\n6️⃣ Books borrowed by Member #1:');
const memberBooks = Member.getBorrowedBooks(1);
console.table(memberBooks);

// 7. คืนหนังสือ
console.log('\n7️⃣ Return a book:');
Borrowing.returnBook(1); // คืนหนังสือที่ยืมรายการที่ 1

// 8. แสดงหนังสือที่ว่างอีกครั้ง
console.log('\n8️⃣ Available Books (after return):');
const availableAfter = Book.getAvailable();
console.table(availableAfter);

db.close();
```

---

## 🔨 Code ที่ต้องเขียนเอง (30%)

### 5. `models/Book.js` (เขียนเอง 30% 🔨)

```javascript
// models/Book.js
const { db } = require('../db');

class Book {
  // ดึงหนังสือทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM books';
    return db.prepare(sql).all();
  }

  // ดึงหนังสือที่ว่าง (available = 1)
  static getAvailable() {
    // TODO: เขียน SQL query เพื่อดึงหนังสือที่ available = 1
    // Hint: WHERE available = 1
    
    // YOUR CODE HERE
    const sql = `
      -- YOUR SQL HERE
    `;
    return db.prepare(sql).all();
  }

  // ค้นหาหนังสือ
  static search(keyword) {
    // TODO: ค้นหาจาก title หรือ author
    // Hint: ใช้ LIKE '%keyword%'
    
    // YOUR CODE HERE
    
  }

  // เพิ่มหนังสือใหม่
  static add(title, author) {
    // TODO: เพิ่มหนังสือใหม่
    
    // YOUR CODE HERE
    
  }
}

module.exports = Book;
```

**💡 Hints:**

<details>
<summary>คลิกดู hints สำหรับ getAvailable()</summary>

```javascript
static getAvailable() {
  const sql = 'SELECT * FROM books WHERE available = 1';
  return db.prepare(sql).all();
}
```
</details>

<details>
<summary>คลิกดู hints สำหรับ search()</summary>

```javascript
static search(keyword) {
  const sql = `
    SELECT * FROM books 
    WHERE title LIKE ? OR author LIKE ?
  `;
  const pattern = `%${keyword}%`;
  return db.prepare(sql).all(pattern, pattern);
}
```
</details>

### 6. `models/Member.js` (เขียนเอง 30% 🔨)

```javascript
// models/Member.js
const { db } = require('../db');

class Member {
  // ดึงสมาชิกทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM members';
    return db.prepare(sql).all();
  }

  // ดูหนังสือที่สมาชิกยืมอยู่
  static getBorrowedBooks(memberId) {
    // TODO: JOIN กับ books และ borrowings
    // แสดง: book title, author, borrow_date
    // เฉพาะที่ยังไม่คืน (return_date IS NULL)
    
    // YOUR CODE HERE
    const sql = `
      SELECT 
        books.title,
        books.author,
        borrowings.borrow_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ? AND borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all(memberId);
  }

  // เพิ่มสมาชิกใหม่
  static add(name, email, phone) {
    // TODO: เพิ่มสมาชิกใหม่
    
    // YOUR CODE HERE
    
  }
}

module.exports = Member;
```

**💡 Hint:** getBorrowedBooks() มีเฉลยให้แล้ว เพราะเป็น JOIN ที่สำคัญ

### 7. `models/Borrowing.js` (เขียนเอง 40% 🔨)

```javascript
// models/Borrowing.js
const { db } = require('../db');

class Borrowing {
  // ดึงการยืมทั้งหมด พร้อม JOIN
  static getAll() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        members.name as member,
        borrowings.borrow_date,
        borrowings.return_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
    `;
    return db.prepare(sql).all();
  }

  // ยืมหนังสือ
  static borrow(bookId, memberId) {
    // TODO: ทำ 2 อย่าง
    // 1. เพิ่มรายการใน borrowings
    // 2. อัพเดท books ให้ available = 0
    
    // YOUR CODE HERE
    // Hint: ใช้ 2 คำสั่ง SQL
    
    console.log(`✅ Book #${bookId} borrowed by Member #${memberId}`);
  }

  // คืนหนังสือ
  static returnBook(borrowingId) {
    // TODO: ทำ 3 อย่าง
    // 1. หา book_id จาก borrowing
    // 2. อัพเดท borrowings ให้มี return_date
    // 3. อัพเดท books ให้ available = 1
    
    // YOUR CODE HERE
    
    console.log(`✅ Book returned (Borrowing #${borrowingId})`);
  }

  // ดูหนังสือที่ยังไม่คืน
  static getUnreturned() {
    // TODO: ดึงการยืมที่ return_date IS NULL
    
    // YOUR CODE HERE
    
  }
}

module.exports = Borrowing;
```

**💡 Hints:**

<details>
<summary>คลิกดู hints สำหรับ borrow()</summary>

```javascript
static borrow(bookId, memberId) {
  // 1. เพิ่มรายการยืม
  const insertSql = `
    INSERT INTO borrowings (book_id, member_id)
    VALUES (?, ?)
  `;
  db.prepare(insertSql).run(bookId, memberId);

  // 2. อัพเดทหนังสือว่าไม่ว่าง
  const updateSql = `
    UPDATE books SET available = 0 WHERE id = ?
  `;
  db.prepare(updateSql).run(bookId);

  console.log(`✅ Book #${bookId} borrowed by Member #${memberId}`);
}
```
</details>

<details>
<summary>คลิกดู hints สำหรับ returnBook()</summary>

```javascript
static returnBook(borrowingId) {
  // 1. หา book_id
  const getBorrowingSql = `
    SELECT book_id FROM borrowings WHERE id = ?
  `;
  const borrowing = db.prepare(getBorrowingSql).get(borrowingId);

  // 2. อัพเดทว่าคืนแล้ว
  const updateBorrowingSql = `
    UPDATE borrowings 
    SET return_date = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  db.prepare(updateBorrowingSql).run(borrowingId);

  // 3. อัพเดทหนังสือว่าว่าง
  const updateBookSql = `
    UPDATE books SET available = 1 WHERE id = ?
  `;
  db.prepare(updateBookSql).run(borrowing.book_id);

  console.log(`✅ Book returned (Borrowing #${borrowingId})`);
}
```
</details>

---

## ✅ Checklist

- [ ] `Book.js` - getAvailable()
- [ ] `Book.js` - search()
- [ ] `Book.js` - add()
- [ ] `Member.js` - getBorrowedBooks() (มีเฉลย)
- [ ] `Member.js` - add()
- [ ] `Borrowing.js` - borrow()
- [ ] `Borrowing.js` - returnBook()
- [ ] `Borrowing.js` - getUnreturned()

---

## 🧪 ทดสอบ

```bash
# รันโปรแกรม
node index.js
```

**ผลลัพธ์ที่ควรเห็น:**
1. หนังสือทั้งหมด
2. สมาชิกทั้งหมด
3. หนังสือที่ว่าง
4. ยืมหนังสือสำเร็จ
5. รายการยืมทั้งหมด
6. หนังสือที่สมาชิกยืม
7. คืนหนังสือสำเร็จ
8. หนังสือที่ว่าง (อัพเดท)

---

## 🎓 สิ่งที่ได้เรียนรู้

✅ การออกแบบ database หลายตาราง  
✅ Foreign Keys และ relationships  
✅ การ JOIN ข้อมูลจากหลาย tables  
✅ Transactions พื้นฐาน  
✅ Business logic ใน database  

---

**ทำได้ดีมาก! เข้าใจ database relationships แล้ว! 🎉**
