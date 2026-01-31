# 🏆 Workshop 9 - Level 2: Challenge Workshop

## 📌 ภาพรวม

ในส่วนนี้ คุณจะได้สร้าง **Task Manager CLI** ที่ซับซ้อนกว่า Level 1 โดยมี code structure ให้ประมาณ 70% และคุณต้องเขียนส่วนที่เหลือเอง

## 🎯 ฟีเจอร์ที่ต้องทำ

✅ เพิ่ม/แก้ไข/ลบ tasks  
✅ ทำเครื่องหมาย task เสร็จ  
✅ แสดง tasks ตามสถานะ (all/pending/completed)  
✅ เรียงลำดับ tasks ตามวันที่/ความสำคัญ  
✅ Export/Import tasks เป็น JSON  
✅ Statistics (จำนวน tasks, tasks เสร็จ, ฯลฯ)  

## 📁 โครงสร้างโปรเจค (ที่ให้มา)

```
level-2-challenge/
├── .env
├── .gitignore
├── package.json
├── index.js                 # ✅ ให้มาครบ (main entry)
├── modules/
│   ├── config.js           # ✅ ให้มาครบ
│   ├── logger.js           # ✅ ให้มาครบ
│   ├── taskManager.js      # 🔨 ต้องเขียนเอง 30%
│   └── storage.js          # 🔨 ต้องเขียนเอง 50%
├── data/
│   └── tasks.json          # จะถูกสร้างอัตโนมัติ
└── docs/
    └── SOLUTION.md         # เขียนบันทึกแนวทางที่คิด
```

---

## 🚀 Setup Project

```bash
mkdir -p level-2-challenge/modules
mkdir -p level-2-challenge/data
mkdir -p level-2-challenge/docs
cd level-2-challenge

npm init -y
npm install dotenv chalk@4.1.2 uuid
npm install --save-dev nodemon

git init
```

---

## 📝 Code ที่ให้มา (70%)

### 1. `.env` file

```bash
APP_NAME=Task Manager CLI
DATA_FILE=./data/tasks.json
LOG_LEVEL=info
```

### 2. `.gitignore`

```bash
node_modules/
.env
*.log
data/*.json
!data/.gitkeep
```

### 3. `package.json`

```json
{
  "name": "task-manager-cli",
  "version": "1.0.0",
  "description": "Task Manager CLI with Node.js",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": ["cli", "task-manager", "nodejs"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.2",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 4. `modules/config.js` (ให้มาครบ ✅)

```javascript
// modules/config.js
require('dotenv').config();

const config = {
  appName: process.env.APP_NAME || 'Task Manager',
  dataFile: process.env.DATA_FILE || './data/tasks.json',
  logLevel: process.env.LOG_LEVEL || 'info',
};

function validateConfig() {
  if (!config.dataFile) {
    throw new Error('DATA_FILE is required in .env');
  }
}

module.exports = { config, validateConfig };
```

### 5. `modules/logger.js` (ให้มาครบ ✅)

```javascript
// modules/logger.js
const chalk = require('chalk');

class Logger {
  info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message) {
    console.log(chalk.green('✔'), message);
  }

  warning(message) {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message) {
    console.log(chalk.red('✖'), message);
  }

  table(data) {
    console.table(data);
  }
}

module.exports = new Logger();
```

### 6. `index.js` (ให้มาครบ ✅)

```javascript
// index.js
const taskManager = require('./modules/taskManager');
const logger = require('./modules/logger');
const { config, validateConfig } = require('./modules/config');

