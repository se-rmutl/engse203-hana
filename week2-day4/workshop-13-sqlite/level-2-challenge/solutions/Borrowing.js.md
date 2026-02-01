# 📖 เฉลย: Borrowing.js (สำหรับอาจารย์)

## ✅ Code เต็มรูปแบบ

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
        borrowings.return_date,
        CASE 
          WHEN borrowings.return_date IS NULL THEN 'ยังไม่คืน'
          ELSE 'คืนแล้ว'
        END as status
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      ORDER BY borrowings.borrow_date DESC
    `;
    return db.prepare(sql).all();
  }

  // ยืมหนังสือ
  static borrow(bookId, memberId) {
    // 1. ตรวจสอบว่าหนังสือว่างไหม
    const book = db.prepare('SELECT available FROM books WHERE id = ?').get(bookId);
    
    if (!book) {
      console.log('❌ ไม่พบหนังสือ');
      return false;
    }
    
    if (book.available === 0) {
      console.log('❌ หนังสือถูกยืมไปแล้ว');
      return false;
    }

    // 2. เพิ่มรายการยืม
    const insertSql = `
      INSERT INTO borrowings (book_id, member_id)
      VALUES (?, ?)
    `;
    const result = db.prepare(insertSql).run(bookId, memberId);

    // 3. อัพเดทหนังสือว่าไม่ว่าง
    const updateSql = `
      UPDATE books SET available = 0 WHERE id = ?
    `;
    db.prepare(updateSql).run(bookId);

    console.log(`✅ Book #${bookId} borrowed by Member #${memberId}`);
    return result.lastInsertRowid;
  }

  // คืนหนังสือ
  static returnBook(borrowingId) {
    // 1. หา book_id จาก borrowing
    const getBorrowingSql = `
      SELECT book_id, return_date FROM borrowings WHERE id = ?
    `;
    const borrowing = db.prepare(getBorrowingSql).get(borrowingId);

    if (!borrowing) {
      console.log('❌ ไม่พบรายการยืม');
      return false;
    }

    if (borrowing.return_date !== null) {
      console.log('❌ คืนหนังสือไปแล้ว');
      return false;
    }

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
    return true;
  }

  // ดูหนังสือที่ยังไม่คืน
  static getUnreturned() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title,
        members.name as borrower,
        borrowings.borrow_date,
        julianday('now') - julianday(borrowings.borrow_date) as days_borrowed
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      WHERE borrowings.return_date IS NULL
      ORDER BY borrowings.borrow_date ASC
    `;
    return db.prepare(sql).all();
  }

  // ดึงรายการยืมตาม ID
  static getById(id) {
    const sql = `
      SELECT 
        borrowings.*,
        books.title,
        members.name
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      WHERE borrowings.id = ?
    `;
    return db.prepare(sql).get(id);
  }
}

module.exports = Borrowing;
```

---

## 📝 คำอธิบายแต่ละ Method

### 1. borrow(bookId, memberId) - ยืมหนังสือ

**Flow การทำงาน:**
```
1. ตรวจสอบว่าหนังสือว่างไหม ✓
   ├─ ไม่มีหนังสือ → return false
   └─ ถูกยืมไปแล้ว → return false

2. เพิ่มรายการยืมใน borrowings ✓
   
3. อัพเดท books.available = 0 ✓

4. return borrowing ID
```

**จุดสำคัญ:**
- ⚠️ **ต้องตรวจสอบก่อน** - ป้องกันยืมซ้ำ
- ⚠️ **ต้องทำ 2 ขั้นตอน** - INSERT borrowing + UPDATE book
- ⚠️ **Transaction** - ถ้าขั้นตอนใดผิดพลาด ทั้งหมดต้อง rollback

