## 🎨 UI Testing Interface - สรุป

#### 1. Workshop 13 - Library System (Reference)
**Location:** `/workshop-13-sqlite/level-2-challenge/ui-reference.html`

**ฟีเจอร์:**
- แสดง Database Schema ทั้ง 3 ตาราง
- อธิบาย Models และ Methods
- วิธีการรัน (ไม่ใช่ API)
- ตัวอย่างการใช้งาน
- ลิงก์ไป Workshop 14-15

---

#### 2. Workshop 14 - Todo API (SQLite + Express)
**Location:** `/workshop-14-database-integration/level-1-guided/index.html`

**ฟีเจอร์ครบถ้วน:**
- ✅ **CRUD Operations**
  - Create todo
  - Read todos (with filters)
  - Update todo (edit/toggle done)
  - Delete todo

- ✅ **Challenge Features:**
  - 🔍 **Filter by Status** (done/pending)
  - 🔎 **Search** (ค้นหาใน task)
  - 📄 **Pagination** (แบ่งหน้า 5/10/20/50 items)

- ✅ **UI Features:**
  - แสดงสถิติ (Total, Completed, Pending)
  - แก้ไข todo แบบ inline
  - Real-time search
  - Pagination controls
  - Success/Error messages
  - Loading state

**วิธีใช้งาน:**
1. Start API server: `npm run dev` (ใน workshop-14 folder)
2. เปิดไฟล์ `index.html` ในเบราว์เซอร์
3. ทดสอบ CRUD + Challenge Features

---

#### 3. Workshop 15 - Todo API (MongoDB + Mongoose)
**Location:** `/workshop-15-mongodb-fundamentals/level-1-guided/index.html`

**ฟีเจอร์ครบถ้วน:**
- ✅ **CRUD Operations**
  - Create todo (with priority, due date)
  - Read todos (with filters)
  - Update todo (edit/toggle done)
  - Delete todo

- ✅ **Challenge Features:**
  - 🔍 **Challenge 1: Search** (ค้นหาด้วย $regex, case insensitive)
  - 📄 **Challenge 2: Pagination** (แบ่งหน้า + metadata)
  - 📅 **Challenge 3: Due Date Filter**
    - Overdue (เกินกำหนด)
    - Today (วันนี้)
    - Tomorrow (พรุ่งนี้)
    - This Week (สัปดาห์นี้)

- ✅ **MongoDB Specific Features:**
  - Priority levels (High/Medium/Low)
  - Due dates with datetime picker
  - Sort by priority/date
  - Overdue highlighting (แดง)
  - Due soon highlighting (เหลือง)
  - ObjectId display

- ✅ **UI Features:**
  - แสดงสถิติ (Total, Completed, Pending)
  - แก้ไข todo พร้อม priority + due date
  - Real-time search
  - Multiple filters ใช้งานร่วมกัน
  - Pagination with total count
  - Color-coded priorities
  - Success/Error messages
  - Loading state

**วิธีใช้งาน:**
1. Start MongoDB server
2. Start API server: `npm run dev` (ใน workshop-15 folder)
3. เปิดไฟล์ `index.html` ในเบราว์เซอร์
4. ทดสอบ CRUD + All Challenge Features

---

## 🎯 การทดสอบ Challenge Features

### Workshop 14 (SQLite)

**Challenge 1: Filter by Status**
```
1. เลือก Status = "Pending"
2. คลิก "Apply Filters"
→ แสดงเฉพาะ todos ที่ยังไม่เสร็จ
```

**Challenge 2: Search**
```
1. พิมพ์ "ซื้อ" ในช่อง Search
2. กด Enter หรือรอ auto-search
→ แสดงเฉพาะ todos ที่มีคำว่า "ซื้อ"
```

**Challenge 3: Pagination**
```
1. เลือก Items per page = 5
2. คลิก "Apply Filters"
3. ใช้ Previous/Next เปลี่ยนหน้า
→ แสดงข้อมูลแบ่งหน้า พร้อม page info
```

---

### Workshop 15 (MongoDB)

