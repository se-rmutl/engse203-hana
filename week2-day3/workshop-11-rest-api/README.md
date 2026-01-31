# 🌐 Workshop 11: Building REST APIs

**ระยะเวลา:** 90 นาที (13:00-14:30)  
**ระดับ:** ปานกลาง

## 🎯 วัตถุประสงค์

หลังจากทำ workshop นี้เสร็จ นักศึกษาจะสามารถ:
1. เข้าใจหลักการออกแบบ RESTful API
2. ใช้ HTTP methods อย่างถูกต้อง (GET, POST, PUT, DELETE, PATCH)
3. กำหนด HTTP status codes ตามมาตรฐาน
4. Validate request data ด้วย express-validator
5. จัดการ CORS อย่างถูกต้อง
6. สร้าง API ที่มีความสม่ำเสมอและง่ายต่อการใช้งาน

## 📚 ความรู้พื้นฐาน

### REST คืออะไร?

**REST (Representational State Transfer)** เป็น architectural style สำหรับการออกแบบ network applications

**หลักการ REST:**
1. **Client-Server** - แยก concerns ระหว่าง client และ server
2. **Stateless** - แต่ละ request มีข้อมูลครบถ้วนในตัวเอง
3. **Cacheable** - responses สามารถ cache ได้
4. **Uniform Interface** - มีรูปแบบที่สม่ำเสมอ
5. **Layered System** - สามารถมี layers ระหว่าง client-server

### RESTful API Design Principles

**1. ใช้ Nouns แทน Verbs ใน URLs**
```
❌ GET /getUsers
❌ POST /createUser
✅ GET /users
✅ POST /users
```

**2. ใช้ HTTP Methods ตามความหมาย**
```
GET    - อ่านข้อมูล (Read)
POST   - สร้างข้อมูลใหม่ (Create)
PUT    - อัพเดททั้งหมด (Update/Replace)
PATCH  - อัพเดทบางส่วน (Partial Update)
DELETE - ลบข้อมูล (Delete)
```

**3. ใช้ Hierarchical Structure**
```
GET /authors           - get all authors
GET /authors/1         - get author #1
GET /authors/1/books   - get books by author #1
POST /authors/1/books  - create book for author #1
```

**4. ใช้ Query Parameters สำหรับ Filtering, Sorting, Pagination**
```
GET /books?genre=fiction
GET /books?sort=title&order=asc
GET /books?page=2&limit=10
GET /books?genre=fiction&author=tolkien
```

### HTTP Status Codes

**2xx Success**
- `200 OK` - Request สำเร็จ
- `201 Created` - สร้างข้อมูลสำเร็จ
- `204 No Content` - สำเร็จแต่ไม่มี content ส่งกลับ

**4xx Client Errors**
- `400 Bad Request` - Request ไม่ถูกต้อง
- `401 Unauthorized` - ต้อง authentication
- `403 Forbidden` - ไม่มีสิทธิ์เข้าถึง
- `404 Not Found` - ไม่พบ resource
- `409 Conflict` - ข้อมูลซ้ำหรือขัดแย้ง
- `422 Unprocessable Entity` - Validation error

**5xx Server Errors**
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service ไม่พร้อมใช้งาน

### Request Validation

ใช้ `express-validator` สำหรับ validate input:

```javascript
const { body, validationResult } = require('express-validator');

router.post('/users',
  // Validation rules
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  
  // Handler
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... create user
  }
);
```

### CORS (Cross-Origin Resource Sharing)

CORS อนุญาตให้ frontend ที่อยู่คนละ domain เรียกใช้ API ได้

```javascript
const cors = require('cors');

// Allow all origins
app.use(cors());

// Custom CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### API Response Format (Best Practice)

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  }
}
```

**List Response with Pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 📝 Workshop Structure

1. **Level 1:** Guided Workshop - สร้าง Product Management API
2. **Level 2:** Challenge Workshop - สร้าง E-commerce API

---

## 🛠️ เครื่องมือที่ต้องใช้

```bash
npm install express-validator cors helmet
```

**express-validator** - ใช้สำหรับ validate และ sanitize input  
**cors** - จัดการ CORS  
**helmet** - เพิ่ม security headers  

---

## 📖 เนื้อหา Workshop

- [Level 1: Guided Workshop](./level-1-guided/README.md) - Product Management API
- [Level 2: Challenge Workshop](./level-2-challenge/README.md) - E-commerce API

---

## 📊 เกณฑ์การประเมิน

| รายการ | คะแนน |
|--------|-------|
| ออกแบบ API ตามหลัก REST | 25% |
| ใช้ HTTP methods และ status codes ถูกต้อง | 25% |
| Request validation ครบถ้วน | 20% |
| CRUD operations ทำงานถูกต้อง | 20% |
| Code quality และ error handling | 10% |

## 💡 Tips

- ศึกษาหลัก REST principles
- ใช้ HTTP status codes ตามมาตรฐาน
- Validate input ทุก request
- Error messages ต้องชัดเจนและเป็นประโยชน์
- ทดสอบทุก endpoint

---

## 📚 REST API Best Practices Summary

1. **URL Design**
   - ใช้ nouns, plural form
   - Hierarchical structure
   - Consistent naming

2. **HTTP Methods**
   - GET - read only, idempotent
   - POST - create new resource
   - PUT - full update, idempotent
   - PATCH - partial update
   - DELETE - remove resource, idempotent

3. **Status Codes**
   - 2xx for success
   - 4xx for client errors
   - 5xx for server errors

4. **Versioning**
   - `/api/v1/users`
   - `/api/v2/users`

5. **Pagination**
   - `?page=1&limit=10`
   - Return total count

6. **Filtering & Sorting**
   - `?category=electronics`
   - `?sort=price&order=asc`

7. **Security**
   - Use HTTPS
   - Validate input
   - Rate limiting
   - CORS configuration

---

**เริ่มเลย!** → [Level 1: Guided Workshop](./level-1-guided/README.md)
