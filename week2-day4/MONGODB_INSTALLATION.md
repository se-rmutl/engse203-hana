# 🔧 คู่มือติดตั้ง MongoDB

## 📋 ภาพรวม

เอกสารนี้จะแนะนำวิธีติดตั้ง MongoDB ใน 2 แบบ:
1. **บน WSL (Ubuntu)** - สำหรับใช้งานผ่าน Linux
2. **บน Windows 11** - สำหรับใช้งานบน Windows โดยตรง

พร้อมทั้งวิธีเชื่อมต่อด้วย MongoDB Compass

---

## 🐧 วิธีที่ 1: ติดตั้งบน WSL (Ubuntu)

### ข้อดี
- ✅ ใกล้เคียง production server (Linux)
- ✅ เรียนรู้ Linux commands
- ✅ ใช้ resources น้อยกว่า

### ข้อเสีย
- ❌ ซับซ้อนกว่าสำหรับมือใหม่
- ❌ ต้องรู้จัก WSL และ Linux basics

---

### 📦 Step 1: ตรวจสอบ WSL

เปิด **PowerShell** (Run as Administrator):

```powershell
# ตรวจสอบว่ามี WSL หรือยัง
wsl --list --verbose

# ถ้ายังไม่มี ติดตั้ง WSL
wsl --install

# Restart คอมพิวเตอร์
```

### 📦 Step 2: เปิด Ubuntu Terminal

```bash
# เปิด Ubuntu จาก Start Menu หรือพิมพ์
wsl
```

### 📦 Step 3: Update System

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y
```

### 📦 Step 4: ติดตั้ง MongoDB

```bash
# 1. Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# 2. Create list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Reload package database
sudo apt update

# 4. ติดตั้ง MongoDB
sudo apt install -y mongodb-org

# 5. ตรวจสอบเวอร์ชัน
mongod --version
```

**ผลลัพธ์ที่คาดหวัง:**
```
db version v7.0.x
Build Info: ...
```

### 📦 Step 5: เริ่มใช้งาน MongoDB

```bash
# สร้างโฟลเดอร์สำหรับเก็บข้อมูล
sudo mkdir -p /data/db

# ให้สิทธิ์
sudo chown -R $USER:$USER /data/db

# เริ่ม MongoDB
sudo systemctl start mongod

# เช็คสถานะ
sudo systemctl status mongod

# ตั้งให้เริ่มอัตโนมัติ
sudo systemctl enable mongod
```

**ผลลัพธ์ที่คาดหวัง:**
```
● mongod.service - MongoDB Database Server
     Loaded: loaded
     Active: active (running)
```

### 📦 Step 6: ทดสอบการเชื่อมต่อ

```bash
# เชื่อมต่อ MongoDB Shell
mongosh

# ควรเห็น
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/
# ...
```

**ทดสอบ Commands:**
```javascript
// แสดง databases
show dbs

// ใช้ database ทดสอบ
use testdb

// เพิ่มข้อมูล
db.users.insertOne({ name: "Test User", age: 25 })

// ดูข้อมูล
db.users.find()

// ออกจาก shell
exit
```

### 🔌 Step 7: เปิดให้เชื่อมต่อจาก Windows

แก้ไขไฟล์ config:

```bash
sudo nano /etc/mongod.conf
```

แก้ไขบรรทัดนี้:
```yaml
# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0  # เปลี่ยนจาก 127.0.0.1 เป็น 0.0.0.0
```

บันทึก: `Ctrl+X`, `Y`, `Enter`

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

### 🌐 Step 8: หา IP ของ WSL

```bash
# หา IP address
ip addr show eth0 | grep inet

# หรือ
hostname -I
```

**จด IP นี้ไว้** (เช่น `172.28.xxx.xxx`)

---

## 🪟 วิธีที่ 2: ติดตั้งบน Windows 11

### ข้อดี
- ✅ ง่ายกว่า WSL
- ✅ มี GUI installer
- ✅ เหมาะกับผู้เริ่มต้น

### ข้อเสีย
- ❌ ต่างจาก production (Linux)
- ❌ ใช้ resources มากกว่า

---

### 📦 Step 1: Download MongoDB

1. ไปที่ https://www.mongodb.com/try/download/community
2. เลือก:
   - **Version:** 7.0.x (Current)
   - **Platform:** Windows
   - **Package:** MSI
3. คลิก **Download**

### 📦 Step 2: ติดตั้ง

1. รัน **mongodb-windows-x86_64-7.0.x.msi**
2. เลือก **Complete** installation
3. **Install MongoDB as a Service** ✅
4. **Install MongoDB Compass** ✅ (แนะนำ)
5. คลิก **Next** จนจบ

### 📦 Step 3: ตรวจสอบการติดตั้ง

เปิด **Command Prompt** หรือ **PowerShell**:

```powershell
# ตรวจสอบเวอร์ชัน
mongod --version

