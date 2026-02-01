# 👤 เฉลย: Member.js (Library System)

## โค้ดเฉลยฉบับสมบูรณ์

```javascript
// solutions/Member.js
const { db } = require('../db');

class Member {
  /**
   * ดึงสมาชิกทั้งหมด
   */
  static getAll() {
    const sql = 'SELECT * FROM members';
    return db.prepare(sql).all();
  }

  /**
   * ดูหนังสือที่สมาชิกยืมอยู่ (พร้อม JOIN)
   * 🔨 นักศึกษาต้องเขียนเอง
   * 
   * เฉลยนี้ให้มาครบแล้วในโจทย์ เพราะเป็น JOIN ที่สำคัญ
   */
  static getBorrowedBooks(memberId) {
    const sql = `
      SELECT 
        books.title,
        books.author,
        borrowings.borrow_date,
        borrowings.id as borrowing_id
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ? 
        AND borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all(memberId);
  }

  /**
   * เพิ่มสมาชิกใหม่
   * 🔨 นักศึกษาต้องเขียนเอง
   */
  static add(name, email, phone) {
    const sql = `
      INSERT INTO members (name, email, phone)
      VALUES (?, ?, ?)
    `;
    const result = db.prepare(sql).run(name, email, phone);
    
    console.log(`✅ Added member: ${name} (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  }

  /**
   * ดึงสมาชิกตาม ID
   */
  static getById(id) {
    const sql = 'SELECT * FROM members WHERE id = ?';
    return db.prepare(sql).get(id);
  }

  /**
   * ดึงสมาชิกตาม email
   */
  static getByEmail(email) {
    const sql = 'SELECT * FROM members WHERE email = ?';
    return db.prepare(sql).get(email);
  }

  /**
   * นับจำนวนหนังสือที่สมาชิกยืมอยู่
   */
  static countBorrowedBooks(memberId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM borrowings
      WHERE member_id = ? AND return_date IS NULL
    `;
    const result = db.prepare(sql).get(memberId);
    return result.count;
  }
}

module.exports = Member;
```

---

## 📖 คำอธิบายแต่ละ Method

### 1. `getBorrowedBooks(memberId)` - ดูหนังสือที่ยืมอยู่

**สิ่งที่ต้องทำ:**
- JOIN ระหว่าง `borrowings` และ `books`
- กรองตาม `member_id`
- แสดงเฉพาะที่ยังไม่คืน (`return_date IS NULL`)

**แนวคิด:**
```sql
SELECT 
  books.title,
  books.author,
  borrowings.borrow_date
FROM borrowings
JOIN books ON borrowings.book_id = books.id
WHERE borrowings.member_id = ?
  AND borrowings.return_date IS NULL
```

**ทำไมต้อง JOIN:**
- `borrowings` มีแค่ `book_id` (ตัวเลข)
- ต้องการ `title` และ `author` จาก `books`
- ใช้ JOIN เพื่อเชื่อมข้อมูล

**ตัวอย่างผลลัพธ์:**
```javascript
Member.getBorrowedBooks(1);
// [
//   {
//     title: 'Harry Potter',
//     author: 'J.K. Rowling',
//     borrow_date: '2024-01-31 10:00:00',
//     borrowing_id: 1
//   }
// ]
```

**การทำงานของ JOIN:**
```
borrowings table:          books table:
id | book_id | member_id   id | title
1  | 1       | 1           1  | Harry Potter
2  | 3       | 2           2  | The Hobbit
                            3  | 1984

