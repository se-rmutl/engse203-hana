# 📘 ENGSE203 - สัปดาห์ที่ 2 วันที่ 4: Database Integration

## 🎯 วัตถุประสงค์การเรียนรู้

หลังจากเรียนในวันนี้ นักศึกษาจะสามารถ:
1. เข้าใจความแตกต่างระหว่าง SQL และ NoSQL databases
2. ออกแบบ database schema และ normalization
3. ทำงานกับ SQLite และ PostgreSQL
4. เชื่อมต่อ database กับ Node.js/Express API
5. ใช้งาน MongoDB และ Mongoose ODM
6. สร้าง CRUD operations กับ database
7. Implement authentication และ file uploads

## 📋 โครงสร้างเนื้อหา

### 🌅 ช่วงเช้า (09:00-12:00)
- **09:00-10:30** Workshop 13: SQLite 
- **10:30-10:45** พักเบรก
- **10:45-12:00** Workshop 14: Database Integration with Node.js

### 🌆 ช่วงบ่าย (13:00-16:00)
- **13:00-14:30** Workshop 15: MongoDB Fundamentals
- **14:30-14:45** พักเบรก
- **14:45-16:00** Workshop 16: Blog API Project

## 🛠️ เครื่องมือที่ต้องเตรียม

### ซอฟต์แวร์ที่จำเป็น
```bash
# ตรวจสอบเวอร์ชัน
node --version  # v18 ขึ้นไป
npm --version   # v9 ขึ้นไป
```

### Database Tools
- **SQLite:** ไม่ต้องติดตั้ง (embedded database)
- **PostgreSQL:** 
  - Download: https://www.postgresql.org/download/
  - หรือใช้ cloud service (Supabase, Neon, etc.)
- **MongoDB:**
  - MongoDB Community Edition
  - หรือ MongoDB Atlas (cloud)
  - MongoDB Compass (GUI tool)

### NPM Packages ที่จะใช้
```bash
# SQLite
npm install better-sqlite3

# PostgreSQL
npm install pg

# MongoDB
npm install mongodb mongoose

# ยูทิลิตี้เสริม
npm install dotenv express jsonwebtoken bcrypt multer
npm install --save-dev @types/node
```

## 📁 โครงสร้างโฟลเดอร์

```
week2-day4/
├── README.md
├── QUICK_START.md
├── INSTRUCTOR_GUIDE.md
├── workshop-13-sqlite/
│   ├── README.md
│   ├── level-1-guided/
│   │   ├── README.md
│   │   └── solutions/
│   └── level-2-challenge/
│       ├── README.md
│       └── solutions/
├── workshop-14-database-integration/
│   ├── README.md
│   ├── level-1-guided/
│   │   ├── README.md
│   │   └── solutions/
│   └── level-2-challenge/
│       ├── README.md
│       └── solutions/
├── workshop-15-mongodb-fundamentals/
│   ├── README.md
│   ├── level-1-guided/
│   │   ├── README.md
│   │   └── solutions/
│   └── level-2-challenge/
│       ├── README.md
│       └── solutions/
└── workshop-16-blog-api-project/
    ├── README.md
    ├── level-1-guided/
    │   ├── README.md
    │   └── solutions/
    └── level-2-challenge/
        ├── README.md
        └── solutions/
```

## 🎓 แนวทางการเรียน

### Workshop 2 ระดับ

#### Level 1: Guided Workshop (เรียนรู้พร้อมตัวอย่าง)
- มี code ตัวอย่างครบถ้วน 100%
- เน้นทำความเข้าใจการทำงาน
- ทดลองเพิ่มฟีเจอร์ตามที่กำหนด
- บันทึกผลและสังเกตการณ์

#### Level 2: Challenge Workshop (ฝึกปฏิบัติด้วยตัวเอง)
- มีโครงสร้างและ code พื้นฐาน 80%
- ต้องเขียน code ที่เหลือเอง 20%
- มี hints และ solutions สำหรับตรวจสอบ
- แก้ปัญหาและ debug ด้วยตัวเอง

### Solutions สำหรับอาจารย์

แต่ละ workshop จะมีโฟลเดอร์ `solutions/` ที่เก็บ:
- Code เฉลยสมบูรณ์
- คำอธิบายแนวทางแก้ปัญหา
- Common mistakes และวิธีแก้
- Alternative approaches

