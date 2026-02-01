# 🎯 เฉลย: Challenge Tasks - Workshop 15 Level 1

## ภาพรวม

เฉลยสำหรับ 3 Challenge Tasks:
1. **Search** - ค้นหาใน task
2. **Pagination** - แบ่งหน้า
3. **Due Date Filter** - กรองตามวันครบกำหนด

---

## 🔍 Challenge 1: Search

### โจทย์
```javascript
// GET /api/todos?search=เรียน
```

### ✅ เฉลย

**อัพเดท `src/controllers/todoController.js`:**

```javascript
// src/controllers/todoController.js

exports.getAll = async (req, res) => {
  try {
    const { done, priority, search, sort } = req.query;
    
    // Build filter
    const filter = {};
    
    if (done !== undefined) {
      filter.done = done === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    // ✅ Search in task (case-insensitive)
    if (search) {
      filter.task = { 
        $regex: search, 
        $options: 'i'  // i = case insensitive
      };
    }

    // Build sort
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1 };
    }

    const todos = await Todo.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: todos.length,
      filters: { done, priority, search },
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

### 🧪 ทดสอบ

```bash
# ค้นหา "เรียน"
GET http://localhost:3000/api/todos?search=เรียน

# ค้นหา "mongodb" (case insensitive)
GET http://localhost:3000/api/todos?search=mongodb

# รวม filter + search
GET http://localhost:3000/api/todos?done=false&search=เรียน
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "count": 2,
  "filters": {
    "done": "false",
    "priority": null,
    "search": "เรียน"
  },
  "data": [
    {
      "_id": "65b9...",
      "task": "เรียน MongoDB",
      "done": false
    },
    {
      "_id": "65ba...",
      "task": "เรียน Mongoose",
      "done": false
    }
  ]
}
```

---

## 📄 Challenge 2: Pagination

### โจทย์
```javascript
// GET /api/todos?page=1&limit=10
// GET /api/todos?page=2&limit=5
```

### ✅ เฉลย

**อัพเดท `src/controllers/todoController.js`:**

```javascript
// src/controllers/todoController.js

exports.getAll = async (req, res) => {
  try {
    const { done, priority, search, sort, page, limit } = req.query;
    
    // Build filter
    const filter = {};
    
    if (done !== undefined) {
      filter.done = done === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (search) {
      filter.task = { 
        $regex: search, 
        $options: 'i'
      };
    }

    // Build sort
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1 };
    } else {
      sortOption = { createdAt: -1 }; // default
    }

    // ✅ Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    // Validation
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: { message: 'Page must be greater than 0' }
      });
    }
    
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Limit must be between 1 and 100' }
      });
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const todos = await Todo.find(filter)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination metadata
    const total = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: { done, priority, search },
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

### 🧪 ทดสอบ

```bash
# หน้าแรก (10 รายการ)
GET http://localhost:3000/api/todos?page=1&limit=10

# หน้าที่ 2 (5 รายการ)
GET http://localhost:3000/api/todos?page=2&limit=5

# รวมทุกอย่าง
GET http://localhost:3000/api/todos?done=false&search=เรียน&page=1&limit=5&sort=newest
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "done": null,
    "priority": null,
    "search": null
  },
  "data": [...]
}
```

---

## 📅 Challenge 3: Due Date Filter

### โจทย์
```javascript
// GET /api/todos?overdue=true
// GET /api/todos?upcoming=7  (7 วันข้างหน้า)
```

### ✅ เฉลย

**อัพเดท `src/controllers/todoController.js`:**

```javascript
// src/controllers/todoController.js

exports.getAll = async (req, res) => {
  try {
    const { 
      done, 
      priority, 
      search, 
      sort, 
      page, 
      limit,
      overdue,    // ✅ New
      upcoming    // ✅ New
    } = req.query;
    
    // Build filter
    const filter = {};
    
    if (done !== undefined) {
      filter.done = done === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (search) {
      filter.task = { 
        $regex: search, 
        $options: 'i'
      };
    }

    // ✅ Overdue filter (เกินกำหนดและยังไม่เสร็จ)
    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.done = false;
    }

    // ✅ Upcoming filter (n วันข้างหน้า)
    if (upcoming) {
      const days = parseInt(upcoming);
      if (days > 0) {
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        
        filter.dueDate = { 
          $gte: now,
          $lte: future 
        };
        filter.done = false;
      }
    }

    // Build sort
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1 };
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1 };  // เร็วสุดก่อน
    } else {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: { message: 'Page must be greater than 0' }
      });
    }
    
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Limit must be between 1 and 100' }
      });
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const todos = await Todo.find(filter)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip);

    const total = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: { done, priority, search, overdue, upcoming },
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

### 🧪 ทดสอบ

```bash
# ดูที่เกินกำหนด
GET http://localhost:3000/api/todos?overdue=true&sort=dueDate