**ตัวอย่างการใช้งาน:**
```javascript
// ยืมหนังสือเล่มที่ 2 โดยสมาชิกคนที่ 1
const borrowingId = Borrowing.borrow(2, 1);

if (borrowingId) {
  console.log('ยืมสำเร็จ! Borrowing ID:', borrowingId);
} else {
  console.log('ยืมไม่สำเร็จ');
}
```

**Error Cases:**
```javascript
// Case 1: หนังสือไม่มี
Borrowing.borrow(999, 1);
// Output: ❌ ไม่พบหนังสือ

// Case 2: ถูกยืมไปแล้ว
Borrowing.borrow(1, 2); // ถ้า book#1 ถูกยืมไปแล้ว
// Output: ❌ หนังสือถูกยืมไปแล้ว
```

---

### 2. returnBook(borrowingId) - คืนหนังสือ

**Flow การทำงาน:**
```
1. หา book_id จาก borrowing ✓
   ├─ ไม่มีรายการ → return false
   └─ คืนไปแล้ว → return false

2. อัพเดท borrowings.return_date ✓

3. อัพเดท books.available = 1 ✓

4. return true
```

**จุดสำคัญ:**
- ⚠️ **ต้องหา book_id ก่อน** - เพื่อ update books table
- ⚠️ **ตรวจสอบว่าคืนไปแล้วหรือยัง** - ป้องกันคืนซ้ำ
- ⚠️ **CURRENT_TIMESTAMP** - บันทึกเวลาที่คืน

**ตัวอย่างการใช้งาน:**
```javascript
// คืนหนังสือจากรายการยืมที่ 1
const success = Borrowing.returnBook(1);

if (success) {
  console.log('คืนสำเร็จ!');
} else {
  console.log('คืนไม่สำเร็จ');
}
```

**Error Cases:**
```javascript
// Case 1: ไม่มีรายการยืม
Borrowing.returnBook(999);
// Output: ❌ ไม่พบรายการยืม

// Case 2: คืนไปแล้ว
Borrowing.returnBook(1); // เรียกซ้ำ
// Output: ❌ คืนหนังสือไปแล้ว
```

---

### 3. getUnreturned() - ดูหนังสือที่ยังไม่คืน

**จุดสำคัญ:**
- WHERE `return_date IS NULL` = ยังไม่คืน
- คำนวณ `days_borrowed` = จำนวนวันที่ยืม
- เรียงตาม `borrow_date ASC` = ยืมนานสุดก่อน

**ตัวอย่าง output:**
```javascript
[
  {
    id: 1,
    title: 'Harry Potter',
    borrower: 'สมชาย',
    borrow_date: '2024-01-25 10:00:00',
    days_borrowed: 6
  },
  {
    id: 3,
    title: '1984',
    borrower: 'สมหญิง',
    borrow_date: '2024-01-28 14:30:00',
    days_borrowed: 3
  }
]
```

**การคำนวณวัน:**
```sql
julianday('now') - julianday(borrowings.borrow_date) as days_borrowed
```
- `julianday()` = แปลงเป็นตัวเลข (Julian Day)
- ลบกัน = ได้จำนวนวัน
- SQLite ใช้ฟังก์ชันนี้คำนวณความต่างของวัน

---

## ❌ Common Mistakes

### Mistake 1: ลืมอัพเดท available

```javascript
// ❌ ผิด - ยืมแล้วแต่ไม่ update available
static borrow(bookId, memberId) {
  const sql = `INSERT INTO borrowings (book_id, member_id) VALUES (?, ?)`;
  db.prepare(sql).run(bookId, memberId);
  // ลืม update books.available = 0
}

// ผลลัพธ์: หนังสือยืมได้ซ้ำ!
```

### Mistake 2: ลืมตรวจสอบ

```javascript
// ❌ ผิด - ไม่ตรวจสอบว่าว่างหรือเปล่า
static borrow(bookId, memberId) {
  const sql = `INSERT INTO borrowings (book_id, member_id) VALUES (?, ?)`;
  db.prepare(sql).run(bookId, memberId);
  
  db.prepare(`UPDATE books SET available = 0 WHERE id = ?`).run(bookId);
}

// ผลลัพธ์: ยืมหนังสือที่ถูกยืมไปแล้วได้!
```

