# 🎯 เฉลย: Challenge Tasks - Workshop 14 Level 1

## 📌 ภาพรวม

เฉลยสำหรับ 3 Challenge Tasks:
1. **Filter by Status** - กรองตามสถานะ (done/pending)
2. **Search** - ค้นหาใน task
3. **Pagination** - แบ่งหน้า

---

## 🔍 Challenge 1: Filter by Status

### เป้าหมาย
```
GET /api/todos?done=true   → แสดงแค่ที่เสร็จ
GET /api/todos?done=false  → แสดงแค่ที่ยังไม่เสร็จ
GET /api/todos             → แสดงทั้งหมด
```

### แก้ไข Model: `src/models/Todo.js`

```javascript
// src/models/Todo.js

/**
 * ดึง todos ทั้งหมด (พร้อม filter)
 */
getAll(filters = {}) {
  let sql = 'SELECT * FROM todos';
  const params = [];
  
  // Filter by done status
  if (filters.done !== undefined) {
    sql += ' WHERE done = ?';
    params.push(filters.done ? 1 : 0);
  }
  
  sql += ' ORDER BY created_at DESC';
  
  return this.db.prepare(sql).all(...params);
}
```

### แก้ไข Controller: `src/controllers/todoController.js`

```javascript
// src/controllers/todoController.js

/**
 * ดึง todos ทั้งหมด (พร้อม filters)
 * GET /api/todos?done=true
 */
exports.getAll = (req, res) => {
  try {
    const { done } = req.query;
    
    const filters = {};
    
    // Parse done parameter
    if (done !== undefined) {
      // Convert string to boolean
      filters.done = done === 'true' || done === '1';
    }
    
    const todos = Todo.getAll(filters);
    
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
```

### ทดสอบ

**1. ดึงทั้งหมด:**
```
GET http://localhost:3000/api/todos
```

**2. ดึงแค่ที่เสร็จ:**
```
GET http://localhost:3000/api/todos?done=true
```

**3. ดึงแค่ที่ยังไม่เสร็จ:**
```
GET http://localhost:3000/api/todos?done=false
```

---

## 🔎 Challenge 2: Search

### เป้าหมาย
```
GET /api/todos?search=ซื้อ  → ค้นหา task ที่มีคำว่า "ซื้อ"
```

### แก้ไข Model: `src/models/Todo.js`

```javascript
// src/models/Todo.js

/**
 * ดึง todos ทั้งหมด (พร้อม filter และ search)
 */
getAll(filters = {}) {
  let sql = 'SELECT * FROM todos';
  const params = [];
  const conditions = [];
  
  // Filter by done status
  if (filters.done !== undefined) {
    conditions.push('done = ?');
    params.push(filters.done ? 1 : 0);
  }
  
  // Search in task
  if (filters.search) {
    conditions.push('task LIKE ?');
    params.push(`%${filters.search}%`);
  }
  
  // Add WHERE clause if there are conditions
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' ORDER BY created_at DESC';
  
  return this.db.prepare(sql).all(...params);
}
```

### แก้ไข Controller: `src/controllers/todoController.js`

```javascript
// src/controllers/todoController.js

/**
 * ดึง todos ทั้งหมด (พร้อม filters และ search)
 * GET /api/todos?done=true&search=ซื้อ
 */
exports.getAll = (req, res) => {
  try {
    const { done, search } = req.query;
    
    const filters = {};
    
    // Parse done parameter
    if (done !== undefined) {
      filters.done = done === 'true' || done === '1';
    }
    
    // Add search parameter
    if (search && search.trim() !== '') {
      filters.search = search.trim();
    }
    
    const todos = Todo.getAll(filters);
    
    res.json({
      success: true,
      count: todos.length,
      filters: {
        done: filters.done,
        search: filters.search
      },
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
```

### ทดสอบ

**1. ค้นหา "ซื้อ":**
```
GET http://localhost:3000/api/todos?search=ซื้อ
```

**2. ค้นหา + กรองสถานะ:**
```
GET http://localhost:3000/api/todos?search=ทำ&done=false
```

---

## 📄 Challenge 3: Pagination

### เป้าหมาย
```
GET /api/todos?page=1&limit=10  → หน้า 1, 10 รายการ
GET /api/todos?page=2&limit=10  → หน้า 2, 10 รายการ
```

