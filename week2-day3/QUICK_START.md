# 🚀 Quick Start Guide - Workshop Day 3

## 📋 ภาพรวมวันนี้

**วันที่ 3 (เสาร์):** Node.js & Express Backend Development  
**เวลา:** 09:00-16:00 (7 ชั่วโมง)  
**Workshop ทั้งหมด:** 4 workshops

---

## 📚 Workshop List

### เช้า (09:00-12:00)

#### 1️⃣ Workshop 9: Node.js Core Concepts (09:00-10:30)
- Node.js runtime & NPM
- Modules & Package management
- File System operations
- Environment Variables
- **Project:** File Manager CLI Tool

📁 Location: `workshop-09-nodejs-core/`

#### 2️⃣ Workshop 10: Express.js Basics (10:45-12:00)
- Express setup & middleware
- Routing & Route parameters
- Request & Response handling
- Error handling middleware
- **Project:** Basic API Server

📁 Location: `workshop-10-express-basics/`

---

### บ่าย (13:00-16:00)

#### 3️⃣ Workshop 11: Building REST APIs (13:00-14:30)
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes best practices
- Request validation (express-validator)
- CORS setup
- **Project:** Product Management API

📁 Location: `workshop-11-rest-api/`

#### 4️⃣ Workshop 12: API Testing & Documentation (14:45-16:00)
- Postman/Thunder Client
- API documentation (Swagger basics)
- **Project:** Test & Document API

📁 Location: `workshop-12-api-testing/`

---

## ⚡ Quick Setup สำหรับแต่ละ Workshop

### Workshop 9: Node.js Core
```bash
cd workshop-09-nodejs-core/level-1-guided
npm install
npm run dev
```

### Workshop 10: Express Basics
```bash
cd workshop-10-express-basics/level-1-guided
npm install
npm run dev
# เปิด browser: http://localhost:3000
```

### Workshop 11: REST API
```bash
cd workshop-11-rest-api/level-1-guided
npm install
npm run dev
# ทดสอบด้วย Postman
```

### Workshop 12: API Testing
```bash
cd workshop-12-api-testing/level-1-guided
npm install
npm test
# เปิดดู API docs: http://localhost:3000/api-docs
```

---

## 📁 โครงสร้างไฟล์ทั้งหมด

```
week2-day3/
├── README.md (ไฟล์นี้)
├── QUICK_START.md
│
├── workshop-09-nodejs-core/
│   ├── README.md
│   ├── level-1-guided/
│   │   └── README.md (มี code เต็ม)
│   └── level-2-challenge/
│       └── README.md (code 70%, เขียนเอง 30%)
│
├── workshop-10-express-basics/
│   ├── README.md
│   ├── level-1-guided/
│   │   └── README.md
│   └── level-2-challenge/
│       └── README.md
│
├── workshop-11-rest-api/
│   ├── README.md
│   ├── level-1-guided/
│   │   └── README.md
│   └── level-2-challenge/
│       └── README.md
│
└── workshop-12-api-testing/
    ├── README.md
    ├── level-1-guided/
    │   └── README.md
    └── level-2-challenge/
        └── README.md
```

---

## 🎯 แนวทางการเรียน

### สำหรับแต่ละ Workshop:

1. **อ่าน README.md** ของ workshop เพื่อเข้าใจ concepts
2. **ทำ Level 1** (Guided) ก่อน - มี code เต็ม
3. **ทดลองและบันทึกผล** ตาม instructions
4. **ทำ Level 2** (Challenge) - code 70%, เขียนเอง 30%
5. **Review และ commit** code เป็นระยะ

### การใช้ Git:

```bash
# ทุก workshop ควรมี git repository
git init
git add .
git commit -m "Initial setup"

# Commit เป็นระยะ
git commit -m "Complete level 1"
git commit -m "Add feature X"
```

---

## 📊 Check List สำหรับแต่ละ Workshop