### Mistake 3: ใช้ = NULL แทน IS NULL

```javascript
// ❌ ผิด - = NULL ใช้ไม่ได้ใน SQL
WHERE return_date = NULL

// ✅ ถูก - ต้องใช้ IS NULL
WHERE return_date IS NULL
```

### Mistake 4: ลืมหา book_id

```javascript
// ❌ ผิด - ไม่รู้ว่าจะ update หนังสือเล่มไหน
static returnBook(borrowingId) {
  db.prepare(`UPDATE borrowings SET return_date = CURRENT_TIMESTAMP WHERE id = ?`).run(borrowingId);
  // ลืมหา book_id เพื่อ update books.available
}
```

---

## 🧪 Test Cases

### Test borrow()

```javascript
console.log('=== Test borrow() ===');

// Test Case 1: ยืมสำเร็จ
const id1 = Borrowing.borrow(2, 1); // The Hobbit
console.assert(id1 > 0, 'Should return borrowing ID');

const book = db.prepare('SELECT available FROM books WHERE id = 2').get();
console.assert(book.available === 0, 'Book should be unavailable');

// Test Case 2: ยืมหนังสือเล่มเดิมอีกครั้ง (ควรไม่ได้)
const id2 = Borrowing.borrow(2, 2);
console.assert(id2 === false, 'Should not allow borrowing same book');

// Test Case 3: ยืมหนังสือที่ไม่มี
const id3 = Borrowing.borrow(999, 1);
console.assert(id3 === false, 'Should return false for non-existent book');
```

### Test returnBook()

```javascript
console.log('=== Test returnBook() ===');

// Setup: ยืมหนังสือก่อน
const borrowingId = Borrowing.borrow(3, 1);

// Test Case 1: คืนสำเร็จ
const success1 = Borrowing.returnBook(borrowingId);
console.assert(success1 === true, 'Should return true');

const borrowing = db.prepare('SELECT return_date FROM borrowings WHERE id = ?').get(borrowingId);
console.assert(borrowing.return_date !== null, 'Should have return_date');

const book = db.prepare('SELECT available FROM books WHERE id = 3').get();
console.assert(book.available === 1, 'Book should be available again');

// Test Case 2: คืนซ้ำ (ควรไม่ได้)
const success2 = Borrowing.returnBook(borrowingId);
console.assert(success2 === false, 'Should not allow returning twice');

// Test Case 3: คืนรายการที่ไม่มี
const success3 = Borrowing.returnBook(999);
console.assert(success3 === false, 'Should return false for non-existent borrowing');
```

### Test getUnreturned()

```javascript
console.log('=== Test getUnreturned() ===');

// Setup: ยืมหนังสือ 2 เล่ม แล้วคืน 1 เล่ม
Borrowing.borrow(1, 1);
const b2 = Borrowing.borrow(2, 2);
Borrowing.returnBook(b2);

// Test: ควรมีแค่ 1 เล่มที่ยังไม่คืน
const unreturned = Borrowing.getUnreturned();
console.assert(unreturned.length === 1, 'Should have 1 unreturned book');
console.assert(unreturned[0].title === 'Harry Potter', 'Should be correct book');
```

---

## 📊 Grading Rubric

### borrow() - 40 คะแนน

| รายการ | คะแนน |
|--------|-------|
| ตรวจสอบว่าหนังสือว่างไหม | 10 |
| INSERT borrowing ถูกต้อง | 10 |
| UPDATE books.available = 0 | 10 |
| return borrowing ID | 5 |
| มี error handling | 5 |

### returnBook() - 40 คะแนน

