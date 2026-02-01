# 📚 ENGSE203 - สัปดาห์ที่ 2 วันที่ 4: Database Integration

> **Computer Programming for Software Engineer**  
> Workshop Materials - Day 4 (Sunday)

---

## 🎯 ภาพรวม

เนื้อหาการเรียนครบทั้งวัน 7 ชั่วโมง (09:00-16:00) เกี่ยวกับ Database Integration:
- **4 Workshops** แบบ step-by-step
- **2 Levels** ต่อ workshop (Guided + Challenge)
- **Hands-on Projects** ทุก workshop

---

## 📂 ไฟล์สำคัญ

### 📄 เอกสารหลัก

1. **[README.md](./README.md)**  
   ภาพรวมและโครงสร้างวันนี้

2. **[QUICK_START.md](./QUICK_START.md)**  
   คู่มือเริ่มต้นอย่างรวดเร็ว - **เริ่มที่นี่!**

---

## 🗂️ Workshops

### เช้า (09:00-12:00)

#### 📌 [Workshop 13: SQLite](./workshop-13-sqlite/)
**เวลา:** 09:00-10:30 (90 นาที)

**เนื้อหา:**
- SQL basics (SELECT, INSERT, UPDATE, DELETE)
- Database design & normalization
- SQLite setup & usage and introduction


**โปรเจค:** Student Management System

**ไฟล์:**
- [README](./workshop-13-sqlite/README.md) - ภาพรวมและทฤษฎี
- [Level 1](./workshop-13-sqlite/level-1-guided/README.md) - Code เต็ม 100%
- [Level 2](./workshop-13-sqlite/level-2-challenge/README.md) - Code 80%, เขียนเอง 20%

---

#### 📌 [Workshop 14: Database Integration with Node.js](./workshop-14-database-integration/)
**เวลา:** 10:45-12:00 (75 นาที)

**เนื้อหา:**
- SQLite with better-sqlite3
- PostgreSQL with pg/node-postgres
- Query builders basics
- Hands-on: Connect database to API

**โปรเจค:** Product API with Database

---

### บ่าย (13:00-16:00)

#### 📌 [Workshop 15: MongoDB Fundamentals](./workshop-15-mongodb-fundamentals/)
**เวลา:** 13:00-14:30 (90 นาที)

**เนื้อหา:**
- NoSQL vs SQL concepts
- MongoDB setup & Compass
- CRUD operations in MongoDB
- Mongoose ODM

**โปรเจค:** Blog System with MongoDB

**ไฟล์:**
- README (ภาพรวม) *(อยู่ระหว่างสร้าง)*
- Level 1 & Level 2

---

#### 📌 [Workshop 16: Blog API Project](./workshop-16-blog-api-project/)
**เวลา:** 14:45-16:00 (75 นาที)

**เนื้อหา:**
- MongoDB aggregation basics
- User authentication (JWT)
- Post CRUD with MongoDB
- File upload (images)

**โปรเจค:** Complete Blog API

**ไฟล์:**
- README (ภาพรวม) *(อยู่ระหว่างสร้าง)*
- Level 1 & Level 2

---

## 🚀 วิธีเริ่มต้น

### สำหรับนักศึกษา:

1. **เริ่มที่** → [QUICK_START.md](./QUICK_START.md)
2. **Setup environment** → ติดตั้ง MongoDB, tools
3. **เลือก Workshop** → ตามตารางเรียน
4. **ทำ Level 1** → เรียนรู้จาก code ตัวอย่าง
5. **ทำ Level 2** → ฝึกเขียน code เอง
6. **Commit & Review** → เก็บผลงาน

---

## 📋 Checklist การเตรียมตัว

### ก่อนเรียน:

- [ ] ติดตั้ง Node.js v18+
- [ ] ติดตั้ง MongoDB Community/Atlas
- [ ] ติดตั้ง MongoDB Compass
- [ ] ติดตั้ง VS Code + Extensions
- [ ] ติดตั้ง Postman/Thunder Client
- [ ] Clone workshop materials
- [ ] ทดสอบ MongoDB connection

### ระหว่างเรียน:

- [ ] ทำตาม step-by-step
- [ ] Backup database ก่อนทดลอง
- [ ] ทดสอบ queries
- [ ] Commit code เป็นระยะ
- [ ] บันทึกผลการทดลอง

---

## 🎓 Learning Outcomes

หลังจากเรียนวันนี้เสร็จ คุณจะสามารถ:

✅ ออกแบบ database schemas  
✅ ใช้ SQL queries (CRUD operations)  
✅ เชื่อมต่อ SQLite/PostgreSQL กับ Node.js  
✅ เข้าใจความแตกต่าง SQL vs NoSQL  
✅ ใช้ MongoDB และ Mongoose ODM  
✅ สร้าง database-driven APIs  
✅ Implement authentication และ file uploads  

---

## 📦 โครงสร้างไฟล์ทั้งหมด

```
week2-day4/
├── INDEX.md (ไฟล์นี้)
├── README.md
├── QUICK_START.md
│
├── workshop-13-sqlite/
│
├── workshop-14-database-integration/
│
├── workshop-15-mongodb-fundamentals/
│
└── workshop-16-blog-api-project/

```

---

## 💡 Tips สำหรับการเรียนรู้

1. **ทำทีละ step** - อย่าข้าม
2. **เข้าใจ concepts** - อ่านทฤษฎีก่อน
3. **ทดสอบบ่อยๆ** - รันทุกครั้งหลังเขียน
4. **ใช้ GUI tools** - MongoDB Compass, DB Browser
5. **Backup data** - ก่อนทำการทดลอง
6. **Commit เป็นระยะ** - เก็บ progress
7. **ถามเมื่อสงสัย** - ไม่ต้องติดค้าง

---

## 🔗 Resources เพิ่มเติม

### Documentation:
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### Tools:
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [pgAdmin](https://www.pgadmin.org/)

### Tutorials:
- [SQL Tutorial - W3Schools](https://www.w3schools.com/sql/)
- [MongoDB University](https://university.mongodb.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

## 📞 ต้องการความช่วยเหลือ?

**ถ้าติดปัญหา:**
1. อ่าน error message ให้ละเอียด
2. ตรวจสอบ database connections
3. ดูใน hints/solutions
4. ถามในชั้นเรียน
5. ติดต่อผู้สอนหรือ TA

**ติดต่อ:**
- 🎓 ถามในชั้นเรียน
- 💬 [Discord/Slack Channel]
- 📧 [อีเมลผู้สอน]

---

## 🎉 พร้อมเริ่มต้น!

**เริ่มเลย →** [QUICK_START.md](./QUICK_START.md)

หรือ

**เลือก Workshop →**
- [Workshop 13: SQLite](./workshop-13-sqlite/)
- [Workshop 14: Database Integration](./workshop-14-database-integration/)
- [Workshop 15: MongoDB Fundamentals](./workshop-15-mongodb-fundamentals/)
- [Workshop 16: Blog API Project](./workshop-16-blog-api-project/)

---

**สนุกกับการเรียนรู้ Databases! 🚀**

*Version: 1.0.0 | Last Updated: January 31, 2026*