### แนวคิด Pagination

```
┌────────────────────────────────────┐
│         Pagination Logic           │
└────────────────────────────────────┘

Total items: 25
Limit: 10 per page

Page 1: items 1-10   (offset = 0)
Page 2: items 11-20  (offset = 10)
Page 3: items 21-25  (offset = 20)

Formula:
  offset = (page - 1) × limit
```

### แก้ไข Model: `src/models/Todo.js`

```javascript
// src/models/Todo.js

/**
 * ดึง todos ทั้งหมด (พร้อม filter, search, และ pagination)
 */
getAll(filters = {}) {
  let sql = 'SELECT * FROM todos';
  const params = [];
  const conditions = [];
  
  // Filter by done status
  if (filters.done !== undefined) {
    conditions.push('done = ?');
    params.push(filters.done ? 1 : 0);
  }
  
  // Search in task
  if (filters.search) {
    conditions.push('task LIKE ?');
    params.push(`%${filters.search}%`);
  }
  
  // Add WHERE clause
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' ORDER BY created_at DESC';
  
  // Pagination
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(filters.limit);
    
    if (filters.offset !== undefined) {
      sql += ' OFFSET ?';
      params.push(filters.offset);
    }
  }
  
  return this.db.prepare(sql).all(...params);
}

/**
 * นับจำนวนทั้งหมด (สำหรับ pagination)
 */
count(filters = {}) {
  let sql = 'SELECT COUNT(*) as total FROM todos';
  const params = [];
  const conditions = [];
  
  // Filter by done status
  if (filters.done !== undefined) {
    conditions.push('done = ?');
    params.push(filters.done ? 1 : 0);
  }
  
  // Search in task
  if (filters.search) {
    conditions.push('task LIKE ?');
    params.push(`%${filters.search}%`);
  }
  
  // Add WHERE clause
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  const result = this.db.prepare(sql).get(...params);
  return result.total;
}
```

### แก้ไข Controller: `src/controllers/todoController.js`

```javascript
// src/controllers/todoController.js

/**
 * ดึง todos ทั้งหมด (ฟีเจอร์ครบ)
 * GET /api/todos?done=true&search=ซื้อ&page=1&limit=10
 */
exports.getAll = (req, res) => {
  try {
    const { done, search, page, limit } = req.query;
    
    const filters = {};
    
    // Parse done parameter
    if (done !== undefined) {
      filters.done = done === 'true' || done === '1';
    }
    
    // Add search parameter
    if (search && search.trim() !== '') {
      filters.search = search.trim();
    }
    
    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || null;
    
    if (limitNum) {
      filters.limit = limitNum;
      filters.offset = (pageNum - 1) * limitNum;
    }
    
    // Get todos
    const todos = Todo.getAll(filters);
    
    // Get total count (for pagination metadata)
    const total = Todo.count(filters);
    
    // Build response
    const response = {
      success: true,
      count: todos.length,
      total: total,
      data: todos
    };
    
    // Add pagination metadata if paginated
    if (limitNum) {
      const totalPages = Math.ceil(total / limitNum);
      
      response.pagination = {
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      };
    }
    
    // Add filters info
    if (filters.done !== undefined || filters.search) {
      response.filters = {
        done: filters.done,
        search: filters.search
      };
    }
    
    res.json(response);
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
```

### ทดสอบ

**1. หน้าแรก (10 รายการ):**
```
GET http://localhost:3000/api/todos?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "data": [...]
}
```

**2. หน้าที่ 2:**
```
GET http://localhost:3000/api/todos?page=2&limit=10
```

**3. รวมทุกฟีเจอร์:**
```
GET http://localhost:3000/api/todos?done=false&search=ทำ&page=1&limit=5
```

---

## 📊 Code ฉบับสมบูรณ์

### `src/models/Todo.js` (Final Version)

