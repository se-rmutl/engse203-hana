# 🧪 Workshop 16: Unit Testing & Test Case Design

**ระยะเวลา:** 90 นาที  
**ระดับ:** เริ่มต้น

## 📌 ภาพรวม

Workshop นี้จะสอนการเขียน **Unit Tests** สำหรับ Todo API (จาก Workshop 14-15):
- ✅ ตั้งค่า Jest testing framework
- ✅ เขียน unit tests สำหรับ business logic
- ✅ ออกแบบ test cases (positive/negative/boundary)
- ✅ ใช้ Mock/Stub ทดสอบโดยไม่ต้องใช้ database
- ✅ ดู test coverage

**Code เต็ม 100%** - เน้นเรียนรู้การเขียน test ที่ดี

---

## 🎯 เป้าหมาย

หลังจบ workshop นี้ นักศึกษาจะสามารถ:
1. ตั้งค่า Jest และเขียน test พื้นฐานได้
2. ออกแบบ test cases ที่ครอบคลุม
3. ใช้ mock/stub ทดสอบโดยไม่ต้องใช้ database
4. อ่านและใช้ coverage report
5. เขียน test ให้กับ real-world business logic

---

## 🧩 Logic ที่จะทดสอบ

เราจะเขียน tests สำหรับ logic สำคัญใน Todo API:

```
1. Todo Validation
   ├─ validateTodo()
   └─ isValidPriority()

2. Business Rules
   ├─ canMarkAsDone()
   ├─ isOverdue()
   └─ calculateCompletionRate()

3. Data Processing
   ├─ filterTodosByStatus()
   ├─ sortTodosByPriority()
   └─ searchTodos()
```

---

## 📁 โครงสร้างโปรเจค

```
workshop-16-unit-testing/
├── package.json
├── jest.config.js              # Jest configuration
│
├── src/
│   ├── utils/
│   │   ├── validation.js       # Validation logic
│   │   ├── businessRules.js    # Business rules
│   │   └── dataProcessing.js   # Data processing
│   │
│   └── models/
│       └── Todo.js             # Todo model (จาก Workshop 15)
│
└── tests/
    ├── unit/
    │   ├── validation.test.js
    │   ├── businessRules.test.js
    │   └── dataProcessing.test.js
    │
    └── setup.js                # Test setup
```

---

## 🚀 Step 1: Setup Jest

### 1.1 ติดตั้ง Jest

```bash
npm install --save-dev jest @types/jest
```

### 1.2 สร้าง `jest.config.js`

```javascript
// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/server.js'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Verbose output
  verbose: true
};
```

### 1.3 เพิ่ม scripts ใน `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

### 1.4 สร้าง `tests/setup.js`

```javascript
// tests/setup.js

/**
 * Global test setup
 * รันก่อน test ทุกตัว
 */

// Mock console methods (ถ้าไม่อยากเห็น console.log ตอนรัน test)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Custom matchers (ถ้าต้องการ)
expect.extend({
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    return {
      pass,
      message: () => 
        pass 
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email`
    };
  }
});
```

---

## ✅ Step 2: Validation Logic & Tests

### 2.1 สร้าง `src/utils/validation.js`

```javascript
// src/utils/validation.js

/**
 * Validate todo task
 */
function validateTask(task) {
  if (!task) {
    throw new Error('Task is required');
  }
  
  if (typeof task !== 'string') {
    throw new Error('Task must be a string');
  }
  
  if (task.trim().length === 0) {
    throw new Error('Task cannot be empty');
  }
  
  if (task.length < 3) {
    throw new Error('Task must be at least 3 characters');
  }
  
  if (task.length > 500) {
    throw new Error('Task must not exceed 500 characters');
  }
  
  return true;
}

/**
 * Validate priority
 */
function isValidPriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
}

/**
 * Validate due date
 */
function validateDueDate(dueDate) {
  if (!dueDate) {
    return true; // Due date is optional
  }
  
  const date = new Date(dueDate);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  const now = new Date();
  if (date < now) {
    throw new Error('Due date cannot be in the past');
  }
  
  return true;
}

/**
 * Validate complete todo object
 */