JOIN ON book_id = id:
borrowing.id | book.title    | member_id
1            | Harry Potter  | 1
2            | 1984          | 2
```

---

### 2. `add(name, email, phone)` - เพิ่มสมาชิกใหม่

**สิ่งที่ต้องทำ:**
- INSERT สมาชิกใหม่
- return ID ของสมาชิกที่เพิ่ม

**แนวคิด:**
```sql
INSERT INTO members (name, email, phone)
VALUES ('...', '...', '...');
```

**จุดสำคัญ:**
- ไม่ต้องใส่ `id` (AUTOINCREMENT)
- ไม่ต้องใส่ `created_at` (DEFAULT)
- `email` ต้อง UNIQUE (ถ้าซ้ำจะ error)

**ตัวอย่างการใช้:**
```javascript
try {
  const newId = Member.add('ณัฐพล', 'nuttapol@email.com', '0891234567');
  console.log(`Member ID: ${newId}`);
} catch (error) {
  console.error('อีเมลซ้ำ!');
}
```

**Error Handling (ถ้าอีเมลซ้ำ):**
```javascript
static add(name, email, phone) {
  try {
    const sql = `INSERT INTO members (name, email, phone) VALUES (?, ?, ?)`;
    const result = db.prepare(sql).run(name, email, phone);
    return result.lastInsertRowid;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      throw new Error('อีเมลนี้มีในระบบแล้ว');
    }
    throw error;
  }
}
```

---

### 3. `countBorrowedBooks(memberId)` - นับหนังสือที่ยืม

**สิ่งที่ต้องทำ:**
- นับจำนวนหนังสือที่สมาชิกยืมอยู่
- เฉพาะที่ยังไม่คืน

**แนวคิด:**
```sql
SELECT COUNT(*) as count
FROM borrowings
WHERE member_id = ? AND return_date IS NULL
```

**จุดสำคัญ:**
- ใช้ `COUNT(*)` นับแถว
- `return_date IS NULL` = ยังไม่คืน
- return เฉพาะตัวเลข

**ตัวอย่างการใช้:**
```javascript
const count = Member.countBorrowedBooks(1);
console.log(`สมาชิกยืมหนังสืออยู่ ${count} เล่ม`);
```

---

## ❌ Common Mistakes

### Mistake 1: JOIN ผิด

```javascript
// ❌ ผิด - CROSS JOIN (ได้ผลลัพธ์มากเกินไป)
static getBorrowedBooks(memberId) {
  const sql = `
    SELECT books.title
    FROM borrowings, books
    WHERE borrowings.member_id = ?
  `;
  return db.prepare(sql).all(memberId);
}

// ✅ ถูก - ใช้ JOIN ON
static getBorrowedBooks(memberId) {
  const sql = `
    SELECT books.title
    FROM borrowings
    JOIN books ON borrowings.book_id = books.id
    WHERE borrowings.member_id = ?
  `;
  return db.prepare(sql).all(memberId);
}
```

### Mistake 2: ลืมเช็คว่าคืนแล้ว

```javascript
// ❌ ผิด - แสดงทุกอัน (รวมที่คืนแล้ว)
static getBorrowedBooks(memberId) {
  const sql = `
    SELECT books.title
    FROM borrowings
    JOIN books ON borrowings.book_id = books.id
    WHERE borrowings.member_id = ?
  `;
  return db.prepare(sql).all(memberId);
}

// ✅ ถูก - เฉพาะที่ยังไม่คืน
static getBorrowedBooks(memberId) {
  const sql = `
    SELECT books.title
    FROM borrowings
    JOIN books ON borrowings.book_id = books.id
    WHERE borrowings.member_id = ?
      AND borrowings.return_date IS NULL
  `;
  return db.prepare(sql).all(memberId);
}
```

### Mistake 3: IS NULL vs = NULL

```javascript
// ❌ ผิด - ใช้ = NULL
WHERE return_date = NULL

// ✅ ถูก - ใช้ IS NULL
WHERE return_date IS NULL
```

---

## 🧪 Test Cases

### Test 1: getBorrowedBooks()

```javascript
// Test: สมาชิกที่ยืมหนังสืออยู่
const books = Member.getBorrowedBooks(1);
console.log(`สมชายยืมหนังสือ ${books.length} เล่ม`);

// ควรแสดง:
// - Harry Potter (ถ้ายังไม่คืน)
// ไม่แสดงที่คืนแล้ว
```

### Test 2: add()

```javascript
// Test: เพิ่มสมาชิกใหม่
const newId = Member.add('ทดสอบ', 'test@email.com', '0899999999');

// ตรวจสอบ
const member = Member.getById(newId);
console.log(member);
// {
//   id: 4,
//   name: 'ทดสอบ',
//   email: 'test@email.com',
//   ...
// }