// Validate configuration
try {
  validateConfig();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

// Show banner
function showBanner() {
  console.log('\n' + '='.repeat(60));
  console.log(`  📝 ${config.appName}`);
  console.log('='.repeat(60) + '\n');
}

// Show help
function showHelp() {
  console.log('Usage: node index.js <command> [arguments]\n');
  console.log('Commands:');
  console.log('  add <title> [priority]       - Add a new task (priority: low/medium/high)');
  console.log('  list [filter]                - List tasks (filter: all/pending/completed)');
  console.log('  complete <id>                - Mark task as completed');
  console.log('  delete <id>                  - Delete a task');
  console.log('  update <id> <title>          - Update task title');
  console.log('  stats                        - Show statistics');
  console.log('  export <filename>            - Export tasks to JSON file');
  console.log('  import <filename>            - Import tasks from JSON file');
  console.log('  help                         - Show this help\n');
  console.log('Examples:');
  console.log('  node index.js add "Buy groceries" high');
  console.log('  node index.js list pending');
  console.log('  node index.js complete 1');
}

// Main function
async function main() {
  showBanner();

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'add':
        if (!args[1]) {
          logger.error('Please provide a task title');
          break;
        }
        const priority = args[2] || 'medium';
        await taskManager.addTask(args[1], priority);
        break;

      case 'list':
        const filter = args[1] || 'all';
        await taskManager.listTasks(filter);
        break;

      case 'complete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.completeTask(parseInt(args[1]));
        break;

      case 'delete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.deleteTask(parseInt(args[1]));
        break;

      case 'update':
        if (!args[1] || !args[2]) {
          logger.error('Please provide task ID and new title');
          break;
        }
        await taskManager.updateTask(parseInt(args[1]), args[2]);
        break;

      case 'stats':
        await taskManager.showStats();
        break;

      case 'export':
        if (!args[1]) {
          logger.error('Please provide export filename');
          break;
        }
        await taskManager.exportTasks(args[1]);
        break;

      case 'import':
        if (!args[1]) {
          logger.error('Please provide import filename');
          break;
        }
        await taskManager.importTasks(args[1]);
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
```

---

## 🔨 Code ที่ต้องเขียนเอง (30%)

### 7. `modules/storage.js` (เขียนเอง 50% 🔨)

ไฟล์นี้จะจัดการการอ่าน/เขียน JSON file

```javascript
// modules/storage.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class Storage {
  constructor() {
    this.dataFile = config.dataFile;
  }

  // อ่านข้อมูล tasks จากไฟล์
  async read() {
    try {
      // TODO: ตรวจสอบว่าไฟล์มีอยู่หรือไม่
      // ถ้าไม่มี ให้ return empty array
      // ถ้ามี ให้อ่านและ parse JSON
      
      // คำแนะนำ: ใช้ fs.access() เพื่อเช็คว่าไฟล์มีอยู่
      // ใช้ fs.readFile() เพื่ออ่านไฟล์
      // ใช้ JSON.parse() เพื่อแปลงเป็น object
      
      // YOUR CODE HERE
      
    } catch (error) {
      logger.error(`Failed to read data: ${error.message}`);
      return [];
    }
  }

  // บันทึกข้อมูล tasks ลงไฟล์
  async write(data) {
    try {
      // TODO: สร้างโฟลเดอร์ data ถ้ายังไม่มี
      // TODO: แปลง data เป็น JSON string (แบบ pretty print)
      // TODO: เขียนลงไฟล์
      
      // คำแนะนำ: ใช้ path.dirname() เพื่อหา directory
      // ใช้ fs.mkdir() เพื่อสร้างโฟลเดอร์ (recursive: true)
      // ใช้ JSON.stringify() พร้อม indent
      // ใช้ fs.writeFile() เพื่อเขียนไฟล์
      
      // YOUR CODE HERE
      
      logger.success('Data saved successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
  async exportTo(filename, data) {
    try {
      // TODO: ทำคล้ายกับ write() แต่ใช้ filename ที่ระบุ
      
      // YOUR CODE HERE
      
    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      // TODO: อ่านไฟล์ที่ระบุและ return data
      
      // YOUR CODE HERE
      
    } catch (error) {
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();
```

**💡 Hints สำหรับ `storage.js`:**

<details>
<summary>คลิกดู hints สำหรับ read()</summary>

```javascript
async read() {
  try {
    try {
      await fs.access(this.dataFile);
    } catch {
      return []; // ไฟล์ไม่มี
    }
    
    const data = await fs.readFile(this.dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Failed to read data: ${error.message}`);
    return [];
  }
}
```
</details>

<details>
<summary>คลิกดู hints สำหรับ write()</summary>

```javascript
async write(data) {
  try {
    const dir = path.dirname(this.dataFile);
    await fs.mkdir(dir, { recursive: true });
    
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(this.dataFile, jsonData, 'utf-8');
    
    logger.success('Data saved successfully');
    return true;
  } catch (error) {
    logger.error(`Failed to write data: ${error.message}`);
    throw error;
  }
}
```
</details>

---

### 8. `modules/taskManager.js` (เขียนเอง 30% 🔨)

```javascript
// modules/taskManager.js
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');
const logger = require('./logger');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  // โหลด tasks จาก storage
  async loadTasks() {
    this.tasks = await storage.read();
    if (this.tasks.length > 0) {
      this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
    }
  }

  // บันทึก tasks ไปยัง storage
  async saveTasks() {
    await storage.write(this.tasks);
  }

  // เพิ่ม task ใหม่
  async addTask(title, priority = 'medium') {
    await this.loadTasks();

    // TODO: สร้าง task object ใหม่
    // ควรมี properties: id, title, priority, completed, createdAt
    // priority ต้องเป็น low, medium, หรือ high เท่านั้น
    
    // YOUR CODE HERE
    const task = {
      // ...
    };

    this.tasks.push(task);
    await this.saveTasks();
    
    logger.success(`Task added: "${title}" (ID: ${task.id})`);
    return task;
  }

  // แสดงรายการ tasks
  async listTasks(filter = 'all') {
    await this.loadTasks();

    if (this.tasks.length === 0) {
      logger.warning('No tasks found');
      return;
    }

    // TODO: กรอง tasks ตาม filter (all/pending/completed)
    
    // YOUR CODE HERE
    let filteredTasks = this.tasks;

    if (filteredTasks.length === 0) {
      logger.warning(`No ${filter} tasks found`);
      return;
    }

    // แสดงผลแบบ table
    logger.info(`\n${filter.toUpperCase()} TASKS:\n`);
    
    // TODO: จัดรูปแบบข้อมูลให้แสดงเป็น table
    // แสดง: ID, Title, Priority, Status, Created
    
    // YOUR CODE HERE
    
    console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
  }

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    // TODO: หา task จาก id
    // TODO: เปลี่ยน completed เป็น true
    // TODO: เพิ่ม completedAt timestamp
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Task ${id} marked as completed`);
  }

  // ลบ task
  async deleteTask(id) {
    await this.loadTasks();

    // TODO: ลบ task ที่มี id ตรงกัน
    // TODO: ตรวจสอบว่าหา task เจอหรือไม่
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Task ${id} deleted`);
  }

  // แก้ไข task
  async updateTask(id, newTitle) {
    await this.loadTasks();

    // TODO: หา task และแก้ไข title
    // TODO: เพิ่ม updatedAt timestamp
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Task ${id} updated`);
  }

  // แสดง statistics
  async showStats() {
    await this.loadTasks();

    // TODO: คำนวณ statistics
    // - จำนวน tasks ทั้งหมด
    // - tasks ที่เสร็จแล้ว
    // - tasks ที่รอดำเนินการ
    // - แยกตาม priority (high/medium/low)
    
    // YOUR CODE HERE
    
    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
    
    // แสดงผล statistics
    // YOUR CODE HERE
  }

  // Export tasks
  async exportTasks(filename) {
    await this.loadTasks();
    
    // TODO: ใช้ storage.exportTo() เพื่อ export
    
    // YOUR CODE HERE
    
    logger.success(`Tasks exported to ${filename}`);
  }

  // Import tasks
  async importTasks(filename) {
    // TODO: ใช้ storage.importFrom() เพื่อ import
    // TODO: merge กับ tasks ที่มีอยู่ (ถ้ามี)
    // TODO: ระวัง id ซ้ำ
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Tasks imported from ${filename}`);
  }
}

module.exports = new TaskManager();
```

**💡 Hints สำหรับ `taskManager.js`:**

<details>
<summary>คลิกดู hints สำหรับ addTask()</summary>

```javascript
async addTask(title, priority = 'medium') {
  await this.loadTasks();

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority.toLowerCase())) {
    priority = 'medium';
  }

  const task = {
    id: this.nextId++,
    title,
    priority: priority.toLowerCase(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  this.tasks.push(task);
  await this.saveTasks();
  
  logger.success(`Task added: "${title}" (ID: ${task.id})`);
  return task;
}
```
</details>

<details>
<summary>คลิกดู hints สำหรับ listTasks()</summary>

```javascript
async listTasks(filter = 'all') {
  await this.loadTasks();

  if (this.tasks.length === 0) {
    logger.warning('No tasks found');
    return;
  }

  let filteredTasks = this.tasks;

  if (filter === 'pending') {
    filteredTasks = this.tasks.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filteredTasks = this.tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    logger.warning(`No ${filter} tasks found`);
    return;
  }

  logger.info(`\n${filter.toUpperCase()} TASKS:\n`);
  
  const tableData = filteredTasks.map(task => ({
    ID: task.id,
    Title: task.title,
    Priority: task.priority,
    Status: task.completed ? '✓ Done' : '○ Pending',
    Created: new Date(task.createdAt).toLocaleDateString()
  }));
  
  logger.table(tableData);
  console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
}
```
</details>

---

## ✅ Checklist

ตรวจสอบว่าทำครบหรือยัง:

- [ ] `storage.js` - `read()` method
- [ ] `storage.js` - `write()` method
- [ ] `storage.js` - `exportTo()` method
- [ ] `storage.js` - `importFrom()` method
- [ ] `taskManager.js` - `addTask()` method
- [ ] `taskManager.js` - `listTasks()` method
- [ ] `taskManager.js` - `completeTask()` method
- [ ] `taskManager.js` - `deleteTask()` method
- [ ] `taskManager.js` - `updateTask()` method
- [ ] `taskManager.js` - `showStats()` method
- [ ] `taskManager.js` - `exportTasks()` method
- [ ] `taskManager.js` - `importTasks()` method

---

## 🧪 การทดสอบ

### Test Case 1: เพิ่มและแสดง tasks

```bash
node index.js add "Learn Node.js" high
node index.js add "Build API" medium
node index.js add "Write tests" low
node index.js list
```

**ผลลัพธ์ที่คาดหวัง:**
- Tasks ทั้ง 3 ถูกเพิ่มสำเร็จ
- แสดง table ของ tasks

### Test Case 2: Complete tasks

```bash
node index.js complete 1
node index.js list pending
node index.js list completed
```

**ผลลัพธ์ที่คาดหวัง:**
- Task ID 1 ถูกทำเครื่องหมายเสร็จ
- list pending ไม่แสดง task ID 1
- list completed แสดง task ID 1

### Test Case 3: Statistics

```bash
node index.js stats
```

**ผลลัพธ์ที่คาดหวัง:**
- แสดงจำนวน tasks ทั้งหมด
- แสดงจำนวน completed/pending
- แสดงจำนวนแยกตาม priority

### Test Case 4: Export/Import

```bash
node index.js export backup.json
node index.js import backup.json
```

---

## 📝 บันทึกแนวทางและผลลัพธ์

สร้างไฟล์ `docs/SOLUTION.md`:

```markdown
# 📊 บันทึกการพัฒนา Task Manager CLI

## ผู้พัฒนา
- ชื่อ: [ระบุชื่อ]
- วันที่: [ระบุวันที่]

## แนวทางการพัฒนา

### 1. storage.js
**ปัญหาที่พบ:**
- [บันทึกปัญหา]

**วิธีแก้:**
- [บันทึกวิธีแก้]

**สิ่งที่ได้เรียนรู้:**
- [บันทึกสิ่งที่เรียนรู้]

### 2. taskManager.js
**ปัญหาที่พบ:**
- [บันทึกปัญหา]

**วิธีแก้:**
- [บันทึกวิธีแก้]

## ผลการทดสอบ

### Test Case 1: CRUD Operations
- ✅/❌ เพิ่ม task
- ✅/❌ แสดง tasks
- ✅/❌ แก้ไข task
- ✅/❌ ลบ task

### Test Case 2: Advanced Features
- ✅/❌ กรอง tasks
- ✅/❌ Complete task
- ✅/❌ Statistics
- ✅/❌ Export/Import

## Features เพิ่มเติม (ถ้ามี)
- [บันทึก features ที่เพิ่มเอง]

## สรุป
[สรุปสิ่งที่ได้เรียนรู้จากการทำ workshop นี้]

## Screenshots
[แนบ screenshots การทำงาน]
```

---

## 🎯 Bonus Challenges (ถ้าทำเสร็จเร็ว)

### Bonus 1: เพิ่มคำสั่ง `search`
ค้นหา tasks จาก keyword

```bash
node index.js search "Node"
```

### Bonus 2: เพิ่มคำสั่ง `sort`
เรียงลำดับ tasks

```bash
node index.js list --sort priority
node index.js list --sort date
```

### Bonus 3: เพิ่ม Due Date
เพิ่ม due date ให้กับ task

```bash
node index.js add "Meeting" high --due 2024-12-31
node index.js list --overdue
```

### Bonus 4: Categories/Tags
เพิ่ม categories หรือ tags

```bash
node index.js add "Code review" --tag work
node index.js list --tag work
```

---

## 🎓 สิ่งที่ควรได้เรียนรู้

เมื่อทำ workshop นี้เสร็จ คุณควรเข้าใจ:

✅ File System operations (async patterns)  
✅ JSON data handling  
✅ Error handling strategies  
✅ Module design patterns  
✅ CLI argument parsing  
✅ Data validation  
✅ Testing strategies  

---

## 📚 Resources

- [Node.js File System Docs](https://nodejs.org/api/fs.html)
- [Node.js Path Module](https://nodejs.org/api/path.html)
- [UUID Package](https://www.npmjs.com/package/uuid)
- [Chalk Package](https://www.npmjs.com/package/chalk)

---

**เมื่อทำเสร็จแล้ว ส่งงาน:**
1. Push code ไป GitHub
2. แชร์ลิงก์ repository
3. บันทึก SOLUTION.md ให้ครบถ้วน
4. เตรียมพร้อม demo

**Good luck! 🚀**