**Challenge 1: Search ($regex)**
```
1. พิมพ์ "เรียน" ในช่อง Search
2. รอ auto-search
→ แสดง todos ที่มีคำว่า "เรียน" (case insensitive)
```

**Challenge 2: Pagination**
```
1. เลือก Items/Page = 10
2. คลิก "Apply Filters"
3. ดูข้อมูล pagination: "Page 1 of 3 (25 items)"
4. ใช้ Previous/Next
→ แสดงข้อมูลแบ่งหน้า พร้อม total count
```

**Challenge 3: Due Date Filter**
```
1. เพิ่ม todo ที่มี due date = พรุ่งนี้
2. เลือก Due Date = "Tomorrow"
3. คลิก "Apply Filters"
→ แสดงเฉพาะ todos ที่ครบกำหนดพรุ่งนี้

เพิ่มเติม:
- Overdue = แถวสีแดง
- Due soon = แถวสีเหลือง
```

---

## 🎨 UI Design

### สีและธีม

**Workshop 14 (SQLite):**
- Primary: สีน้ำเงิน (#007bff)
- Success: สีเขียว (#28a745)
- Warning: สีเหลือง (#ffc107)
- Danger: สีแดง (#dc3545)

**Workshop 15 (MongoDB):**
- Same colors + Priority badges
- 🔴 High Priority - สีแดง
- 🟠 Medium Priority - สีส้ม
- 🔵 Low Priority - สีฟ้า

### Responsive
- ใช้ CSS Grid
- Auto-fit columns
- Mobile-friendly

---

## 📋 Checklist การทดสอบ

### Workshop 14
- [ ] Create todo
- [ ] Edit todo
- [ ] Toggle done/undone
- [ ] Delete todo
- [ ] Filter by status
- [ ] Search task
- [ ] Pagination (previous/next)
- [ ] Change items per page
- [ ] View statistics
- [ ] Reset filters

### Workshop 15
- [ ] Create todo with priority
- [ ] Create todo with due date
- [ ] Edit todo (update all fields)
- [ ] Toggle done/undone
- [ ] Delete todo
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Search task (Challenge 1)
- [ ] Pagination (Challenge 2)
- [ ] Filter by due date (Challenge 3)
  - [ ] Overdue
  - [ ] Today
  - [ ] Tomorrow
  - [ ] This Week
- [ ] Sort by priority
- [ ] Sort by due date
- [ ] View statistics
- [ ] Reset filters
- [ ] Visual indicators (overdue/due soon)

---

## 🚀 การใช้งาน

### 1. เตรียม API Server

**Workshop 14:**
```bash
cd workshop-14-database-integration/level-1-guided
npm install
npm run db:reset  # สร้าง database
npm run dev       # start server
```

**Workshop 15:**
```bash
# 1. Start MongoDB
mongod  # หรือ sudo systemctl start mongod

# 2. Start API Server
cd workshop-15-mongodb-fundamentals/level-1-guided
npm install
npm run dev
```

### 2. เปิด UI

**Option 1: Double-click**
- เปิดไฟล์ `index.html` โดยตรง

**Option 2: Live Server**
- ใช้ VS Code extension: Live Server
- Right-click → Open with Live Server

**Option 3: Python HTTP Server**
```bash
cd workshop-15-mongodb-fundamentals/level-1-guided
python -m http.server 8000
# เปิด http://localhost:8000
```

---

## 💡 Tips

1. **CORS Issues:**
   - API มี CORS enabled อยู่แล้ว
   - ถ้าเจอปัญหา ใช้ Live Server แทน file://

2. **API URL:**
   - Default: `http://localhost:3000/api/todos`
   - แก้ในตัวแปร `API_URL` ถ้าต้องการเปลี่ยน

3. **Real-time Search:**
   - พิมพ์รอ 500ms จะ auto-search
   - ไม่ต้องกด Enter (แต่กดได้)

4. **Error Messages:**
   - Success = เขียว (แสดง 3 วินาที)
   - Error = แดง (แสดง 3 วินาที)

---