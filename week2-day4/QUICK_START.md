# 🚀 Quick Start Guide - Workshop Day 4

## 📋 ภาพรวมวันนี้

**วันที่ 4 (อาทิตย์):** Database Integration  
**เวลา:** 09:00-16:00 (7 ชั่วโมง)  
**Workshop ทั้งหมด:** 4 workshops

---

## 📚 Workshop List

### เช้า (09:00-12:00)

#### 1️⃣ Workshop 13: SQLite (09:00-10:30)
- SQL basics (SELECT, INSERT, UPDATE, DELETE)
- Database design & normalization
- SQLite setup & usage
- **Project:** Student Management System

📁 Location: `workshop-13-sqlite/`

#### 2️⃣ Workshop 14: Database Integration with Node.js (10:45-12:00)
- SQLite with better-sqlite3
- PostgreSQL with pg/node-postgres
- Query builders basics
- **Project:** Connect database to API

📁 Location: `workshop-14-database-integration/`

---

### บ่าย (13:00-16:00)

#### 3️⃣ Workshop 15: MongoDB Fundamentals (13:00-14:30)
- NoSQL vs SQL concepts
- MongoDB setup & Compass
- CRUD operations in MongoDB
- Mongoose ODM
- **Project:** Blog System with MongoDB

📁 Location: `workshop-15-mongodb-fundamentals/`

#### 4️⃣ Workshop 16: Blog API Project (14:45-16:00)
- MongoDB aggregation
- User authentication (JWT)
- Post CRUD
- File upload (images)
- **Project:** Complete Blog API

📁 Location: `workshop-16-blog-api-project/`

---

## ⚡ Quick Setup

### ก่อนเริ่ม Workshop:

```bash
# 1. ตรวจสอบ Node.js
node --version  # ควรเป็น v18+
npm --version

# 2. ติดตั้ง MongoDB (ถ้ายังไม่มี)
# Download: https://www.mongodb.com/try/download/community
# หรือใช้ MongoDB Atlas (cloud)

# 3. ติดตั้ง MongoDB Compass (GUI)
# Download: https://www.mongodb.com/products/compass

# 4. ติดตั้ง PostgreSQL (Optional)
# Download: https://www.postgresql.org/download/
```

### สำหรับแต่ละ Workshop:

**Workshop 13 & 14 (SQLite/PostgreSQL):**
```bash
cd workshop-13-sqlite/level-1-guided
npm install
npm run db:reset  # สร้าง database
npm run dev       # รันโปรแกรม
```

**Workshop 15 & 16 (MongoDB):**
```bash
# เริ่ม MongoDB service
# Windows: ใน Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

cd workshop-15-mongodb-fundamentals/level-1-guided
npm install
npm run dev
```

---

## 📁 โครงสร้างไฟล์ทั้งหมด

```
week2-day4/
├── README.md (ภาพรวม)
├── QUICK_START.md (ไฟล์นี้)
│
├── workshop-13-sqlite/
│   ├── README.md
│   ├── level-1-guided/
│   │   └── README.md (Student Management System)
│   └── level-2-challenge/
│       └── README.md (E-commerce Database)
│
├── workshop-14-database-integration/
│   ├── README.md
│   ├── level-1-guided/
│   └── level-2-challenge/
│
├── workshop-15-mongodb-fundamentals/
│   ├── README.md
│   ├── level-1-guided/
│   └── level-2-challenge/
│
└── workshop-16-blog-api-project/
    ├── README.md
    ├── level-1-guided/
    └── level-2-challenge/

```

---

## 🎯 แนวทางการเรียน

### Workshop มี 2 ระดับ:

#### Level 1: Guided Workshop
- มี code ตัวอย่างครบ 100%
- เรียนรู้และทำความเข้าใจ
- ทดลองเพิ่ม features
- บันทึกผล

#### Level 2: Challenge Workshop
- มี code structure 80%
- เขียนเอง 20%
- มี hints

### วิธีทำ Workshop:

1. **อ่าน README.md** - เข้าใจ concepts
2. **Setup environment** - ติดตั้ง tools
3. **ทำ Level 1** - เรียนรู้พื้นฐาน
4. **ทดลองและบันทึก** - experiment
5. **ทำ Level 2** - ทดสอบความเข้าใจ
6. **Review code** - ตรวจสอบกับเฉลย

---

## 📊 Check List

### Workshop 13: SQLite 
- [ ] เข้าใจ SQL basics
- [ ] ออกแบบ database schema
- [ ] สร้าง tables และ relationships
- [ ] เขียน queries (CRUD)
- [ ] ใช้ JOINs
- [ ] Level 1 เสร็จ
- [ ] Level 2 เสร็จ

