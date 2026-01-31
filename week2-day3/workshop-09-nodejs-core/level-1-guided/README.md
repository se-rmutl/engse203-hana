# 🎓 Workshop 9 - Level 1: Guided Workshop

## 📌 ภาพรวม

Workshop นี้จะสอนพื้นฐาน Node.js ผ่านการสร้าง **File Manager CLI Tool** ที่สามารถ:
- แสดงรายการไฟล์ในโฟลเดอร์
- สร้างไฟล์และโฟลเดอร์
- อ่านเนื้อหาไฟล์
- ลบไฟล์
- ใช้ Environment Variables

## 🎯 สิ่งที่จะได้เรียนรู้

✅ Node.js modules และ require  
✅ File System operations  
✅ Environment Variables  
✅ Command Line Arguments  
✅ Async/Await patterns  
✅ Error handling

---

## 📁 โครงสร้างโปรเจค

```
level-1-guided/
├── .env
├── .gitignore
├── package.json
├── index.js
├── modules/
│   ├── fileManager.js
│   ├── logger.js
│   └── config.js
├── data/
│   └── sample.txt
└── logs/
    └── .gitkeep
```

---

## 🚀 Step 1: Setup Project

### 1.1 สร้างโครงสร้างโฟลเดอร์

```bash
mkdir -p level-1-guided/modules
mkdir -p level-1-guided/data
mkdir -p level-1-guided/logs
cd level-1-guided
```

### 1.2 Initialize npm

```bash
npm init -y
```

### 1.3 ติดตั้ง dependencies

```bash
npm install dotenv chalk@4.1.2
npm install --save-dev nodemon
```

### 1.4 สร้าง .env file

```bash
# .env
APP_NAME=File Manager CLI
LOG_LEVEL=info
DATA_DIR=./data
LOG_DIR=./logs
```

### 1.5 สร้าง .gitignore

```bash
# .gitignore
node_modules/
.env
*.log
logs/*.log
```

### 1.6 แก้ไข package.json

```json
{
  "name": "file-manager-cli",
  "version": "1.0.0",
  "description": "Simple CLI tool for file management",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": ["cli", "file-manager", "nodejs"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**💾 Commit:**
```bash
git add .
git commit -m "Setup project structure and dependencies"
```

---

## 🔧 Step 2: สร้าง Config Module

สร้างไฟล์ `modules/config.js`:

```javascript
// modules/config.js
require('dotenv').config();

const config = {
  appName: process.env.APP_NAME || 'File Manager',
  logLevel: process.env.LOG_LEVEL || 'info',
  dataDir: process.env.DATA_DIR || './data',
  logDir: process.env.LOG_DIR || './logs',
};

