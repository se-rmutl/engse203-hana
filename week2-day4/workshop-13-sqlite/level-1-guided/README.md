# 🎓 Workshop 13 - Level 1: Todo App Database

## 📌 ภาพรวม

Workshop นี้จะสอนการสร้าง **Todo App Database** แบบง่ายที่สุด:
- ✅ เก็บรายการงานที่ต้องทำ
- ✅ ทำเครื่องหมายว่าเสร็จหรือยัง
- ✅ แก้ไขและลบงาน
- ✅ ดูงานทั้งหมดหรือเฉพาะที่ยังไม่เสร็จ

**Table เดียว** - ไม่ซับซ้อน - เข้าใจง่าย

---

## 🎯 สิ่งที่จะได้เรียนรู้

✅ สร้าง database และ table  
✅ เพิ่ม, ดึง, แก้ไข, ลบข้อมูล (CRUD)  
✅ เชื่อมต่อ SQLite กับ Node.js  
✅ ใช้ better-sqlite3 package  

---

## 📁 โครงสร้างโปรเจค (ง่ายมาก)

```
level-1-guided/
├── package.json
├── database.db         (จะถูกสร้างอัตโนมัติ)
├── 1-create-table.js   (สร้าง table)
├── 2-insert-data.js    (เพิ่มข้อมูล)
├── 3-select-data.js    (ดึงข้อมูล)
├── 4-update-data.js    (แก้ไขข้อมูล)
├── 5-delete-data.js    (ลบข้อมูล)
└── 6-todo-app.js       (app เต็มรูปแบบ)
```

---

## 🚀 Step 1: Setup โปรเจค

### 1.1 สร้างโฟลเดอร์

```bash
mkdir todo-app-db
cd todo-app-db
```

### 1.2 Initialize npm

```bash
npm init -y
```

### 1.3 ติดตั้ง better-sqlite3

```bash
npm install better-sqlite3
```

### 1.4 สร้าง .gitignore

```bash
echo "node_modules/
*.db
*.db-shm
*.db-wal" > .gitignore
```

**💾 Commit:**
```bash
git init
git add .
git commit -m "Initial setup"
```

---

## 📊 Step 2: สร้าง Table

สร้างไฟล์ `1-create-table.js`:

```javascript
// 1-create-table.js
const Database = require('better-sqlite3');

// เชื่อมต่อ database (ถ้าไม่มีจะสร้างใหม่)
const db = new Database('database.db');

console.log('📁 Creating todos table...');

// สร้าง table
const createTable = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createTable);

console.log('✅ Table created successfully!');
console.log('');

// ดู structure ของ table
const tableInfo = db.pragma('table_info(todos)');
console.log('📋 Table structure:');
console.table(tableInfo);

// ปิดการเชื่อมต่อ
db.close();
```

**อธิบาย:**
- `id` - รหัสอัตโนมัติ (1, 2, 3, ...)
- `task` - งานที่ต้องทำ (ต้องมีค่า)
- `done` - เสร็จหรือยัง (0 = ยังไม่เสร็จ, 1 = เสร็จแล้ว)
- `created_at` - วันเวลาที่สร้าง

**รัน:**
```bash
node 1-create-table.js
```

**ผลลัพธ์:**
```
📁 Creating todos table...
✅ Table created successfully!

📋 Table structure:
┌─────────┬──────────────┬──────────┬─────────┬────────────────────────┬────┐
│ (index) │     name     │   type   │ notnull │         dflt_value     │ pk │
├─────────┼──────────────┼──────────┼─────────┼────────────────────────┼────┤
│    0    │     'id'     │ 'INTEGER'│    0    │          null          │ 1  │
│    1    │    'task'    │  'TEXT'  │    1    │          null          │ 0  │
│    2    │    'done'    │ 'INTEGER'│    0    │           0            │ 0  │
│    3    │ 'created_at' │  'TEXT'  │    0    │ 'CURRENT_TIMESTAMP'    │ 0  │
└─────────┴──────────────┴──────────┴─────────┴────────────────────────┴────┘
```

**💾 Commit:**
```bash
git add .
git commit -m "Add create table script"
```

---

## ➕ Step 3: เพิ่มข้อมูล (INSERT)

สร้างไฟล์ `2-insert-data.js`:

```javascript
// 2-insert-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('➕ Inserting todos...');
console.log('');

// เพิ่มข้อมูลทีละรายการ
const insert = db.prepare('INSERT INTO todos (task) VALUES (?)');

// เพิ่มงาน 5 รายการ
insert.run('ซื้อของที่ตลาด');
insert.run('ทำการบ้านคณิตศาสตร์');
insert.run('ออกกำลังกาย');
insert.run('อ่านหนังสือ');
insert.run('ทำความสะอาดห้อง');

console.log('✅ Added 5 todos');
console.log('');

// ดูข้อมูลทั้งหมด
const todos = db.prepare('SELECT * FROM todos').all();
console.log('📋 All todos:');
console.table(todos);

db.close();
```

**รัน:**
```bash
node 2-insert-data.js
```

**ผลลัพธ์:**
```
➕ Inserting todos...

✅ Added 5 todos

📋 All todos:
┌─────────┬────┬─────────────────────────────┬──────┬────────────────────────┐
│ (index) │ id │            task             │ done │      created_at        │
├─────────┼────┼─────────────────────────────┼──────┼────────────────────────┤
│    0    │ 1  │    'ซื้อของที่ตลาด'             │  0   │ '2024-01-31 10:30:00'  │
│    1    │ 2  │ 'ทำการบ้านคณิตศาสตร์'          │  0   │ '2024-01-31 10:30:00'  │
│    2    │ 3  │     'ออกกำลังกาย'            │  0   │ '2024-01-31 10:30:00'  │
│    3    │ 4  │      'อ่านหนังสือ'             │  0   │ '2024-01-31 10:30:00'  │
│    4    │ 5  │   'ทำความสะอาดห้อง'          │  0   │ '2024-01-31 10:30:00'  │
└─────────┴────┴─────────────────────────────┴──────┴────────────────────────┘
```

**💾 Commit:**
```bash
git add .
git commit -m "Add insert data script"
```

---

## 🔍 Step 4: ดึงข้อมูล (SELECT)

สร้างไฟล์ `3-select-data.js`:

```javascript
// 3-select-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('🔍 Selecting todos...');
console.log('');

// 1. ดึงทั้งหมด
console.log('1️⃣ All todos:');
const allTodos = db.prepare('SELECT * FROM todos').all();
console.table(allTodos);
console.log('');

// 2. ดึงเฉพาะที่ยังไม่เสร็จ (done = 0)
console.log('2️⃣ Pending todos (done = 0):');
const pendingTodos = db.prepare('SELECT * FROM todos WHERE done = 0').all();
console.table(pendingTodos);
console.log('');

// 3. ดึงตาม id
console.log('3️⃣ Todo with id = 1:');
const oneTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(1);
console.log(oneTodo);
console.log('');

// 4. นับจำนวน
console.log('4️⃣ Count todos:');
const count = db.prepare('SELECT COUNT(*) as total FROM todos').get();
console.log(`Total todos: ${count.total}`);
console.log('');

// 5. ดึงเฉพาะ columns ที่ต้องการ
console.log('5️⃣ Only task and done:');
const taskOnly = db.prepare('SELECT id, task, done FROM todos').all();
console.table(taskOnly);

db.close();
```

**รัน:**
```bash
node 3-select-data.js
```

**💾 Commit:**
```bash
git add .
git commit -m "Add select data script"
```

---

## ✏️ Step 5: แก้ไขข้อมูล (UPDATE)

สร้างไฟล์ `4-update-data.js`:

```javascript
// 4-update-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('✏️ Updating todos...');
console.log('');

// ก่อนแก้ไข
console.log('Before update:');
const before = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log(before);
console.log('');

// ทำเครื่องหมายว่าเสร็จแล้ว (done = 1)
const updateDone = db.prepare('UPDATE todos SET done = 1 WHERE id = ?');
updateDone.run(1);

console.log('✅ Marked todo #1 as done');
console.log('');

// หลังแก้ไข
console.log('After update:');
const after = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log(after);
console.log('');

// แก้ไขข้อความ
const updateTask = db.prepare('UPDATE todos SET task = ? WHERE id = ?');
updateTask.run('ซื้อของที่ตลาดและร้านขายยา', 1);

console.log('✅ Updated task text');
console.log('');

// ดูผลลัพธ์
console.log('Final result:');
const final = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log(final);

db.close();
```