# ดูที่จะครบใน 7 วัน
GET http://localhost:3000/api/todos?upcoming=7&sort=dueDate

# ดูที่จะครบพรุ่งนี้
GET http://localhost:3000/api/todos?upcoming=1
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "pagination": {...},
  "filters": {
    "done": null,
    "priority": null,
    "search": null,
    "overdue": "true",
    "upcoming": null
  },
  "data": [
    {
      "_id": "65b9...",
      "task": "ส่งงาน Workshop 14",
      "done": false,
      "dueDate": "2024-01-30T17:00:00.000Z",
      "createdAt": "2024-01-28T10:00:00.000Z"
    }
  ]
}
```

---

## 🎨 Bonus: ฟีเจอร์เพิ่มเติม

### Bonus 1: แสดง Overdue Days

**เพิ่ม Virtual ใน Model:**

```javascript
// src/models/Todo.js

todoSchema.virtual('overdueDays').get(function() {
  if (!this.dueDate || this.done) {
    return null;
  }
  
  const now = new Date();
  if (this.dueDate < now) {
    const diff = now - this.dueDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  }
  
  return null;
});

// ต้องเพิ่มใน toJSON
todoSchema.set('toJSON', { virtuals: true });
```

**ผลลัพธ์:**
```json
{
  "_id": "65b9...",
  "task": "ส่งงาน",
  "dueDate": "2024-01-28T00:00:00.000Z",
  "overdueDays": 3  // เกิน 3 วัน
}
```

### Bonus 2: Bulk Update

**เพิ่ม Endpoint:**

```javascript
// src/controllers/todoController.js

/**
 * PATCH /api/todos/bulk/mark-done
 * ทำเครื่องหมายหลาย todos เป็นเสร็จ
 */
exports.bulkMarkDone = async (req, res) => {
  try {
    const { ids } = req.body;  // array of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'ids must be a non-empty array' }
      });
    }

    const result = await Todo.updateMany(
      { _id: { $in: ids } },
      { done: true }
    );

    res.json({
      success: true,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error in bulkMarkDone:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to bulk update',
        details: error.message
      }
    });
  }
};
```

**เพิ่ม Route:**

```javascript
// src/routes/todos.js
router.patch('/bulk/mark-done', todoController.bulkMarkDone);
```

**ทดสอบ:**
```bash
PATCH http://localhost:3000/api/todos/bulk/mark-done
Content-Type: application/json

{
  "ids": [
    "65b9f5e9c8d0a1234567890a",
    "65b9f5e9c8d0a1234567890b",
    "65b9f5e9c8d0a1234567890c"
  ]
}
```

---

## 💡 Tips สำหรับอาจารย์

### การให้คะแนน

| Challenge | คะแนน | เกณฑ์ |
|-----------|-------|-------|
| Search | 30% | $regex ถูกต้อง, case insensitive |
| Pagination | 40% | skip/limit ถูกต้อง, countDocuments, metadata |
| Due Date Filter | 30% | $lt/$gte ถูกต้อง, Date handling |

**Bonus:**
- Virtual fields: +5%
- Bulk operations: +5%

### Common Mistakes

**1. ลืม case insensitive**
```javascript
// ❌ ผิด - case sensitive
filter.task = { $regex: search };

// ✅ ถูก
filter.task = { $regex: search, $options: 'i' };
```

**2. Pagination คำนวณผิด**
```javascript
// ❌ ผิด
const skip = page * limit;

// ✅ ถูก
const skip = (page - 1) * limit;
```

**3. ลืม countDocuments**
```javascript
// ❌ ผิด - ไม่รู้ total
const todos = await Todo.find(filter).limit(limit).skip(skip);

// ✅ ถูก
const todos = await Todo.find(filter).limit(limit).skip(skip);
const total = await Todo.countDocuments(filter);
```

**4. Date comparison ผิด**
```javascript
// ❌ ผิด - string comparison
filter.dueDate = { $lt: '2024-01-31' };

// ✅ ถูก - Date object
filter.dueDate = { $lt: new Date() };
```

---

## 🎓 สรุป

เฉลย Challenge Tasks ครอบคลุม:
- ✅ Search with $regex (case insensitive)
- ✅ Pagination (skip/limit + metadata)
- ✅ Date filters ($lt, $gte)
- ✅ Query combinations
- ✅ Mongoose operators

**Extra:**
- ✅ Virtual fields
- ✅ Bulk operations
- ✅ updateMany

**พร้อมใช้สอนและให้คะแนน! 🍃**