// ตรวจสอบ required environment variables
function validateConfig() {
  const required = ['APP_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = {
  config,
  validateConfig
};
```

**📝 อธิบาย:**
- `require('dotenv').config()` - โหลด environment variables จาก .env
- `process.env.VARIABLE` - เข้าถึง environment variables
- `validateConfig()` - ตรวจสอบ required variables

**🧪 ทดสอบ:**
```bash
node -e "const {config} = require('./modules/config.js'); console.log(config);"
```

**💾 Commit:**
```bash
git add modules/config.js
git commit -m "Add config module with environment variables"
```

---

## 📝 Step 3: สร้าง Logger Module

สร้างไฟล์ `modules/logger.js`:

```javascript
// modules/logger.js
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { config } = require('./config');

class Logger {
  constructor() {
    this.logFile = path.join(config.logDir, 'app.log');
  }

  // เขียน log ลงไฟล์
  async writeLog(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  // Log ข้อความธรรมดา
  info(message) {
    console.log(chalk.blue('ℹ'), message);
    this.writeLog('info', message);
  }

  // Log ความสำเร็จ
  success(message) {
    console.log(chalk.green('✔'), message);
    this.writeLog('success', message);
  }

  // Log คำเตือน
  warning(message) {
    console.log(chalk.yellow('⚠'), message);
    this.writeLog('warning', message);
  }

  // Log ข้อผิดพลาด
  error(message) {
    console.log(chalk.red('✖'), message);
    this.writeLog('error', message);
  }
}

module.exports = new Logger();
```

**📝 อธิบาย:**
- ใช้ `chalk` สำหรับสี text ใน console
- ใช้ `fs.promises` สำหรับ async file operations
- Singleton pattern (export instance แทน class)

**🧪 ทดสอบ:**
```bash
node -e "const logger = require('./modules/logger.js'); logger.info('Test log'); logger.success('Success!'); logger.error('Error!');"
```

**💾 Commit:**
```bash
git add modules/logger.js
git commit -m "Add logger module with file and console logging"
```

---

## 📂 Step 4: สร้าง File Manager Module

สร้างไฟล์ `modules/fileManager.js`:

```javascript
// modules/fileManager.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class FileManager {
  constructor() {
    this.dataDir = config.dataDir;
  }

  // แสดงรายการไฟล์
  async listFiles() {
    try {
      const files = await fs.readdir(this.dataDir);
      
      if (files.length === 0) {
        logger.warning('No files found in data directory');
        return [];
      }

      logger.info(`Found ${files.length} file(s):`);
      
      for (const file of files) {
        const filePath = path.join(this.dataDir, file);
        const stats = await fs.stat(filePath);
        const type = stats.isDirectory() ? 'DIR ' : 'FILE';
        const size = stats.isFile() ? `${stats.size} bytes` : '';
        
        console.log(`  ${type} - ${file} ${size}`);
      }

      return files;
    } catch (error) {
      logger.error(`Failed to list files: ${error.message}`);
      throw error;
    }
  }

  // สร้างไฟล์
  async createFile(fileName, content = '') {
    try {
      const filePath = path.join(this.dataDir, fileName);
      
      // ตรวจสอบว่าไฟล์มีอยู่แล้วหรือไม่
      try {
        await fs.access(filePath);
        logger.warning(`File '${fileName}' already exists`);
        return false;
      } catch {
        // ไฟล์ยังไม่มี, ดำเนินการสร้าง
      }

      await fs.writeFile(filePath, content, 'utf-8');
      logger.success(`Created file: ${fileName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to create file: ${error.message}`);
      throw error;
    }
  }

  // อ่านไฟล์
  async readFile(fileName) {
    try {
      const filePath = path.join(this.dataDir, fileName);
      const content = await fs.readFile(filePath, 'utf-8');
      
      logger.info(`Content of '${fileName}':`);
      console.log('─'.repeat(50));
      console.log(content);
      console.log('─'.repeat(50));
      
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${error.message}`);
      throw error;
    }
  }

  // ลบไฟล์
  async deleteFile(fileName) {
    try {
      const filePath = path.join(this.dataDir, fileName);
      await fs.unlink(filePath);
      logger.success(`Deleted file: ${fileName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  // สร้างโฟลเดอร์
  async createDirectory(dirName) {
    try {
      const dirPath = path.join(this.dataDir, dirName);
      await fs.mkdir(dirPath, { recursive: true });
      logger.success(`Created directory: ${dirName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to create directory: ${error.message}`);
      throw error;
    }
  }

  // คัดลอกไฟล์
  async copyFile(source, destination) {
    try {
      const sourcePath = path.join(this.dataDir, source);
      const destPath = path.join(this.dataDir, destination);
      
      await fs.copyFile(sourcePath, destPath);
      logger.success(`Copied ${source} to ${destination}`);
      return true;
    } catch (error) {
      logger.error(`Failed to copy file: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new FileManager();
```

**📝 อธิบาย:**
- ใช้ `fs.promises` สำหรับ async operations
- `path.join()` สำหรับสร้าง path ที่ถูกต้องทุก OS
- Error handling ด้วย try-catch
- ใช้ logger สำหรับแสดงผล

**💾 Commit:**
```bash
git add modules/fileManager.js
git commit -m "Add file manager module with CRUD operations"
```

---

## 🎮 Step 5: สร้าง Main CLI Application

สร้างไฟล์ `index.js`:

```javascript
// index.js
const fileManager = require('./modules/fileManager');
const logger = require('./modules/logger');
const { config, validateConfig } = require('./modules/config');

// ตรวจสอบ config
try {
  validateConfig();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

// แสดง banner
function showBanner() {
  console.log('\n' + '='.repeat(50));
  console.log(`  ${config.appName}`);
  console.log('='.repeat(50) + '\n');
}

// แสดง help
function showHelp() {
  console.log('Usage: node index.js <command> [arguments]\n');
  console.log('Commands:');
  console.log('  list              - List all files');
  console.log('  create <file>     - Create a new file');
  console.log('  read <file>       - Read file content');
  console.log('  delete <file>     - Delete a file');
  console.log('  mkdir <dir>       - Create a directory');
  console.log('  copy <src> <dst>  - Copy a file');
  console.log('  help              - Show this help\n');
}

// Main function
async function main() {
  showBanner();

  // รับ command line arguments
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'list':
        await fileManager.listFiles();
        break;

      case 'create':
        if (!args[1]) {
          logger.error('Please provide a filename');
          break;
        }
        const content = args[2] || 'Hello from File Manager!';
        await fileManager.createFile(args[1], content);
        break;

      case 'read':
        if (!args[1]) {
          logger.error('Please provide a filename');
          break;
        }
        await fileManager.readFile(args[1]);
        break;

      case 'delete':
        if (!args[1]) {
          logger.error('Please provide a filename');
          break;
        }
        await fileManager.deleteFile(args[1]);
        break;

      case 'mkdir':
        if (!args[1]) {
          logger.error('Please provide a directory name');
          break;
        }
        await fileManager.createDirectory(args[1]);
        break;

      case 'copy':
        if (!args[1] || !args[2]) {
          logger.error('Please provide source and destination files');
          break;
        }
        await fileManager.copyFile(args[1], args[2]);
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

// รัน application
main();
```

**📝 อธิบาย:**
- `process.argv` - รับ command line arguments
- `process.exit()` - ออกจากโปรแกรมพร้อม exit code
- Switch-case สำหรับ routing commands

**💾 Commit:**
```bash
git add index.js
git commit -m "Add main CLI application with command routing"
```

---

## 🧪 Step 6: ทดสอบการทำงาน

### 6.1 สร้างไฟล์ตัวอย่าง

```bash
# สร้างไฟล์ sample.txt
node index.js create sample.txt "This is a sample file"

# แสดงรายการไฟล์
node index.js list

# อ่านไฟล์
node index.js read sample.txt
```

### 6.2 ทดสอบคำสั่งต่างๆ

```bash
# สร้างโฟลเดอร์
node index.js mkdir test-folder

# คัดลอกไฟล์
node index.js create original.txt "Original content"
node index.js copy original.txt copied.txt
node index.js read copied.txt

# ลบไฟล์
node index.js delete copied.txt
node index.js list
```

### 6.3 ตรวจสอบ logs

```bash
# ดู log file
cat logs/app.log
```

---

## 📝 Step 7: บันทึกผลการทดลอง

สร้างไฟล์ `EXPERIMENT_RESULTS.md`:

```markdown
# 📊 บันทึกผลการทดลอง - Workshop 9 Level 1

## ผู้ทดลอง
- ชื่อ: [ระบุชื่อ]
- วันที่: [ระบุวันที่]

## การทดลองที่ 1: ทดสอบคำสั่งพื้นฐาน

### คำสั่งที่ใช้:
```bash
node index.js create test1.txt "Hello Node.js"
node index.js list
node index.js read test1.txt
```

### ผลลัพธ์:
[บันทึกผลลัพธ์]

### สังเกต:
[บันทึกสิ่งที่สังเกตเห็น]

---

## การทดลองที่ 2: ทดสอบ Error Handling

### คำสั่งที่ใช้:
```bash
node index.js read nonexistent.txt
```

### ผลลัพธ์:
[บันทึกผลลัพธ์]

### สังเกต:
[บันทึกว่า error handling ทำงานอย่างไร]

---

## สรุป
[สรุปสิ่งที่ได้เรียนรู้]
```

**💾 Commit:**
```bash
git add EXPERIMENT_RESULTS.md
git commit -m "Add experiment results template"
```

---

## 🎯 Challenge: เพิ่มฟีเจอร์

ลองเพิ่มฟีเจอร์ต่อไปนี้:

### Challenge 1: เพิ่มคำสั่ง `append`
เพิ่มข้อความต่อท้ายไฟล์ที่มีอยู่

```bash
node index.js append sample.txt "New line"
```

<details>
<summary>💡 คำแนะนำ</summary>

เพิ่ม method ใน `fileManager.js`:
```javascript
async appendFile(fileName, content) {
  try {
    const filePath = path.join(this.dataDir, fileName);
    await fs.appendFile(filePath, '\n' + content, 'utf-8');
    logger.success(`Appended to file: ${fileName}`);
    return true;
  } catch (error) {
    logger.error(`Failed to append to file: ${error.message}`);
    throw error;
  }
}
```

เพิ่ม case ใน `index.js`:
```javascript
case 'append':
  if (!args[1] || !args[2]) {
    logger.error('Please provide filename and content');
    break;
  }
  await fileManager.appendFile(args[1], args[2]);
  break;
```
</details>

### Challenge 2: เพิ่มคำสั่ง `search`
ค้นหาไฟล์ที่มีข้อความที่ต้องการ

```bash
node index.js search "keyword"
```

<details>
<summary>💡 คำแนะนำ</summary>

```javascript
async searchFiles(keyword) {
  const files = await fs.readdir(this.dataDir);
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(this.dataDir, file);
    const stats = await fs.stat(filePath);
    
    if (stats.isFile()) {
      const content = await fs.readFile(filePath, 'utf-8');
      if (content.includes(keyword)) {
        results.push(file);
      }
    }
  }
  
  return results;
}
```
</details>

### Challenge 3: เพิ่มคำสั่ง `stats`
แสดงข้อมูลรายละเอียดของไฟล์

```bash
node index.js stats sample.txt
```

**ข้อมูลที่ควรแสดง:**
- ขนาดไฟล์
- วันที่สร้าง
- วันที่แก้ไขล่าสุด
- จำนวนบรรทัด

---

## 📚 สิ่งที่ได้เรียนรู้

✅ Node.js runtime และการทำงาน  
✅ การใช้ NPM และจัดการ dependencies  
✅ Module system (CommonJS)  
✅ File System operations (async)  
✅ Environment Variables (.env)  
✅ Command Line Arguments  
✅ Error Handling  
✅ Logging  

---

## 🎓 Next Steps

เมื่อทำ Level 1 เสร็จแล้ว ไปทำ:
👉 [Level 2: Challenge Workshop](../level-2-challenge/README.md)

---

**💡 Tips:**
- ทดสอบทุก feature ที่เพิ่ม
- Commit code เป็นระยะ
- อ่าน Node.js documentation เพิ่มเติม
- ลองใช้ `nodemon` สำหรับ development