### Workshop 9: Node.js Core
- [ ] เข้าใจ Node.js runtime
- [ ] ใช้ NPM ติดตั้ง packages
- [ ] สร้าง modules ได้
- [ ] ทำงานกับ File System
- [ ] ใช้ Environment Variables
- [ ] Level 1 เสร็จสมบูรณ์
- [ ] Level 2 เสร็จสมบูรณ์

### Workshop 10: Express Basics
- [ ] Setup Express application
- [ ] เข้าใจ Middleware concept
- [ ] สร้าง Routes ได้
- [ ] จัดการ Error handling
- [ ] Level 1 เสร็จสมบูรณ์
- [ ] Level 2 เสร็จสมบูรณ์

### Workshop 11: REST API
- [ ] เข้าใจหลัก REST
- [ ] ใช้ HTTP methods ถูกต้อง
- [ ] ใช้ Status codes ตามมาตรฐาน
- [ ] Validate requests
- [ ] จัดการ CORS
- [ ] Level 1 เสร็จสมบูรณ์
- [ ] Level 2 เสร็จสมบูรณ์

### Workshop 12: API Testing
- [ ] ใช้ Postman/Thunder Client
- [ ] เขียน API tests
- [ ] สร้าง API documentation
- [ ] Level 1 เสร็จสมบูรณ์
- [ ] Level 2 เสร็จสมบูรณ์

---

## 🛠️ Tools ที่ต้องเตรียม

### Required (บังคับ):
- Node.js v18+ และ NPM
- VS Code (หรือ editor อื่น)
- Git
- Terminal/Command Line

### Recommended (แนะนำ):
- Postman หรือ Thunder Client (VS Code extension)
- MongoDB Compass (สำหรับวันถัดไป)
- Chrome/Firefox DevTools

---

## 💡 Tips สำหรับวันนี้

1. **เตรียมตัวก่อนเรียน**
   - ติดตั้ง Node.js และ tools ทั้งหมด
   - Clone/Download workshop materials
   - ทดสอบว่า `node` และ `npm` ทำงานได้

2. **ระหว่างเรียน**
   - ทำตาม step-by-step อย่างละเอียด
   - ทดสอบ code ทุกครั้งก่อน move on
   - Commit code เป็นระยะ
   - ถามเมื่อติดปัญหา

3. **หลังเรียน**
   - Review code ที่เขียน
   - ลองเพิ่ม features พิเศษ
   - อ่าน documentation เพิ่มเติม

---

## 📞 ขอความช่วยเหลือ

**ถ้าติดปัญหา:**
1. อ่าน error message อย่างละเอียด
2. ตรวจสอบ console log
3. ลอง Google error message
4. ถามผู้สอนหรือ TA
5. ดูใน hints/solutions ที่ให้ไว้

**ช่องทางติดต่อ:**
- ยกมือถามในชั้นเรียน
- [Discord/Slack channel]
- [อีเมลผู้สอน]

---

## 📝 หลังเรียน

**สิ่งที่ต้องส่ง:**
- [ ] Code ทั้งหมด (push ไป GitHub)
- [ ] บันทึกผลการทดลอง (EXPERIMENT_RESULTS.md)
- [ ] Screenshot การทำงาน
- [ ] Documentation (ถ้ามี)

**Deadline:** [ระบุวันที่]

---

## 🎓 Learning Outcomes

หลังจากเรียนวันนี้เสร็จ นักศึกษาจะสามารถ:

✅ พัฒนา CLI applications ด้วย Node.js  
✅ สร้าง web server ด้วย Express.js  
✅ ออกแบบและสร้าง RESTful APIs  
✅ Validate และจัดการ errors  
✅ ทดสอบและ document APIs  
✅ ใช้ Git version control  

---

## 🚀 Next Steps (วันถัดไป)

**วันที่ 4 (อาทิตย์):** Database Integration
- SQLite & PostgreSQL
- MongoDB & NoSQL
- Database integration with Node.js

**เตรียมตัว:**
- ติดตั้ง MongoDB
- ติดตั้ง PostgreSQL (optional)
- ทบทวน SQL basics

---

**มีความสุขกับการเรียนรู้! 🎉**

ถ้ามีคำถามเพิ่มเติม อย่าลังเลที่จะถาม!