**รัน:**
```bash
node 4-update-data.js
```

**ผลลัพธ์:**
```
✏️ Updating todos...

Before update:
{ id: 1, task: 'ซื้อของที่ตลาด', done: 0, created_at: '2024-01-31 10:30:00' }

✅ Marked todo #1 as done

After update:
{ id: 1, task: 'ซื้อของที่ตลาด', done: 1, created_at: '2024-01-31 10:30:00' }

✅ Updated task text

Final result:
{ id: 1, task: 'ซื้อของที่ตลาดและร้านขายยา', done: 1, created_at: '2024-01-31 10:30:00' }
```

**💾 Commit:**
```bash
git add .
git commit -m "Add update data script"
```

---

## 🗑️ Step 6: ลบข้อมูล (DELETE)

สร้างไฟล์ `5-delete-data.js`:

```javascript
// 5-delete-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('🗑️ Deleting todos...');
console.log('');

// ก่อนลบ
console.log('Before delete:');
const before = db.prepare('SELECT COUNT(*) as total FROM todos').get();
console.log(`Total todos: ${before.total}`);
console.log('');

// ลบ todo ที่ id = 5
const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ?');
const result = deleteTodo.run(5);

console.log(`✅ Deleted ${result.changes} todo`);
console.log('');

// หลังลบ
console.log('After delete:');
const after = db.prepare('SELECT COUNT(*) as total FROM todos').get();
console.log(`Total todos: ${after.total}`);
console.log('');

// ดูข้อมูลที่เหลือ
console.log('Remaining todos:');
const remaining = db.prepare('SELECT * FROM todos').all();
console.table(remaining);

db.close();
```

**รัน:**
```bash
node 5-delete-data.js
```

**💾 Commit:**
```bash
git add .
git commit -m "Add delete data script"
```

---

## 🎮 Step 7: Todo App เต็มรูปแบบ

สร้างไฟล์ `6-todo-app.js`:

```javascript
// 6-todo-app.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

// ==========================================
// Todo App Functions
// ==========================================

class TodoApp {
  // เพิ่ม todo ใหม่
  addTodo(task) {
    const insert = db.prepare('INSERT INTO todos (task) VALUES (?)');
    const result = insert.run(task);
    console.log(`✅ Added: "${task}" (ID: ${result.lastInsertRowid})`);
  }

  // แสดง todos ทั้งหมด
  showAll() {
    const todos = db.prepare('SELECT * FROM todos').all();
    console.log('\n📋 All Todos:');
    console.table(todos);
  }

  // แสดง todos ที่ยังไม่เสร็จ
  showPending() {
    const todos = db.prepare('SELECT * FROM todos WHERE done = 0').all();
    console.log('\n⏳ Pending Todos:');
    console.table(todos);
  }

  // แสดง todos ที่เสร็จแล้ว
  showCompleted() {
    const todos = db.prepare('SELECT * FROM todos WHERE done = 1').all();
    console.log('\n✅ Completed Todos:');
    console.table(todos);
  }

  // ทำเครื่องหมายว่าเสร็จ
  markAsDone(id) {
    const update = db.prepare('UPDATE todos SET done = 1 WHERE id = ?');
    const result = update.run(id);
    if (result.changes > 0) {
      console.log(`✅ Marked todo #${id} as done`);
    } else {
      console.log(`❌ Todo #${id} not found`);
    }
  }

  // ลบ todo
  deleteTodo(id) {
    const del = db.prepare('DELETE FROM todos WHERE id = ?');
    const result = del.run(id);
    if (result.changes > 0) {
      console.log(`🗑️ Deleted todo #${id}`);
    } else {
      console.log(`❌ Todo #${id} not found`);
    }
  }

  // แสดงสถิติ
  showStats() {
    const total = db.prepare('SELECT COUNT(*) as count FROM todos').get();
    const completed = db.prepare('SELECT COUNT(*) as count FROM todos WHERE done = 1').get();
    const pending = db.prepare('SELECT COUNT(*) as count FROM todos WHERE done = 0').get();

    console.log('\n📊 Statistics:');
    console.log(`  Total: ${total.count}`);
    console.log(`  ✅ Completed: ${completed.count}`);
    console.log(`  ⏳ Pending: ${pending.count}`);
  }
}

