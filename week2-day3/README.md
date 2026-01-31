# 📘 ENGSE203 - สัปดาห์ที่ 2 วันที่ 3: Node.js & Express Backend

## 🎯 วัตถุประสงค์การเรียนรู้

หลังจากเรียนในวันนี้ นักศึกษาจะสามารถ:
1. เข้าใจหลักการทำงานของ Node.js runtime และ NPM ecosystem
2. สร้างและจัดการ modules ใน Node.js
3. ทำงานกับ File System และ Environment Variables
4. สร้าง RESTful API ด้วย Express.js
5. ใช้ Middleware และ Error Handling อย่างถูกต้อง
6. Validate ข้อมูลและจัดการ CORS
7. ทดสอบและ Document API

## 📋 โครงสร้างเนื้อหา

### 🌅 ช่วงเช้า (09:00-12:00)
- **09:00-10:30** Workshop 9: Node.js Core Concepts
- **10:30-10:45** พักเบรก
- **10:45-12:00** Workshop 10: Express.js Basics

### 🌆 ช่วงบ่าย (13:00-16:00)
- **13:00-14:30** Workshop 11: Building REST APIs
- **14:30-14:45** พักเบรก
- **14:45-16:00** Workshop 12: API Testing & Documentation

## 🛠️ เครื่องมือที่ต้องเตรียม

### ซอฟต์แวร์ที่จำเป็น
```bash
# ตรวจสอบเวอร์ชัน
node --version  # ควรเป็น v18 ขึ้นไป
npm --version   # ควรเป็น v9 ขึ้นไป
git --version
```

### VS Code Extensions (แนะนำ)
- REST Client หรือ Thunder Client
- ESLint
- Prettier
- GitLens
- Better Comments

### เครื่องมือเสริม
- Postman หรือ Insomnia (สำหรับทดสอบ API)
- MongoDB Compass (เตรียมไว้สำหรับวันถัดไป)

## 📁 โครงสร้างโฟลเดอร์

```
week2-day3/
├── README.md
├── workshop-09-nodejs-core/
│   ├── README.md
│   ├── level-1-guided/
│   └── level-2-challenge/
├── workshop-10-express-basics/
│   ├── README.md
│   ├── level-1-guided/
│   └── level-2-challenge/
├── workshop-11-rest-api/
│   ├── README.md
│   ├── level-1-guided/
│   └── level-2-challenge/
└── workshop-12-api-testing/
    ├── README.md
    ├── level-1-guided/
    └── level-2-challenge/
```

## 🎓 แนวทางการเรียน

### Workshop 2 ระดับ

#### Level 1: Guided Workshop (เรียนรู้พร้อมตัวอย่าง)
- มี code ตัวอย่างครบถ้วน
- เน้นทำความเข้าใจการทำงาน
- ทดลองเพิ่มฟีเจอร์ตามที่กำหนด
- บันทึกผลและสังเกตุการณ์

#### Level 2: Challenge Workshop (ฝึกปฏิบัติด้วยตัวเอง)
- มีโครงสร้างและ code พื้นฐาน 70%
- ต้องเขียน code ที่เหลือเอง 30%
- แก้ปัญหาและ debug ด้วยตัวเอง
- นำเสนอผลงาน

### วิธีการทำ Workshop

1. **อ่านทฤษฎีและวัตถุประสงค์** ให้เข้าใจก่อน
2. **ทำ Level 1** เพื่อเรียนรู้พื้นฐาน
3. **ทดลองและบันทึกผล** ตามที่โจทย์กำหนด
4. **ทำ Level 2** เพื่อทดสอบความเข้าใจ
5. **Review code** ร่วมกับผู้สอน

## 📌 หมายเหตุสำคัญ

- ทุก Workshop ต้องใช้ Git commit เป็นระยะ
- เขียน commit message ที่ชัดเจน
- ทดสอบ code ก่อน commit
- ถาม TA หรือผู้สอนเมื่อติดปัญหา

## 🚀 เริ่มต้น

เริ่มจาก [Workshop 9: Node.js Core Concepts](./workshop-09-nodejs-core/README.md)

---

**💡 Tips:** อย่าลืม commit code เป็นระยะ และทดสอบทุกครั้งก่อน commit!