```javascript
// src/models/Todo.js
const dbManager = require('../db');

class Todo {
  constructor() {
    this.db = dbManager.getDb();
  }

  /**
   * ดึง todos ทั้งหมด (พร้อมทุกฟีเจอร์)
   */
  getAll(filters = {}) {
    let sql = 'SELECT * FROM todos';
    const params = [];
    const conditions = [];
    
    // Filter by done status
    if (filters.done !== undefined) {
      conditions.push('done = ?');
      params.push(filters.done ? 1 : 0);
    }
    
    // Search in task
    if (filters.search) {
      conditions.push('task LIKE ?');
      params.push(`%${filters.search}%`);
    }
    
    // Add WHERE clause
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY created_at DESC';
    
    // Pagination
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset !== undefined) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    return this.db.prepare(sql).all(...params);
  }

  /**
   * นับจำนวน todos (สำหรับ pagination)
   */
  count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM todos';
    const params = [];
    const conditions = [];
    
    if (filters.done !== undefined) {
      conditions.push('done = ?');
      params.push(filters.done ? 1 : 0);
    }
    
    if (filters.search) {
      conditions.push('task LIKE ?');
      params.push(`%${filters.search}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = this.db.prepare(sql).get(...params);
    return result.total;
  }

  // ... (methods อื่นๆ เหมือนเดิม)
  
  getById(id) {
    const sql = `SELECT * FROM todos WHERE id = ?`;
    return this.db.prepare(sql).get(id);
  }

  create(task) {
    const sql = `INSERT INTO todos (task) VALUES (?)`;
    const result = this.db.prepare(sql).run(task);
    return this.getById(result.lastInsertRowid);
  }

  updateStatus(id, done) {
    const sql = `UPDATE todos SET done = ? WHERE id = ?`;
    const result = this.db.prepare(sql).run(done, id);
    return result.changes === 0 ? null : this.getById(id);
  }

  delete(id) {
    const sql = `DELETE FROM todos WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    return this.db.prepare(sql).get();
  }
}

module.exports = new Todo();
```

---

## 🧪 Test Cases ครบชุด

### Test Filter
```bash
# ทั้งหมด
curl http://localhost:3000/api/todos

# เฉพาะที่เสร็จ
curl http://localhost:3000/api/todos?done=true

# เฉพาะที่ยังไม่เสร็จ
curl http://localhost:3000/api/todos?done=false
```

### Test Search
```bash
# ค้นหา "ซื้อ"
curl http://localhost:3000/api/todos?search=ซื้อ

# ค้นหา + กรอง
curl "http://localhost:3000/api/todos?search=ทำ&done=false"
```

### Test Pagination
```bash
# หน้า 1
curl "http://localhost:3000/api/todos?page=1&limit=2"

# หน้า 2
curl "http://localhost:3000/api/todos?page=2&limit=2"
```

### Test ทุกอย่างรวมกัน
```bash
curl "http://localhost:3000/api/todos?done=false&search=ทำ&page=1&limit=5"
```

---

## 💡 Tips สำหรับอาจารย์

### การให้คะแนน

| Challenge | คะแนน | เกณฑ์ |
|-----------|-------|-------|
| Filter by Status | 30% | WHERE clause ถูกต้อง, parse parameter |
| Search | 30% | LIKE query, handle empty search |
| Pagination | 40% | LIMIT/OFFSET, metadata, count() |

**Bonus (+10%):**
- รวมทุก challenge ใช้งานร่วมกันได้
- มี error handling
- Response format สวยงาม

### Common Mistakes

**1. SQL Injection:**
```javascript
// ❌ Wrong
sql += ` WHERE task LIKE '%${search}%'`;

// ✅ Correct
sql += ' WHERE task LIKE ?';
params.push(`%${search}%`);
```

**2. Pagination คำนวณผิด:**
```javascript
// ❌ Wrong
offset = page * limit;  // เริ่มจาก page 0

// ✅ Correct
offset = (page - 1) * limit;  // เริ่มจาก page 1
```

**3. ลืม count() สำหรับ pagination:**
```javascript
// ❌ Wrong - ไม่รู้ว่ามีกี่หน้า
return { data: todos };

// ✅ Correct
const total = Todo.count(filters);
return { data: todos, total, pagination: {...} };
```

---

## 🎓 สรุป

### ฟีเจอร์ที่เพิ่ม:
- ✅ Filter by status (done/pending)
- ✅ Search in task (LIKE query)
- ✅ Pagination (page, limit, offset)
- ✅ Metadata (total, totalPages, hasNext/Prev)

### Skills ที่ได้:
- ✅ Dynamic SQL building
- ✅ Query parameters handling
- ✅ Pagination logic
- ✅ API design best practices

---

**เฉลยครบถ้วน พร้อมใช้สอน! 🎉**
