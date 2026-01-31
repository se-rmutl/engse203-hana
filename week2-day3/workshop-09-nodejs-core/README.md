# 🔧 Workshop 9: Node.js Core Concepts

**ระยะเวลา:** 90 นาที (09:00-10:30)  
**ระดับ:** เริ่มต้น-ปานกลาง

## 🎯 วัตถุประสงค์

หลังจากทำ workshop นี้เสร็จ นักศึกษาจะสามารถ:
1. เข้าใจ Node.js runtime และความแตกต่างจาก browser
2. จัดการ packages ด้วย NPM
3. สร้างและใช้งาน modules (CommonJS และ ES Modules)
4. ทำงานกับ File System (อ่าน/เขียนไฟล์)
5. จัดการ Environment Variables ด้วย dotenv
6. สร้าง CLI tool พื้นฐาน

## 📚 ความรู้พื้นฐาน

### Node.js คืออะไร?

Node.js เป็น JavaScript runtime ที่สร้างบน V8 Engine ของ Chrome ทำให้สามารถรัน JavaScript นอก browser ได้

**ข้อดีของ Node.js:**
- Non-blocking I/O (Asynchronous)
- Single-threaded แต่สามารถจัดการ concurrent requests ได้มาก
- NPM ecosystem ใหญ่ที่สุด
- JavaScript ทั้ง frontend และ backend

### NPM (Node Package Manager)

NPM เป็นตัวจัดการ packages สำหรับ Node.js

```bash
# เริ่มต้นโปรเจค
npm init -y

# ติดตั้ง package
npm install express

# ติดตั้งแบบ dev dependency
npm install --save-dev nodemon

# ติดตั้ง package globally
npm install -g nodemon
```

### Module Systems

**1. CommonJS (แบบเดิม)**
```javascript
// export
module.exports = { name: 'John' };

// import
const data = require('./data');
```

**2. ES Modules (แบบใหม่)**
```javascript
// export
export const name = 'John';
export default function() {}

// import
import { name } from './data.js';
import getData from './data.js';
```

### File System (fs)

Node.js มี built-in module สำหรับจัดการไฟล์

```javascript
const fs = require('fs');

// อ่านไฟล์ (sync)
const data = fs.readFileSync('file.txt', 'utf-8');

// อ่านไฟล์ (async)
fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// อ่านไฟล์ (async/await)
const data = await fs.promises.readFile('file.txt', 'utf-8');
```

### Environment Variables

ใช้เก็บข้อมูลที่ละเอียดอ่อน หรือ configuration

```bash
# .env file
PORT=3000
DB_HOST=localhost
API_KEY=secret123
```

```javascript
// โหลด dotenv
require('dotenv').config();

// ใช้งาน
const port = process.env.PORT || 3000;
```

## 📝 Workshop Structure

1. **Level 1:** Guided Workshop - เรียนรู้พร้อมตัวอย่างครบ
2. **Level 2:** Challenge Workshop - ฝึกปฏิบัติด้วยตัวเอง (70% code)

---

## 🚀 เริ่มต้นทำ Workshop

### Setup โปรเจค

```bash
# สร้างโฟลเดอร์
mkdir workshop-09-nodejs-core
cd workshop-09-nodejs-core

# Initialize git
git init

# สร้าง .gitignore
echo "node_modules/
.env
*.log" > .gitignore

# Initialize npm
npm init -y

# ติดตั้ง dependencies
npm install dotenv chalk@4.1.2

# ติดตั้ง dev dependencies
npm install --save-dev nodemon

# Commit
git add .
git commit -m "Initial setup for Workshop 9"
```

---

## 📖 เนื้อหา Workshop

- [Level 1: Guided Workshop](./level-1-guided/README.md) - เรียนรู้พร้อมตัวอย่างครบ
- [Level 2: Challenge Workshop](./level-2-challenge/README.md) - ฝึกปฏิบัติด้วยตัวเอง

---

## 📊 เกณฑ์การประเมิน

| รายการ | คะแนน |
|--------|-------|
| เข้าใจ concept และทำ Level 1 ได้ | 40% |
| ทำ Level 2 ได้สำเร็จ | 40% |
| Code quality และ Git usage | 10% |
| การบันทึกผลและการทดลอง | 10% |

## 💡 Tips

- อ่านทฤษฎีให้เข้าใจก่อนเขียน code
- ทดสอบทุกครั้งหลังเขียน code
- ใช้ `console.log()` เพื่อ debug
- Commit code เป็นระยะ
- ถามเมื่อติดปัญหา

---

**เริ่มเลย!** → [Level 1: Guided Workshop](./level-1-guided/README.md)