# ตรวจสอบ service
sc query MongoDB
```

**ผลลัพธ์ที่คาดหวัง:**
```
STATE              : 4  RUNNING
```

### 📦 Step 4: ทดสอบการเชื่อมต่อ

```powershell
# เปิด MongoDB Shell
mongosh

# ทดสอบ commands (เหมือน WSL)
show dbs
use testdb
db.users.insertOne({ name: "Test", age: 30 })
db.users.find()
exit
```

### 🔧 Step 5: เปิด Firewall (ถ้าต้องการเชื่อมต่อจากเครื่องอื่น)

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "MongoDB" -Direction Inbound -Protocol TCP -LocalPort 27017 -Action Allow
```

---

## 🧭 MongoDB Compass - GUI Tool

### ติดตั้ง Compass (ถ้ายังไม่มี)

1. Download: https://www.mongodb.com/try/download/compass
2. ติดตั้งตามปกติ
3. เปิดโปรแกรม

### เชื่อมต่อ MongoDB

#### 🐧 เชื่อมต่อ WSL MongoDB:

```
Connection String:
mongodb://172.28.xxx.xxx:27017

(ใส่ IP ของ WSL ที่จดไว้)
```

#### 🪟 เชื่อมต่อ Windows MongoDB:

```
Connection String:
mongodb://localhost:27017

หรือ
mongodb://127.0.0.1:27017
```

### ทดสอบใน Compass

1. เชื่อมต่อสำเร็จ → เห็น **Databases** ด้านซ้าย
2. สร้าง Database: คลิก **+ Create Database**
   - Database: `testdb`
   - Collection: `users`
3. เพิ่มข้อมูล: คลิก **Insert Document**
   ```json
   {
     "name": "Test User",
     "age": 25,
     "email": "test@example.com"
   }
   ```
4. ดูข้อมูล: คลิก **Documents** tab

---

## 🔧 Troubleshooting

### ปัญหา: WSL MongoDB ไม่ start

```bash
# ดู logs
sudo tail -f /var/log/mongodb/mongod.log

# ลบ lock file
sudo rm /data/db/mongod.lock

# Repair database
sudo mongod --repair

# Start อีกครั้ง
sudo systemctl start mongod
```

### ปัญหา: Windows MongoDB service ไม่ทำงาน

```powershell
# Restart service
net stop MongoDB
net start MongoDB

# หรือ
Restart-Service MongoDB
```

### ปัญหา: Compass เชื่อมต่อ WSL ไม่ได้

```bash
# เช็คว่า MongoDB listen ที่ 0.0.0.0 หรือยัง
sudo netstat -tulpn | grep 27017

# ควรเห็น
tcp  0.0.0.0:27017

# ถ้าเป็น 127.0.0.1 ต้องแก้ config อีกครั้ง
sudo nano /etc/mongod.conf
```

### ปัญหา: Permission denied

```bash
# WSL
sudo chown -R $USER:$USER /data/db
sudo chmod -R 755 /data/db
```

```powershell
# Windows - Run as Administrator
icacls "C:\data\db" /grant Users:F /T
```

---

## 📊 เปรียบเทียบ

| Feature | WSL | Windows |
|---------|-----|---------|
| ความยาก | ⭐⭐⭐ | ⭐⭐ |
| ความเร็ว | เร็วกว่า | ช้ากว่านิดหน่อย |
| Production-like | ✅ เหมือน | ❌ ต่าง |
| GUI Tools | ✅ ใช้ได้ | ✅ ใช้ได้ |
| แนะนำสำหรับ | Dev/Production | เริ่มต้น/เรียนรู้ |

---

## 💡 คำแนะนำ

**สำหรับการเรียน:**
- เริ่มจาก **Windows** ถ้าเป็นมือใหม่
- ลอง **WSL** เมื่อคุ้นเคยแล้ว

**สำหรับการทำงานจริง:**
- ใช้ **WSL** หรือ Linux server
- ใกล้เคียง production มากกว่า

---

## ✅ Checklist การติดตั้ง

### WSL
- [ ] ติดตั้ง WSL
- [ ] ติดตั้ง MongoDB
- [ ] Start MongoDB service
- [ ] ทดสอบ mongosh
- [ ] เปิด bindIp: 0.0.0.0
- [ ] Restart MongoDB
- [ ] จด IP address
- [ ] เชื่อมต่อด้วย Compass

### Windows
- [ ] Download MongoDB MSI
- [ ] ติดตั้ง MongoDB
- [ ] ติดตั้ง Compass (optional)
- [ ] เช็ค MongoDB service
- [ ] ทดสอบ mongosh
- [ ] เชื่อมต่อด้วย Compass

---

## 🔗 Resources

- [MongoDB Official Docs](https://www.mongodb.com/docs/)
- [MongoDB University (Free)](https://university.mongodb.com/)
- [WSL Installation Guide](https://learn.microsoft.com/en-us/windows/wsl/install)
- [MongoDB Compass Docs](https://www.mongodb.com/docs/compass/)

---

**เมื่อติดตั้งเสร็จ พร้อมไปขั้นตอนถัดไป!** 🚀