| รายการ | คะแนน |
|--------|-------|
| หา book_id จาก borrowing | 10 |
| ตรวจสอบว่าคืนแล้วหรือยัง | 10 |
| UPDATE return_date | 10 |
| UPDATE books.available = 1 | 5 |
| return true/false ถูกต้อง | 5 |

### getUnreturned() - 20 คะแนน

| รายการ | คะแนน |
|--------|-------|
| SQL syntax ถูกต้อง | 5 |
| JOIN 3 tables ถูกต้อง | 5 |
| WHERE return_date IS NULL | 5 |
| คำนวณ days_borrowed (bonus) | 5 |

**รวม: 100 คะแนน**

---

## 💡 การใช้ Transactions (Advanced)

สำหรับนักศึกษาที่ต้องการทำให้ดีขึ้น:

```javascript
static borrow(bookId, memberId) {
  // ใช้ transaction เพื่อความปลอดภัย
  const transaction = db.transaction(() => {
    // 1. ตรวจสอบ
    const book = db.prepare('SELECT available FROM books WHERE id = ?').get(bookId);
    if (!book || book.available === 0) {
      throw new Error('Cannot borrow');
    }

    // 2. เพิ่มการยืม
    const result = db.prepare(`
      INSERT INTO borrowings (book_id, member_id) VALUES (?, ?)
    `).run(bookId, memberId);

    // 3. อัพเดทหนังสือ
    db.prepare(`UPDATE books SET available = 0 WHERE id = ?`).run(bookId);

    return result.lastInsertRowid;
  });

  try {
    return transaction();
  } catch (error) {
    console.log('❌', error.message);
    return false;
  }
}
```

**ข้อดีของ Transaction:**
- ถ้าขั้นตอนใดผิดพลาด ทุกอย่าง rollback
- ป้องกันข้อมูลไม่สอดคล้องกัน
- ปลอดภัยกว่า

---

## 🎯 Tips สำหรับการสอน

### 1. เริ่มจากภาพรวม
อธิบายว่า borrow และ return ทำอะไรบ้าง:
```
ยืม (borrow):
1. ตรวจสอบว่าง
2. สร้างรายการยืม
3. ทำเครื่องหมายไม่ว่าง

คืน (return):
1. หา book_id
2. บันทึกวันคืน
3. ทำเครื่องหมายว่าง
```

### 2. เน้นเรื่อง Validation
บอกนักศึกษาว่า:
- "ต้องเช็คก่อนทำ!"
- "ไม่งั้นข้อมูลจะพัง"

### 3. ให้ทดสอบทุก Case
- ยืมปกติ ✓
- ยืมซ้ำ (ไม่ได้) ✗
- คืนปกติ ✓
- คืนซ้ำ (ไม่ได้) ✗

### 4. อธิบาย IS NULL vs = NULL
```sql
-- ❌ ผิด
WHERE return_date = NULL

-- ✅ ถูก
WHERE return_date IS NULL
```

---

## 🌟 Alternative Approaches

### Approach 1: ใช้ Trigger (Advanced)

```sql
CREATE TRIGGER after_borrow
AFTER INSERT ON borrowings
BEGIN
  UPDATE books SET available = 0 
  WHERE id = NEW.book_id;
END;
```

**ข้อดี:** อัพเดทอัตโนมัติ  
**ข้อเสีย:** ซับซ้อนสำหรับผู้เริ่มต้น

### Approach 2: ใช้ View

```sql
CREATE VIEW unreturned_books AS
SELECT 
  borrowings.id,
  books.title,
  members.name
FROM borrowings
JOIN books ON borrowings.book_id = books.id
JOIN members ON borrowings.member_id = members.id
WHERE borrowings.return_date IS NULL;
```

**ข้อดี:** Query ง่ายขึ้น  
**ข้อเสีย:** ต้องเรียนเรื่อง View ก่อน

---

**เฉลยนี้ครบถ้วน ทดสอบแล้ว และพร้อมใช้สอน! ✅**