## 📌 หมายเหตุสำคัญ

- ทุก Workshop ต้องใช้ Git commit เป็นระยะ
- ทดสอบ database connections ก่อนเริ่ม workshop
- Backup data เป็นระยะ
- ใช้ environment variables สำหรับ sensitive data
- Follow database best practices

## 🚀 เริ่มต้น

### ขั้นตอนเตรียมความพร้อม:

1. **ติดตั้ง Databases**
   ```bash
   # SQLite - ไม่ต้องติดตั้ง
   
   # PostgreSQL
   # Download และติดตั้งจาก https://www.postgresql.org/
   
   # MongoDB
   # Download และติดตั้งจาก https://www.mongodb.com/
   ```

2. **ตรวจสอบการติดตั้ง**
   ```bash
   # PostgreSQL
   psql --version
   
   # MongoDB
   mongod --version
   mongo --version
   ```

3. **Setup MongoDB Atlas (Optional)**
   - สมัครที่ https://www.mongodb.com/cloud/atlas
   - สร้าง free cluster
   - ได้ connection string

4. **Clone Workshop Materials**
   ```bash
   git clone <repository-url>
   cd week2-day4
   ```

## 📊 เกณฑ์การประเมิน

| รายการ | คะแนน |
|--------|-------|
| Workshop 13 (SQLite) | 20% |
| Workshop 14 (Database Integration) | 25% |
| Workshop 15 (MongoDB Fundamentals) | 25% |
| Workshop 16 (Blog API Project) | 25% |
| Code quality และ Git usage | 5% |

## 💡 Tips สำหรับการเรียนรู้

1. **ทำความเข้าใจ concepts** ก่อนเขียน code
2. **Test database connections** ก่อนเริ่ม workshop
3. **Backup data** เป็นระยะ
4. **ใช้ database clients** เพื่อดูข้อมูล
5. **Error handling** สำคัญมากใน database operations
6. **Security** - อย่าเก็บ credentials ใน code

## 📚 Database Concepts Overview

### SQL vs NoSQL

| Feature | SQL | NoSQL |
|---------|-----|-------|
| Structure | Fixed schema | Flexible schema |
| Scalability | Vertical | Horizontal |
| Transactions | ACID | BASE |
| Use Cases | Complex queries | Large scale, flexible |
| Examples | PostgreSQL, MySQL | MongoDB, Redis |

### ทำไมต้องเรียนทั้ง SQL และ NoSQL?

- **SQL:** ดีสำหรับ structured data, complex relationships
- **NoSQL:** ดีสำหรับ flexible schema, high scalability
- **Real-world:** มักใช้ทั้งสองแบบร่วมกัน (polyglot persistence)

## 🎯 Learning Outcomes

หลังจากเรียนวันนี้เสร็จ นักศึกษาจะได้:

✅ ความเข้าใจพื้นฐาน SQL และ NoSQL  
✅ ทักษะการออกแบบ database schema  
✅ ความสามารถเชื่อมต่อ Node.js กับ databases  
✅ การสร้าง CRUD APIs กับ databases  
✅ ประสบการณ์ทำงานกับ 3 databases (SQLite, PostgreSQL, MongoDB)  
✅ พื้นฐาน authentication และ file uploads  

## 🔗 Resources เพิ่มเติม

### Documentation
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### Tools
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [pgAdmin](https://www.pgadmin.org/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

### Online Resources
- [SQL Tutorial - W3Schools](https://www.w3schools.com/sql/)
- [MongoDB University](https://university.mongodb.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

## 📖 Workshop Links

### เช้า
- [Workshop 13: SQLite ](./workshop-13-sqlite/README.md)
- [Workshop 14: Database Integration](./workshop-14-database-integration/README.md)

### บ่าย
- [Workshop 15: MongoDB Fundamentals](./workshop-15-mongodb-fundamentals/README.md)
- [Workshop 16: Blog API Project](./workshop-16-blog-api-project/README.md)

---

**💡 Tip:** เริ่มจาก [QUICK_START.md](./QUICK_START.md) เพื่อ setup และเริ่มต้นอย่างรวดเร็ว!

**Good luck and happy coding! 🚀**