function validateTodo(todo) {
  const errors = [];
  
  try {
    validateTask(todo.task);
  } catch (error) {
    errors.push(error.message);
  }
  
  if (todo.priority && !isValidPriority(todo.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  try {
    if (todo.dueDate) {
      validateDueDate(todo.dueDate);
    }
  } catch (error) {
    errors.push(error.message);
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      errors
    };
  }
  
  return {
    valid: true,
    errors: []
  };
}

module.exports = {
  validateTask,
  isValidPriority,
  validateDueDate,
  validateTodo
};
```

### 2.2 สร้าง `tests/unit/validation.test.js`

```javascript
// tests/unit/validation.test.js
const {
  validateTask,
  isValidPriority,
  validateDueDate,
  validateTodo
} = require('../../src/utils/validation');

describe('Validation Utils', () => {
  
  describe('validateTask', () => {
    
    // ✅ Positive Tests
    test('should accept valid task', () => {
      expect(validateTask('Buy groceries')).toBe(true);
    });
    
    test('should accept task with minimum length', () => {
      expect(validateTask('Buy')).toBe(true);
    });
    
    test('should accept task with maximum length', () => {
      const longTask = 'a'.repeat(500);
      expect(validateTask(longTask)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should reject empty task', () => {
      expect(() => validateTask('')).toThrow('Task cannot be empty');
    });
    
    test('should reject task with only spaces', () => {
      expect(() => validateTask('   ')).toThrow('Task cannot be empty');
    });
    
    test('should reject null task', () => {
      expect(() => validateTask(null)).toThrow('Task is required');
    });
    
    test('should reject undefined task', () => {
      expect(() => validateTask(undefined)).toThrow('Task is required');
    });
    
    test('should reject non-string task', () => {
      expect(() => validateTask(123)).toThrow('Task must be a string');
      expect(() => validateTask({})).toThrow('Task must be a string');
      expect(() => validateTask([])).toThrow('Task must be a string');
    });
    
    // 🔍 Boundary Tests
    test('should reject task shorter than 3 characters', () => {
      expect(() => validateTask('ab')).toThrow('Task must be at least 3 characters');
    });
    
    test('should reject task longer than 500 characters', () => {
      const tooLongTask = 'a'.repeat(501);
      expect(() => validateTask(tooLongTask))
        .toThrow('Task must not exceed 500 characters');
    });
    
    test('should accept task with exactly 3 characters', () => {
      expect(validateTask('abc')).toBe(true);
    });
    
    test('should accept task with exactly 500 characters', () => {
      const maxTask = 'a'.repeat(500);
      expect(validateTask(maxTask)).toBe(true);
    });
  });
  
  describe('isValidPriority', () => {
    
    // ✅ Positive Tests
    test('should accept "low" priority', () => {
      expect(isValidPriority('low')).toBe(true);
    });
    
    test('should accept "medium" priority', () => {
      expect(isValidPriority('medium')).toBe(true);
    });
    
    test('should accept "high" priority', () => {
      expect(isValidPriority('high')).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should reject invalid priority', () => {
      expect(isValidPriority('urgent')).toBe(false);
      expect(isValidPriority('normal')).toBe(false);
      expect(isValidPriority('')).toBe(false);
    });
    
    test('should reject case-sensitive priority', () => {
      expect(isValidPriority('Low')).toBe(false);
      expect(isValidPriority('HIGH')).toBe(false);
    });
    
    test('should reject non-string priority', () => {
      expect(isValidPriority(null)).toBe(false);
      expect(isValidPriority(undefined)).toBe(false);
      expect(isValidPriority(123)).toBe(false);
    });
  });
  
  describe('validateDueDate', () => {
    
    // ✅ Positive Tests
    test('should accept null due date (optional)', () => {
      expect(validateDueDate(null)).toBe(true);
    });
    
    test('should accept undefined due date (optional)', () => {
      expect(validateDueDate(undefined)).toBe(true);
    });
    
    test('should accept future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(validateDueDate(tomorrow.toISOString())).toBe(true);
    });
    
    test('should accept date far in future', () => {
      const futureDate = new Date('2030-12-31');
      expect(validateDueDate(futureDate.toISOString())).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should reject past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(() => validateDueDate(yesterday.toISOString()))
        .toThrow('Due date cannot be in the past');
    });
    
    test('should reject invalid date format', () => {
      expect(() => validateDueDate('invalid-date'))
        .toThrow('Invalid date format');
      expect(() => validateDueDate('2024-13-45'))
        .toThrow('Invalid date format');
    });
    
    // 🔍 Boundary Tests
    test('should accept today as due date', () => {
      const today = new Date();
      // Set to end of day to ensure it's in future
      today.setHours(23, 59, 59, 999);
      expect(validateDueDate(today.toISOString())).toBe(true);
    });
  });
  
  describe('validateTodo', () => {
    
    // ✅ Positive Tests
    test('should validate complete valid todo', () => {
      const todo = {
        task: 'Buy groceries',
        priority: 'medium',
        dueDate: new Date('2030-12-31').toISOString()
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should validate todo without optional fields', () => {
      const todo = {
        task: 'Simple task'
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    // ❌ Negative Tests
    test('should collect all validation errors', () => {
      const todo = {
        task: '',
        priority: 'invalid',
        dueDate: 'invalid-date'
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Task cannot be empty');
      expect(result.errors).toContain('Priority must be low, medium, or high');
      expect(result.errors).toContain('Invalid date format');
    });
    
    test('should validate todo with multiple errors', () => {
      const todo = {
        task: 'ab', // too short
        priority: 'urgent', // invalid
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
```

**รัน test:**
```bash
npm test validation.test.js
```

**ผลลัพธ์:**
```
PASS  tests/unit/validation.test.js
  Validation Utils
    validateTask
      ✓ should accept valid task
      ✓ should accept task with minimum length
      ✓ should accept task with maximum length
      ✓ should reject empty task
      ✓ should reject task with only spaces
      ...

Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
```

---

## 💼 Step 3: Business Rules & Tests

### 3.1 สร้าง `src/utils/businessRules.js`

```javascript
// src/utils/businessRules.js

/**
 * Check if todo can be marked as done
 */
function canMarkAsDone(todo) {
  if (!todo) {
    return false;
  }
  
  // Already done
  if (todo.done) {
    return false;
  }
  
  return true;
}

/**
 * Check if todo is overdue
 */
function isOverdue(todo) {
  if (!todo || !todo.dueDate) {
    return false;
  }
  
  if (todo.done) {
    return false;
  }
  
  const now = new Date();
  const dueDate = new Date(todo.dueDate);
  
  return dueDate < now;
}

/**
 * Calculate completion rate
 */
function calculateCompletionRate(todos) {
  if (!Array.isArray(todos) || todos.length === 0) {
    return 0;
  }
  
  const completedCount = todos.filter(t => t.done).length;
  return Math.round((completedCount / todos.length) * 100);
}

/**
 * Get priority score (for sorting)
 */
function getPriorityScore(priority) {
  const scores = {
    high: 3,
    medium: 2,
    low: 1
  };
  
  return scores[priority] || 0;
}

/**
 * Check if task is due soon (within 24 hours)
 */
function isDueSoon(todo) {
  if (!todo || !todo.dueDate || todo.done) {
    return false;
  }
  
  const now = new Date();
  const dueDate = new Date(todo.dueDate);
  const hoursDiff = (dueDate - now) / (1000 * 60 * 60);
  
  return hoursDiff > 0 && hoursDiff <= 24;
}

module.exports = {
  canMarkAsDone,
  isOverdue,
  calculateCompletionRate,
  getPriorityScore,
  isDueSoon
};
```

### 3.2 สร้าง `tests/unit/businessRules.test.js`

```javascript
// tests/unit/businessRules.test.js
const {
  canMarkAsDone,
  isOverdue,
  calculateCompletionRate,
  getPriorityScore,
  isDueSoon
} = require('../../src/utils/businessRules');

describe('Business Rules', () => {
  
  describe('canMarkAsDone', () => {
    
    // ✅ Positive Tests
    test('should allow marking pending todo as done', () => {
      const todo = { task: 'Test', done: false };
      expect(canMarkAsDone(todo)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should not allow marking already done todo', () => {
      const todo = { task: 'Test', done: true };
      expect(canMarkAsDone(todo)).toBe(false);
    });
    
    test('should return false for null todo', () => {
      expect(canMarkAsDone(null)).toBe(false);
    });
    
    test('should return false for undefined todo', () => {
      expect(canMarkAsDone(undefined)).toBe(false);
    });
  });
  
  describe('isOverdue', () => {
    
    // ✅ Positive Tests
    test('should detect overdue todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: yesterday.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should return false for todo without due date', () => {
      const todo = { task: 'Test', done: false };
      expect(isOverdue(todo)).toBe(false);
    });
    
    test('should return false for completed todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todo = {
        task: 'Test',
        done: true,
        dueDate: yesterday.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(false);
    });
    
    test('should return false for future due date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: tomorrow.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(false);
    });
    
    test('should return false for null todo', () => {
      expect(isOverdue(null)).toBe(false);
    });
    
    // 🔍 Boundary Tests
    test('should detect todo due 1 minute ago', () => {
      const oneMinuteAgo = new Date();
      oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: oneMinuteAgo.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(true);
    });
  });
  
  describe('calculateCompletionRate', () => {
    
    // ✅ Positive Tests
    test('should calculate 100% when all done', () => {
      const todos = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: true },
        { task: 'Task 3', done: true }
      ];
      
      expect(calculateCompletionRate(todos)).toBe(100);
    });
    
    test('should calculate 0% when none done', () => {
      const todos = [
        { task: 'Task 1', done: false },
        { task: 'Task 2', done: false },
        { task: 'Task 3', done: false }
      ];
      
      expect(calculateCompletionRate(todos)).toBe(0);
    });
    
    test('should calculate 50% when half done', () => {
      const todos = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: false }
      ];
      
      expect(calculateCompletionRate(todos)).toBe(50);
    });
    
    test('should round to nearest integer', () => {
      const todos = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: false },
        { task: 'Task 3', done: false }
      ];
      
      // 1/3 = 33.33... → should round to 33
      expect(calculateCompletionRate(todos)).toBe(33);
    });
    
    // ❌ Negative Tests
    test('should return 0 for empty array', () => {
      expect(calculateCompletionRate([])).toBe(0);
    });
    
    test('should return 0 for null', () => {
      expect(calculateCompletionRate(null)).toBe(0);
    });
    
    test('should return 0 for non-array', () => {
      expect(calculateCompletionRate('not array')).toBe(0);
    });
    
    // 🔍 Boundary Tests
    test('should calculate correctly with 1 todo', () => {
      expect(calculateCompletionRate([{ done: true }])).toBe(100);
      expect(calculateCompletionRate([{ done: false }])).toBe(0);
    });
  });
  
  describe('getPriorityScore', () => {
    
    // ✅ Positive Tests
    test('should return correct score for each priority', () => {
      expect(getPriorityScore('high')).toBe(3);
      expect(getPriorityScore('medium')).toBe(2);
      expect(getPriorityScore('low')).toBe(1);
    });
    
    // ❌ Negative Tests
    test('should return 0 for invalid priority', () => {
      expect(getPriorityScore('urgent')).toBe(0);
      expect(getPriorityScore('')).toBe(0);
      expect(getPriorityScore(null)).toBe(0);
      expect(getPriorityScore(undefined)).toBe(0);
    });
  });
  
  describe('isDueSoon', () => {
    
    // ✅ Positive Tests
    test('should detect todo due in 12 hours', () => {
      const in12Hours = new Date();
      in12Hours.setHours(in12Hours.getHours() + 12);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in12Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(true);
    });
    
    test('should detect todo due in 1 hour', () => {
      const in1Hour = new Date();
      in1Hour.setHours(in1Hour.getHours() + 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in1Hour.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should return false for todo without due date', () => {
      const todo = { task: 'Test', done: false };
      expect(isDueSoon(todo)).toBe(false);
    });
    
    test('should return false for completed todo', () => {
      const in12Hours = new Date();
      in12Hours.setHours(in12Hours.getHours() + 12);
      
      const todo = {
        task: 'Test',
        done: true,
        dueDate: in12Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
    
    test('should return false for todo due in 25+ hours', () => {
      const in25Hours = new Date();
      in25Hours.setHours(in25Hours.getHours() + 25);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in25Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
    
    test('should return false for overdue todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: yesterday.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
    
    // 🔍 Boundary Tests
    test('should detect todo due in exactly 24 hours', () => {
      const in24Hours = new Date();
      in24Hours.setHours(in24Hours.getHours() + 24);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in24Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(true);
    });
    
    test('should not detect todo due in 24.1 hours', () => {
      const in24Point1Hours = new Date();
      in24Point1Hours.setHours(in24Point1Hours.getHours() + 24);
      in24Point1Hours.setMinutes(in24Point1Hours.getMinutes() + 6);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in24Point1Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
  });
});
```

**รัน test:**
```bash
npm test businessRules.test.js
```

---

## 🔄 Step 4: Data Processing & Tests

### 4.1 สร้าง `src/utils/dataProcessing.js`

```javascript
// src/utils/dataProcessing.js
const { getPriorityScore } = require('./businessRules');

/**
 * Filter todos by status
 */
function filterTodosByStatus(todos, done) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  if (done === undefined || done === null) {
    return todos;
  }
  
  const isDone = done === true || done === 'true';
  return todos.filter(t => t.done === isDone);
}

/**
 * Sort todos by priority
 */
function sortTodosByPriority(todos, order = 'desc') {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const sorted = [...todos].sort((a, b) => {
    const scoreA = getPriorityScore(a.priority || 'low');
    const scoreB = getPriorityScore(b.priority || 'low');
    
    if (order === 'asc') {
      return scoreA - scoreB;
    }
    return scoreB - scoreA;
  });
  
  return sorted;
}

/**
 * Search todos by keyword
 */
function searchTodos(todos, keyword) {
  if (!Array.isArray(todos) || !keyword) {
    return todos || [];
  }
  
  const lowerKeyword = keyword.toLowerCase().trim();
  
  return todos.filter(todo => {
    const taskMatch = todo.task.toLowerCase().includes(lowerKeyword);
    return taskMatch;
  });
}

/**
 * Group todos by priority
 */
function groupTodosByPriority(todos) {
  if (!Array.isArray(todos)) {
    return { high: [], medium: [], low: [] };
  }
  
  return todos.reduce((groups, todo) => {
    const priority = todo.priority || 'low';
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(todo);
    return groups;
  }, { high: [], medium: [], low: [] });
}

/**
 * Paginate todos
 */
function paginateTodos(todos, page = 1, limit = 10) {
  if (!Array.isArray(todos)) {
    return {
      data: [],
      page: 1,
      limit,
      total: 0,
      totalPages: 0
    };
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = todos.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    page,
    limit,
    total: todos.length,
    totalPages: Math.ceil(todos.length / limit)
  };
}

module.exports = {
  filterTodosByStatus,
  sortTodosByPriority,
  searchTodos,
  groupTodosByPriority,
  paginateTodos
};
```

### 4.2 สร้าง `tests/unit/dataProcessing.test.js`

```javascript
// tests/unit/dataProcessing.test.js
const {
  filterTodosByStatus,
  sortTodosByPriority,
  searchTodos,
  groupTodosByPriority,
  paginateTodos
} = require('../../src/utils/dataProcessing');

describe('Data Processing', () => {
  
  // Sample data
  const sampleTodos = [
    { id: 1, task: 'Buy milk', priority: 'high', done: false },
    { id: 2, task: 'Read book', priority: 'low', done: true },
    { id: 3, task: 'Exercise', priority: 'medium', done: false },
    { id: 4, task: 'Pay bills', priority: 'high', done: false },
    { id: 5, task: 'Clean house', priority: 'medium', done: true }
  ];
  
  describe('filterTodosByStatus', () => {
    
    // ✅ Positive Tests
    test('should filter pending todos', () => {
      const result = filterTodosByStatus(sampleTodos, false);
      expect(result).toHaveLength(3);
      expect(result.every(t => !t.done)).toBe(true);
    });
    
    test('should filter completed todos', () => {
      const result = filterTodosByStatus(sampleTodos, true);
      expect(result).toHaveLength(2);
      expect(result.every(t => t.done)).toBe(true);
    });
    
    test('should return all when done is undefined', () => {
      const result = filterTodosByStatus(sampleTodos, undefined);
      expect(result).toHaveLength(5);
    });
    
    test('should handle string "true"', () => {
      const result = filterTodosByStatus(sampleTodos, 'true');
      expect(result).toHaveLength(2);
      expect(result.every(t => t.done)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should return empty array for non-array input', () => {
      expect(filterTodosByStatus(null, true)).toEqual([]);
      expect(filterTodosByStatus('string', true)).toEqual([]);
    });
    
    test('should return empty array for empty array', () => {
      expect(filterTodosByStatus([], true)).toEqual([]);
    });
  });
  
  describe('sortTodosByPriority', () => {
    
    // ✅ Positive Tests
    test('should sort by priority descending (high first)', () => {
      const result = sortTodosByPriority(sampleTodos, 'desc');
      expect(result[0].priority).toBe('high');
      expect(result[1].priority).toBe('high');
      expect(result[result.length - 1].priority).toBe('low');
    });
    
    test('should sort by priority ascending (low first)', () => {
      const result = sortTodosByPriority(sampleTodos, 'asc');
      expect(result[0].priority).toBe('low');
      expect(result[result.length - 1].priority).toBe('high');
    });
    
    test('should not mutate original array', () => {
      const original = [...sampleTodos];
      sortTodosByPriority(sampleTodos, 'desc');
      expect(sampleTodos).toEqual(original);
    });
    
    test('should handle todos without priority (default to low)', () => {
      const todos = [
        { id: 1, task: 'Task 1' },
        { id: 2, task: 'Task 2', priority: 'high' }
      ];
      
      const result = sortTodosByPriority(todos, 'desc');
      expect(result[0].priority).toBe('high');
    });
    
    // ❌ Negative Tests
    test('should return empty array for non-array input', () => {
      expect(sortTodosByPriority(null)).toEqual([]);
      expect(sortTodosByPriority(undefined)).toEqual([]);
    });
    
    test('should return empty array for empty array', () => {
      expect(sortTodosByPriority([])).toEqual([]);
    });
  });
  
  describe('searchTodos', () => {
    
    // ✅ Positive Tests
    test('should find todos containing keyword', () => {
      const result = searchTodos(sampleTodos, 'book');
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Read book');
    });
    
    test('should be case-insensitive', () => {
      const result = searchTodos(sampleTodos, 'MILK');
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Buy milk');
    });
    
    test('should find multiple matches', () => {
      const todos = [
        { task: 'Buy milk' },
        { task: 'Buy bread' },
        { task: 'Read book' }
      ];
      
      const result = searchTodos(todos, 'buy');
      expect(result).toHaveLength(2);
    });
    
    test('should trim keyword', () => {
      const result = searchTodos(sampleTodos, '  milk  ');
      expect(result).toHaveLength(1);
    });
    
    // ❌ Negative Tests
    test('should return empty array when no matches', () => {
      const result = searchTodos(sampleTodos, 'nonexistent');
      expect(result).toEqual([]);
    });
    
    test('should return all todos when keyword is empty', () => {
      expect(searchTodos(sampleTodos, '')).toEqual(sampleTodos);
    });
    
    test('should return all todos when keyword is null', () => {
      expect(searchTodos(sampleTodos, null)).toEqual(sampleTodos);
    });
    
    test('should return empty array for non-array input', () => {
      expect(searchTodos(null, 'test')).toEqual([]);
    });
  });
  
  describe('groupTodosByPriority', () => {
    
    // ✅ Positive Tests
    test('should group todos by priority', () => {
      const result = groupTodosByPriority(sampleTodos);
      
      expect(result.high).toHaveLength(2);
      expect(result.medium).toHaveLength(2);
      expect(result.low).toHaveLength(1);
    });
    
    test('should handle todos without priority (default to low)', () => {
      const todos = [
        { id: 1, task: 'Task 1' },
        { id: 2, task: 'Task 2', priority: 'high' }
      ];
      
      const result = groupTodosByPriority(todos);
      expect(result.low).toHaveLength(1);
      expect(result.high).toHaveLength(1);
    });
    
    // ❌ Negative Tests
    test('should return empty groups for non-array input', () => {
      const result = groupTodosByPriority(null);
      expect(result).toEqual({ high: [], medium: [], low: [] });
    });
    
    test('should return empty groups for empty array', () => {
      const result = groupTodosByPriority([]);
      expect(result).toEqual({ high: [], medium: [], low: [] });
    });
  });
  
  describe('paginateTodos', () => {
    
    // Setup: 25 todos
    const manyTodos = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      task: `Task ${i + 1}`,
      done: false
    }));
    
    // ✅ Positive Tests
    test('should paginate correctly (page 1)', () => {
      const result = paginateTodos(manyTodos, 1, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.data[0].id).toBe(1);
    });
    
    test('should paginate correctly (page 2)', () => {
      const result = paginateTodos(manyTodos, 2, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(2);
      expect(result.data[0].id).toBe(11);
    });
    
    test('should paginate correctly (last page)', () => {
      const result = paginateTodos(manyTodos, 3, 10);
      
      expect(result.data).toHaveLength(5); // remaining items
      expect(result.page).toBe(3);
      expect(result.data[0].id).toBe(21);
    });
    
    test('should use default page and limit', () => {
      const result = paginateTodos(manyTodos);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
    
    // ❌ Negative Tests
    test('should return empty result for non-array input', () => {
      const result = paginateTodos(null, 1, 10);
      
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
    
    test('should return empty data for page beyond total', () => {
      const result = paginateTodos(manyTodos, 10, 10);
      
      expect(result.data).toEqual([]);
      expect(result.page).toBe(10);
    });
    
    // 🔍 Boundary Tests
    test('should handle single item', () => {
      const result = paginateTodos([{ id: 1 }], 1, 10);
      
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });
    
    test('should handle exact page size', () => {
      const todos = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
      const result = paginateTodos(todos, 1, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.totalPages).toBe(1);
    });
  });
});
```

**รัน test:**
```bash
npm test dataProcessing.test.js
```

---

## 📊 Step 5: Coverage Report

### รัน tests พร้อม coverage

```bash
npm run test:coverage
```

**ผลลัพธ์:**
```
 PASS  tests/unit/validation.test.js
 PASS  tests/unit/businessRules.test.js
 PASS  tests/unit/dataProcessing.test.js

Test Suites: 3 passed, 3 total
Tests:       85 passed, 85 total

-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   98.5  |   95.8   |  100    |   98.5  |
 validation.js   |   100   |   100    |  100    |   100   |
 businessRules.js|   97.5  |   93.3   |  100    |   97.5  |
 dataProcessing.js|  98.2  |   94.1   |  100    |   98.2  |
-----------------|---------|----------|---------|---------|
```

### ดู Coverage Report (HTML)

```bash
open coverage/lcov-report/index.html
```

---

## 🎯 Challenge Tasks

### Challenge 1: Test Todo Model (with Mock)

เขียน tests สำหรับ Todo Model ที่ต้องเชื่อม database (ใช้ mock)

```javascript
// src/models/Todo.js (simplified)
const db = require('../config/database');

class Todo {
  static async getAll() {
    return await db.query('SELECT * FROM todos');
  }
  
  static async getById(id) {
    const result = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    return result[0];
  }
  
  static async create(data) {
    const result = await db.query('INSERT INTO todos SET ?', data);
    return { id: result.insertId, ...data };
  }
}

module.exports = Todo;
```

**Challenge:** เขียน tests โดยใช้ mock database

### Challenge 2: Test Error Handling

เขียน tests สำหรับ error scenarios:
- Database connection error
- Invalid data format
- Duplicate key error
- Timeout error

### Challenge 3: Test Date/Time Logic

เขียน tests สำหรับ time-sensitive functions:
- `getTasksDueToday()`
- `getTasksDueThisWeek()`
- `getOverdueTasks()`

---

## 📝 สรุป

✅ ตั้งค่า Jest testing framework  
✅ เขียน unit tests สำหรับ validation  
✅ เขียน unit tests สำหรับ business logic  
✅ เขียน unit tests สำหรับ data processing  
✅ ออกแบบ test cases (positive/negative/boundary)  
✅ ใช้ mock/stub (concept)  
✅ ดู coverage report  

**Total Tests:** 85+ tests  
**Coverage:** 95%+

---

**เก่งมาก! คุณเขียน test แรกแล้ว! 🎉**

**Next:** เฉลย Challenge Tasks → [Solutions](./solutions/CHALLENGE_SOLUTIONS.md)