// Test: อีเมลซ้ำ (ควร error)
try {
  Member.add('ทดสอบ2', 'test@email.com', '0888888888');
} catch (error) {
  console.log('✅ ตรวจจับอีเมลซ้ำได้');
}
```

### Test 3: countBorrowedBooks()

```javascript
// Test: นับหนังสือที่ยืม
const count = Member.countBorrowedBooks(1);
console.log(`Count: ${count}`);

// ควรได้ 1 (ถ้า สมชาย ยืม Harry Potter อยู่)
```

---

## 📊 เกณฑ์การให้คะแนน

| Method | คะแนน | เกณฑ์ |
|--------|-------|-------|
| `getBorrowedBooks()` | 40% | JOIN ถูกต้อง, WHERE ครบ |
| `add()` | 35% | INSERT ถูกต้อง, return ID |
| `countBorrowedBooks()` | 25% | ใช้ COUNT(), WHERE ถูกต้อง |

**รายละเอียด getBorrowedBooks():**
- JOIN syntax ถูกต้อง: 15%
- WHERE member_id: 10%
- WHERE return_date IS NULL: 10%
- SELECT columns ครบ: 5%

**Bonus (+10%):**
- มี error handling สำหรับอีเมลซ้ำ
- มี validation (เช่น ตรวจสอบอีเมล format)

---

## 💡 Tips สำหรับอาจารย์

### อธิบาย JOIN ให้นักศึกษาเข้าใจ

**แบบง่ายที่สุด:**
```
borrowings มีแค่ book_id (เลข)
books มี title (ชื่อหนังสือ)

ถ้าไม่ JOIN:
book_id = 1  (ไม่รู้ชื่อหนังสือ)

ถ้า JOIN:
book_id = 1 → Harry Potter (รู้ชื่อหนังสือ!)
```

**วาดภาพให้ดู:**
```
borrowings          JOIN          books
┌──────────┐                    ┌───────────────┐
│ book_id  │─────────────────→│ id            │
│    1     │                    │    1          │
└──────────┘                    │ Harry Potter  │
                                └───────────────┘
```

### คำถามที่ควรถาม

1. "ทำไมต้องใช้ JOIN?"
   - เพราะข้อมูลแยกอยู่ 2 tables
   
2. "IS NULL กับ = NULL ต่างกันอย่างไร?"
   - SQL ใช้ IS NULL เท่านั้น
   
3. "อีเมลซ้ำจะเกิดอะไรขึ้น?"
   - Error จาก UNIQUE constraint

### ให้คะแนน

- **ทำงานได้ถูกต้อง** = เต็ม
- **JOIN ถูกแต่ลืม WHERE return_date** = -15%
- **ใช้ = NULL แทน IS NULL** = -10%
- **ไม่มี error handling** = ไม่ลด (ไม่บังคับ)

---

## 🔗 Related Queries

Queries อื่นๆ ที่เกี่ยวข้อง:

```javascript
// ดูประวัติการยืมทั้งหมด (รวมที่คืนแล้ว)
static getBorrowingHistory(memberId) {
  const sql = `
    SELECT 
      books.title,
      borrowings.borrow_date,
      borrowings.return_date,
      CASE 
        WHEN borrowings.return_date IS NULL THEN 'ยังไม่คืน'
        ELSE 'คืนแล้ว'
      END as status
    FROM borrowings
    JOIN books ON borrowings.book_id = books.id
    WHERE borrowings.member_id = ?
    ORDER BY borrowings.borrow_date DESC
  `;
  return db.prepare(sql).all(memberId);
}

// อัพเดทข้อมูลสมาชิก
static update(id, name, email, phone) {
  const sql = `
    UPDATE members
    SET name = ?, email = ?, phone = ?
    WHERE id = ?
  `;
  db.prepare(sql).run(name, email, phone, id);
}
```

---

**ไฟล์นี้เป็นเฉลยสำหรับอาจารย์เท่านั้น**  
**ห้ามแจกให้นักศึกษาก่อนเวลา**