### Workshop 14: Database Integration
- [ ] เชื่อมต่อ SQLite กับ Node.js
- [ ] ใช้ better-sqlite3
- [ ] เข้าใจ prepared statements
- [ ] Transactions
- [ ] Level 1 เสร็จ
- [ ] Level 2 เสร็จ

### Workshop 15: MongoDB Fundamentals
- [ ] เข้าใจ NoSQL concepts
- [ ] Setup MongoDB
- [ ] CRUD operations
- [ ] ใช้ Mongoose ODM
- [ ] Schema design
- [ ] Level 1 เสร็จ
- [ ] Level 2 เสร็จ

### Workshop 16: Blog API Project
- [ ] สร้าง RESTful API กับ MongoDB
- [ ] User authentication (JWT)
- [ ] File upload
- [ ] Aggregation
- [ ] Complete project

---

## 🛠️ Tools ที่ต้องเตรียม

### Required (บังคับ):
- ✅ Node.js v18+
- ✅ NPM
- ✅ MongoDB Community Edition หรือ MongoDB Atlas
- ✅ VS Code
- ✅ Git

### Recommended (แนะนำ):
- MongoDB Compass (GUI for MongoDB)
- Postman/Thunder Client (API testing)
- DB Browser for SQLite
- pgAdmin (สำหรับ PostgreSQL)

---

## 💡 Tips สำหรับวันนี้

### ก่อนเรียน:
1. ติดตั้ง MongoDB ให้เรียบร้อย
2. ทดสอบว่า mongod รันได้
3. ติดตั้ง packages ที่จำเป็น
4. Review SQL basics

### ระหว่างเรียน:
1. ทำตาม step-by-step
2. Backup database ก่อนทดลอง
3. ใช้ GUI tools ดูข้อมูล
4. Test queries ก่อนเขียนใน code
5. Commit code เป็นระยะ

### หลังเรียน:
1. Review concepts ทั้ง SQL และ NoSQL
2. ทดลองสร้าง schema เอง
3. ศึกษา best practices เพิ่มเติม

---

## 🐛 Common Issues และวิธีแก้

### Issue 1: MongoDB ไม่ start
**Windows:**
```bash
# Check service
services.msc
# หา MongoDB -> Start
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Issue 2: Connection Error
**SQLite:**
- ตรวจสอบ path ของ database file
- ตรวจสอบ permissions

**MongoDB:**
```bash
# ตรวจสอบว่า mongod รันอยู่
mongosh
# หรือ
mongo
```

### Issue 3: Package Installation Issues
```bash
# ลบและติดตั้งใหม่
rm -rf node_modules
npm install

# หรือใช้ --force
npm install --force
```

---

## 📞 ขอความช่วยเหลือ

**ติดปัญหา:**
1. อ่าน error message
2. ตรวจสอบ database connections
3. ดูใน hints/solutions
4. ถามผู้สอน/TA

**ช่องทางติดต่อ:**
- ยกมือถามในชั้นเรียน
- [Discord/Slack channel]
- [อีเมลผู้สอน]

---

## 📝 สิ่งที่ต้องส่ง

- [ ] Code ทั้งหมด (GitHub repository)
- [ ] Database schemas (SQL files)
- [ ] บันทึกผลการทดลอง
- [ ] Screenshots การทำงาน
- [ ] สรุปสิ่งที่ได้เรียนรู้

**Deadline:** [ระบุวันที่]

---

## 🎓 Learning Outcomes

หลังจากเรียนวันนี้เสร็จ คุณจะสามารถ:

✅ ออกแบบและสร้าง database schemas  
✅ ใช้ SQL CRUD operations  
✅ เชื่อมต่อ databases กับ Node.js  
✅ เข้าใจความแตกต่าง SQL vs NoSQL  
✅ ใช้ MongoDB และ Mongoose  
✅ สร้าง complete database-driven applications  

---

## 🚀 Next Steps

**สัปดาห์หน้า:** Full-stack Integration & Final Project
- เชื่อมต่อ Frontend กับ Backend
- Authentication & Authorization
- Deployment
- Final Project Presentation

**เตรียมตัว:**
- Review React basics
- ทบทวน REST API concepts
- เตรียม project ideas

---

**มีความสุขกับการเรียนรู้! 🎉**

ถ้ามีคำถามเพิ่มเติม อย่าลังเลที่จะถาม!
