# ⚡ Workshop 10: Express.js Basics

**ระยะเวลา:** 75 นาที (10:45-12:00)  
**ระดับ:** เริ่มต้น-ปานกลาง

## 🎯 วัตถุประสงค์

หลังจากทำ workshop นี้เสร็จ นักศึกษาจะสามารถ:
1. ติดตั้งและ setup Express.js application
2. เข้าใจ Middleware concept และการทำงาน
3. สร้าง Routes และจัดการ HTTP requests/responses
4. ใช้ Route parameters และ Query strings
5. จัดการ Error handling แบบ centralized
6. โครงสร้าง Express application อย่างถูกต้อง

## 📚 ความรู้พื้นฐาน

### Express.js คืออะไร?

Express.js เป็น web application framework สำหรับ Node.js ที่มีขนาดเล็กและยืดหยุ่น ออกแบบมาสำหรับสร้าง web applications และ APIs

**ข้อดีของ Express:**
- เรียนรู้ง่าย, เขียน code น้อย
- Middleware ecosystem ที่ใหญ่
- รองรับ routing ที่ยืดหยุ่น
- Community support มาก
- เหมาะกับการสร้าง RESTful APIs

### Middleware คืออะไร?

Middleware คือ functions ที่สามารถเข้าถึง request object (req), response object (res), และ next middleware function ใน request-response cycle

```javascript
// Middleware function
function myMiddleware(req, res, next) {
  // ทำงานบางอย่าง
  console.log('Request received');
  
  // ส่งต่อไปยัง middleware ถัดไป
  next();
}
```

**ประเภทของ Middleware:**
1. **Application-level** - ใช้กับ app ทั้งหมด
2. **Router-level** - ใช้กับ router เฉพาะ
3. **Error-handling** - จัดการ errors
4. **Built-in** - มาพร้อม Express (เช่น express.json())
5. **Third-party** - จาก npm packages (เช่น morgan, cors)

### การทำงานของ Express Request-Response Cycle

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
              ↓              ↓              ↓
           next()        next()        res.send()
```

### Express Routing

```javascript
// Basic routing
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route parameters
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.send(`User ID: ${id}`);
});

// Query strings
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`Search: ${query}`);
});

// HTTP Methods
app.post('/users', (req, res) => { /* ... */ });
app.put('/users/:id', (req, res) => { /* ... */ });
app.delete('/users/:id', (req, res) => { /* ... */ });
```

### Request Object (req)

ข้อมูลที่สำคัญใน `req`:
- `req.params` - route parameters
- `req.query` - query strings
- `req.body` - request body (ต้องใช้ middleware)
- `req.headers` - HTTP headers
- `req.method` - HTTP method (GET, POST, etc.)
- `req.url` - requested URL

### Response Object (res)

Methods ที่ใช้บ่อยใน `res`:
- `res.send()` - ส่ง response (text, HTML, etc.)
- `res.json()` - ส่ง JSON response
- `res.status()` - set status code
- `res.sendFile()` - ส่งไฟล์
- `res.redirect()` - redirect ไปหน้าอื่น

### Error Handling

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!'
  });
});
```

## 📁 โครงสร้าง Express Application

```
express-app/
├── app.js                 # Main application file
├── server.js              # Server startup
├── .env                   # Environment variables
├── package.json
├── routes/
│   ├── index.js          # Root routes
│   ├── users.js          # User routes
│   └── products.js       # Product routes
├── middleware/
│   ├── logger.js         # Logging middleware
│   ├── auth.js           # Authentication
│   └── errorHandler.js   # Error handling
└── controllers/
    ├── userController.js
    └── productController.js
```

## 🔑 สำคัญ: Express Best Practices

1. **แยก concerns** - routes, controllers, middleware
2. **ใช้ environment variables** - สำหรับ config
3. **Error handling** - centralized error handler
4. **Validation** - validate input data
5. **Security** - helmet, cors, rate limiting
6. **Logging** - log requests และ errors
7. **Testing** - เขียน tests สำหรับ routes

## 📝 Workshop Structure

1. **Level 1:** Guided Workshop - เรียนรู้พร้อมตัวอย่างครบ
2. **Level 2:** Challenge Workshop - ฝึกปฏิบัติด้วยตัวเอง (70% code)

---

## 🚀 เริ่มต้นทำ Workshop

### Setup โปรเจค

```bash
# สร้างโฟลเดอร์
mkdir workshop-10-express-basics
cd workshop-10-express-basics

# Initialize npm
npm init -y

# ติดตั้ง dependencies
npm install express dotenv morgan

# ติดตั้ง dev dependencies
npm install --save-dev nodemon

# สร้างโครงสร้าง
mkdir routes middleware controllers public
touch app.js server.js .env .gitignore

# Initialize git
git init
echo "node_modules/
.env
*.log" > .gitignore

# Commit
git add .
git commit -m "Initial Express.js setup"
```

---

## 📖 เนื้อหา Workshop

- [Level 1: Guided Workshop](./level-1-guided/README.md) - เรียนรู้พร้อมตัวอย่างครบ
- [Level 2: Challenge Workshop](./level-2-challenge/README.md) - ฝึกปฏิบัติด้วยตัวเอง

---

## 📊 เกณฑ์การประเมิน

| รายการ | คะแนน |
|--------|-------|
| Setup Express app ได้ถูกต้อง | 20% |
| สร้าง routes และ middleware | 30% |
| ทำ Level 1 ได้สมบูรณ์ | 20% |
| ทำ Level 2 ได้สำเร็จ | 20% |
| Code quality และ structure | 10% |

## 💡 Tips

- เข้าใจ middleware flow ให้ดี
- ใช้ `next()` อย่างถูกต้อง
- จัด routes ให้เป็นระเบียบ
- Error handling ต้องอยู่ท้ายสุด
- ทดสอบทุก route ด้วย Postman/Thunder Client

---

## 🔗 HTTP Status Codes ที่ควรรู้

| Code | ความหมาย | ใช้เมื่อ |
|------|----------|---------|
| 200 | OK | Request สำเร็จ |
| 201 | Created | สร้างข้อมูลสำเร็จ |
| 204 | No Content | ลบข้อมูลสำเร็จ |
| 400 | Bad Request | ข้อมูล request ผิดพลาด |
| 401 | Unauthorized | ไม่มี authentication |
| 403 | Forbidden | ไม่มีสิทธิ์เข้าถึง |
| 404 | Not Found | ไม่พบข้อมูล |
| 500 | Internal Server Error | Server error |

---

**เริ่มเลย!** → [Level 1: Guided Workshop](./level-1-guided/README.md)