// ==========================================
// ทดสอบใช้งาน
// ==========================================

const app = new TodoApp();

console.log('🎮 Todo App Demo');
console.log('='.repeat(50));

// แสดงทั้งหมด
app.showAll();

// แสดงสถิติ
app.showStats();

// แสดงที่ยังไม่เสร็จ
app.showPending();

// ทำเครื่องหมายบางรายการว่าเสร็จ
app.markAsDone(2);
app.markAsDone(3);

// แสดงที่เสร็จแล้ว
app.showCompleted();

// แสดงสถิติใหม่
app.showStats();

// ปิดการเชื่อมต่อ
db.close();
```

**รัน:**
```bash
node 6-todo-app.js
```

**💾 Commit:**
```bash
git add .
git commit -m "Add complete todo app"
```

---

## 🎯 Challenge Tasks

ลองเพิ่มฟีเจอร์เหล่านี้เอง:

### Challenge 1: ค้นหา todo
```javascript
searchTodos(keyword) {
  // TODO: ค้นหา todos ที่มี keyword ใน task
  // Hint: ใช้ LIKE '%keyword%'
}
```

### Challenge 2: แก้ไข task
```javascript
updateTask(id, newTask) {
  // TODO: แก้ไขข้อความของ todo
}
```

### Challenge 3: ลบที่เสร็จหมด
```javascript
clearCompleted() {
  // TODO: ลบ todos ที่ done = 1 ทั้งหมด
}
```

### Challenge 4: เรียงลำดับ
```javascript
showByDate() {
  // TODO: แสดง todos เรียงตามวันที่สร้าง (ใหม่สุดก่อน)
  // Hint: ORDER BY created_at DESC
}
```

---

## 📝 บันทึกผลการทดลอง

สร้างไฟล์ `EXPERIMENT_RESULTS.md`:

```markdown
# 📊 บันทึกผลการทดลอง - Workshop 13 Level 1

## ผู้ทดลอง
- ชื่อ: [ระบุชื่อ]
- วันที่: [ระบุวันที่]

## ส่วนที่ 1: สร้าง Table
**คำสั่งที่ใช้:**
```bash
node 1-create-table.js
```

**ผลลัพธ์:**
- [✅/❌] สร้าง table สำเร็จ
- [บันทึกสิ่งที่สังเกต]

## ส่วนที่ 2: เพิ่มข้อมูล
**ทดลองเพิ่ม:**
- [จำนวน todos ที่เพิ่ม]

**ผลลัพธ์:**
- [บันทึกผล]

## ส่วนที่ 3: Query ข้อมูล
**SQL ที่ทดสอบ:**
```sql
[ใส่ SQL query ที่ลอง]
```

**ผลลัพธ์:**
- [บันทึกผล]

## Challenge ที่ทำเพิ่ม
- [ ] Challenge 1: ค้นหา
- [ ] Challenge 2: แก้ไข
- [ ] Challenge 3: ลบทั้งหมด
- [ ] Challenge 4: เรียงลำดับ

## สรุปสิ่งที่ได้เรียนรู้
1. [สิ่งที่เรียนรู้]
2. [ปัญหาที่พบและแก้ไข]
3. [คำถามที่ยังสงสัย]
```

---

## 🎓 สิ่งที่ได้เรียนรู้

✅ Database และ Table คืออะไร  
✅ สร้าง table ด้วย CREATE TABLE  
✅ เพิ่มข้อมูลด้วย INSERT  
✅ ดึงข้อมูลด้วย SELECT  
✅ แก้ไขด้วย UPDATE  
✅ ลบด้วย DELETE  
✅ เชื่อมต่อ SQLite กับ Node.js  
✅ ใช้ better-sqlite3  

---

## 📚 Next Steps

เมื่อทำ Level 1 เสร็จและเข้าใจแล้ว:
👉 [Level 2: Library System](../level-2-challenge/README.md) (ค่อนข้างง่าย)

---

**💡 Tips:**
- ลองเปิด `database.db` ด้วย DB Browser
- ทดลองเขียน SQL queries เอง
- ลบ database.db แล้วรันใหม่ทั้งหมด
- อ่าน error messages ให้เข้าใจ

**เก่งมาก! คุณเข้าใจ database พื้นฐานแล้ว! 🎉**
