# 🎯 เฉลย: Challenge Tasks - Workshop 16

## ภาพรวม

เฉลยสำหรับ 3 Challenge Tasks:
1. **Test Todo Model (with Mock)** - Mock database
2. **Test Error Handling** - Error scenarios
3. **Test Date/Time Logic** - Time-sensitive functions

---

## 🗄️ Challenge 1: Test Todo Model (with Mock)

### โจทย์

เขียน tests สำหรับ Todo Model ที่ต้องเชื่อม database โดยใช้ mock

### ✅ เฉลย

**สร้าง `src/models/Todo.js`:**

```javascript
// src/models/Todo.js
const db = require('../config/database');

class Todo {
  /**
   * Get all todos
   */
  static async getAll() {
    try {
      const result = await db.query('SELECT * FROM todos ORDER BY createdAt DESC');
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }
  }
  
  /**
   * Get todo by ID
   */
  static async getById(id) {
    try {
      const result = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
      
      if (result.length === 0) {
        throw new Error('Todo not found');
      }
      
      return result[0];
    } catch (error) {
      if (error.message === 'Todo not found') {
        throw error;
      }
      throw new Error(`Failed to fetch todo: ${error.message}`);
    }
  }
  
  /**
   * Create new todo
   */
  static async create(data) {
    try {
      const result = await db.query('INSERT INTO todos SET ?', data);
      
      return {
        id: result.insertId,
        ...data,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Duplicate todo');
      }
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }
  
  /**
   * Update todo
   */
  static async update(id, data) {
    try {
      const result = await db.query('UPDATE todos SET ? WHERE id = ?', [data, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
      
      return { id, ...data };
    } catch (error) {
      if (error.message === 'Todo not found') {
        throw error;
      }
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }
  
  /**
   * Delete todo
   */
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM todos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
      
      return true;
    } catch (error) {
      if (error.message === 'Todo not found') {
        throw error;
      }
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }
}

module.exports = Todo;
```

**สร้าง Mock Database `tests/__mocks__/database.js`:**

```javascript
// tests/__mocks__/database.js

/**
 * Mock database for testing
 */
const mockDb = {
  // In-memory storage
  _data: {
    todos: []
  },
  
  // Reset data
  _reset() {
    this._data.todos = [
      {
        id: 1,
        task: 'Test todo 1',
        done: false,
        priority: 'high',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        task: 'Test todo 2',
        done: true,
        priority: 'low',
        createdAt: new Date().toISOString()
      }
    ];
  },
  
  // Mock query method
  async query(sql, params = []) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // SELECT all
    if (sql.includes('SELECT * FROM todos') && !sql.includes('WHERE')) {
      return [...this._data.todos];
    }
    
    // SELECT by ID
    if (sql.includes('SELECT * FROM todos WHERE id')) {
      const id = params[0];
      const todo = this._data.todos.find(t => t.id === id);
      return todo ? [todo] : [];
    }
    
    // INSERT
    if (sql.includes('INSERT INTO todos')) {
      const newTodo = params;
      const id = this._data.todos.length + 1;
      const todo = { id, ...newTodo };
      this._data.todos.push(todo);
      return { insertId: id };
    }
    
    // UPDATE
    if (sql.includes('UPDATE todos')) {
      const [data, id] = params;
      const index = this._data.todos.findIndex(t => t.id === id);
      
      if (index === -1) {
        return { affectedRows: 0 };
      }
      
      this._data.todos[index] = { ...this._data.todos[index], ...data };
      return { affectedRows: 1 };
    }
    
    // DELETE
    if (sql.includes('DELETE FROM todos')) {
      const id = params[0];
      const index = this._data.todos.findIndex(t => t.id === id);
      
      if (index === -1) {
        return { affectedRows: 0 };
      }
      
      this._data.todos.splice(index, 1);
      return { affectedRows: 1 };
    }
    
    throw new Error('Query not supported in mock');
  }
};

module.exports = mockDb;
```

**สร้าง `tests/unit/Todo.test.js`:**

```javascript
// tests/unit/Todo.test.js

// Mock database BEFORE importing Todo
jest.mock('../../src/config/database', () => {
  return require('../__mocks__/database');
});

const Todo = require('../../src/models/Todo');
const db = require('../../src/config/database');

describe('Todo Model', () => {
  
  // Reset mock data before each test
  beforeEach(() => {
    db._reset();
  });
  
  describe('getAll', () => {
    
    // ✅ Positive Tests
    test('should return all todos', async () => {
      const todos = await Todo.getAll();
      
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBe(2);
    });
    
    test('should return todos with correct structure', async () => {
      const todos = await Todo.getAll();
      
      expect(todos[0]).toHaveProperty('id');
      expect(todos[0]).toHaveProperty('task');
      expect(todos[0]).toHaveProperty('done');
      expect(todos[0]).toHaveProperty('priority');
    });
    
    // ❌ Negative Tests
    test('should throw error when database fails', async () => {
      // Mock database error
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.getAll())
        .rejects
        .toThrow('Failed to fetch todos');
    });
  });
  
  describe('getById', () => {
    
    // ✅ Positive Tests
    test('should return todo by ID', async () => {
      const todo = await Todo.getById(1);
      
      expect(todo.id).toBe(1);
      expect(todo.task).toBe('Test todo 1');
    });
    
    test('should return correct todo data', async () => {
      const todo = await Todo.getById(2);
      
      expect(todo.done).toBe(true);
      expect(todo.priority).toBe('low');
    });
    
    // ❌ Negative Tests
    test('should throw error when todo not found', async () => {
      await expect(Todo.getById(999))
        .rejects
        .toThrow('Todo not found');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.getById(1))
        .rejects
        .toThrow('Failed to fetch todo');
    });
  });
  
  describe('create', () => {
    
    // ✅ Positive Tests
    test('should create new todo', async () => {
      const newTodo = {
        task: 'New task',
        done: false,
        priority: 'medium'
      };
      
      const result = await Todo.create(newTodo);
      
      expect(result.id).toBeDefined();
      expect(result.task).toBe('New task');
      expect(result.priority).toBe('medium');
    });
    
    test('should return todo with createdAt', async () => {
      const newTodo = {
        task: 'New task',
        done: false,
        priority: 'high'
      };
      
      const result = await Todo.create(newTodo);
      
      expect(result.createdAt).toBeDefined();
      expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    });
    
    test('should increment ID', async () => {
      const todo1 = await Todo.create({ task: 'Task 1', done: false });
      const todo2 = await Todo.create({ task: 'Task 2', done: false });
      
      expect(todo2.id).toBeGreaterThan(todo1.id);
    });
    
    // ❌ Negative Tests
    test('should throw error for duplicate todo', async () => {
      // Mock duplicate entry error
      jest.spyOn(db, 'query').mockRejectedValueOnce({
        code: 'ER_DUP_ENTRY',
        message: 'Duplicate entry'
      });
      
      await expect(Todo.create({ task: 'Duplicate' }))
        .rejects
        .toThrow('Duplicate todo');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.create({ task: 'Test' }))
        .rejects
        .toThrow('Failed to create todo');
    });
  });
  
  describe('update', () => {
    
    // ✅ Positive Tests
    test('should update existing todo', async () => {
      const updates = { task: 'Updated task', done: true };
      const result = await Todo.update(1, updates);
      
      expect(result.id).toBe(1);
      expect(result.task).toBe('Updated task');
      expect(result.done).toBe(true);
    });
    
    test('should update partial data', async () => {
      const updates = { done: true };
      const result = await Todo.update(1, updates);
      
      expect(result.done).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should throw error when todo not found', async () => {
      await expect(Todo.update(999, { done: true }))
        .rejects
        .toThrow('Todo not found');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.update(1, { done: true }))
        .rejects
        .toThrow('Failed to update todo');
    });
  });
  
  describe('delete', () => {
    
    // ✅ Positive Tests
    test('should delete existing todo', async () => {
      const result = await Todo.delete(1);
      expect(result).toBe(true);
    });
    
    test('should actually remove todo from database', async () => {
      await Todo.delete(1);
      
      // Verify it's gone
      await expect(Todo.getById(1))
        .rejects
        .toThrow('Todo not found');
    });
    
    // ❌ Negative Tests
    test('should throw error when todo not found', async () => {
      await expect(Todo.delete(999))
        .rejects
        .toThrow('Todo not found');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.delete(1))
        .rejects
        .toThrow('Failed to delete todo');
    });
  });
});
```

### 🧪 ทดสอบ

```bash
npm test Todo.test.js
```

**ผลลัพธ์:**
```
PASS  tests/unit/Todo.test.js
  Todo Model
    getAll
      ✓ should return all todos
      ✓ should return todos with correct structure
      ✓ should throw error when database fails
    getById
      ✓ should return todo by ID
      ✓ should return correct todo data
      ✓ should throw error when todo not found
      ✓ should throw error when database fails
    ...

Tests: 18 passed, 18 total
```

---

## 🚨 Challenge 2: Test Error Handling

### โจทย์

เขียน tests สำหรับ error scenarios ต่าง ๆ

### ✅ เฉลย

**สร้าง `src/utils/errorHandler.js`:**

```javascript
// src/utils/errorHandler.js

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle database errors
 */
function handleDatabaseError(error) {
  // Connection error
  if (error.code === 'ECONNREFUSED') {
    return new AppError(
      'Database connection failed',
      503,
      'DB_CONNECTION_ERROR'
    );
  }
  
  // Duplicate key error
  if (error.code === 'ER_DUP_ENTRY') {
    return new AppError(
      'Duplicate entry',
      409,
      'DUPLICATE_ENTRY'
    );
  }
  
  // Foreign key constraint error
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return new AppError(
      'Referenced record not found',
      400,
      'FOREIGN_KEY_ERROR'
    );
  }
  
  // Timeout error
  if (error.code === 'ETIMEDOUT') {
    return new AppError(
      'Database operation timeout',
      504,
      'DB_TIMEOUT'
    );
  }
  
  // Unknown database error
  return new AppError(
    'Database error',
    500,
    'DB_ERROR'
  );
}

/**
 * Handle validation errors
 */
function handleValidationError(errors) {
  const message = errors.map(e => e.message).join(', ');
  return new AppError(message, 422, 'VALIDATION_ERROR');
}

/**
 * Handle not found error
 */
function handleNotFoundError(resource) {
  return new AppError(
    `${resource} not found`,
    404,
    'NOT_FOUND'
  );
}

/**
 * Handle authentication error
 */
function handleAuthError() {
  return new AppError(
    'Authentication required',
    401,
    'UNAUTHORIZED'
  );
}

/**
 * Handle authorization error
 */
function handleForbiddenError() {
  return new AppError(
    'Access forbidden',
    403,
    'FORBIDDEN'
  );
}

module.exports = {
  AppError,
  handleDatabaseError,
  handleValidationError,
  handleNotFoundError,
  handleAuthError,
  handleForbiddenError
};
```

**สร้าง `tests/unit/errorHandler.test.js`:**

```javascript
// tests/unit/errorHandler.test.js
const {
  AppError,
  handleDatabaseError,
  handleValidationError,
  handleNotFoundError,
  handleAuthError,
  handleForbiddenError
} = require('../../src/utils/errorHandler');

describe('Error Handler', () => {
  
  describe('AppError', () => {
    
    test('should create error with correct properties', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
    });
    
    test('should be instance of Error', () => {
      const error = new AppError('Test', 500, 'TEST');
      expect(error).toBeInstanceOf(Error);
    });
    
    test('should have stack trace', () => {
      const error = new AppError('Test', 500, 'TEST');
      expect(error.stack).toBeDefined();
    });
  });
  
  describe('handleDatabaseError', () => {
    
    // Connection errors
    test('should handle connection refused', () => {
      const dbError = { code: 'ECONNREFUSED' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Database connection failed');
      expect(error.statusCode).toBe(503);
      expect(error.code).toBe('DB_CONNECTION_ERROR');
    });
    
    // Duplicate entry
    test('should handle duplicate entry', () => {
      const dbError = { code: 'ER_DUP_ENTRY' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Duplicate entry');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('DUPLICATE_ENTRY');
    });
    
    // Foreign key constraint
    test('should handle foreign key error', () => {
      const dbError = { code: 'ER_NO_REFERENCED_ROW' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Referenced record not found');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('FOREIGN_KEY_ERROR');
    });
    
    // Timeout
    test('should handle timeout error', () => {
      const dbError = { code: 'ETIMEDOUT' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Database operation timeout');
      expect(error.statusCode).toBe(504);
      expect(error.code).toBe('DB_TIMEOUT');
    });
    
    // Unknown error
    test('should handle unknown database error', () => {
      const dbError = { code: 'UNKNOWN_ERROR' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Database error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DB_ERROR');
    });
    
    test('should handle error without code', () => {
      const dbError = { message: 'Some error' };
      const error = handleDatabaseError(dbError);
      
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DB_ERROR');
    });
  });
  
  describe('handleValidationError', () => {
    
    test('should handle single validation error', () => {
      const errors = [{ message: 'Email is required' }];
      const error = handleValidationError(errors);
      
      expect(error.message).toBe('Email is required');
      expect(error.statusCode).toBe(422);
      expect(error.code).toBe('VALIDATION_ERROR');
    });
    
    test('should handle multiple validation errors', () => {
      const errors = [
        { message: 'Email is required' },
        { message: 'Password is too short' }
      ];
      const error = handleValidationError(errors);
      
      expect(error.message).toBe('Email is required, Password is too short');
      expect(error.statusCode).toBe(422);
    });
    
    test('should handle empty errors array', () => {
      const errors = [];
      const error = handleValidationError(errors);
      
      expect(error.message).toBe('');
      expect(error.statusCode).toBe(422);
    });
  });
  
  describe('handleNotFoundError', () => {
    
    test('should create not found error', () => {
      const error = handleNotFoundError('User');
      
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
    
    test('should work with different resource names', () => {
      expect(handleNotFoundError('Todo').message).toBe('Todo not found');
      expect(handleNotFoundError('Product').message).toBe('Product not found');
    });
  });
  
  describe('handleAuthError', () => {
    
    test('should create authentication error', () => {
      const error = handleAuthError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });
  });
  
  describe('handleForbiddenError', () => {
    
    test('should create authorization error', () => {
      const error = handleForbiddenError();
      
      expect(error.message).toBe('Access forbidden');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });
  });
});
```

### 🧪 ทดสอบ

```bash
npm test errorHandler.test.js
```

---

## 📅 Challenge 3: Test Date/Time Logic

### โจทย์

เขียน tests สำหรับ time-sensitive functions

### ✅ เฉลย

**สร้าง `src/utils/dateHelpers.js`:**

```javascript
// src/utils/dateHelpers.js

/**
 * Get tasks due today
 */
function getTasksDueToday(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  return todos.filter(todo => {
    if (!todo.dueDate || todo.done) {
      return false;
    }
    
    const dueDate = new Date(todo.dueDate);
    return dueDate >= todayStart && dueDate <= todayEnd;
  });
}

/**
 * Get tasks due this week
 */
function getTasksDueThisWeek(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday
  weekEnd.setHours(23, 59, 59, 999);
  
  return todos.filter(todo => {
    if (!todo.dueDate || todo.done) {
      return false;
    }
    
    const dueDate = new Date(todo.dueDate);
    return dueDate >= weekStart && dueDate <= weekEnd;
  });
}

/**
 * Get overdue tasks
 */
function getOverdueTasks(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const now = new Date();
  
  return todos.filter(todo => {
    if (!todo.dueDate || todo.done) {
      return false;
    }
    
    const dueDate = new Date(todo.dueDate);
    return dueDate < now;
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
function formatRelativeTime(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = targetDate - now;
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  const isPast = diffMs < 0;
  const prefix = isPast ? '' : 'in ';
  const suffix = isPast ? ' ago' : '';
  
  if (diffSec < 60) {
    return `${prefix}${diffSec} second${diffSec !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (diffMin < 60) {
    return `${prefix}${diffMin} minute${diffMin !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (diffHour < 24) {
    return `${prefix}${diffHour} hour${diffHour !== 1 ? 's' : ''}${suffix}`;
  }
  
  return `${prefix}${diffDay} day${diffDay !== 1 ? 's' : ''}${suffix}`;
}

/**
 * Check if date is weekend
 */
function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

module.exports = {
  getTasksDueToday,
  getTasksDueThisWeek,
  getOverdueTasks,
  formatRelativeTime,
  isWeekend
};
```

**สร้าง `tests/unit/dateHelpers.test.js`:**

```javascript
// tests/unit/dateHelpers.test.js
const {
  getTasksDueToday,
  getTasksDueThisWeek,
  getOverdueTasks,
  formatRelativeTime,
  isWeekend
} = require('../../src/utils/dateHelpers');

describe('Date Helpers', () => {
  
  describe('getTasksDueToday', () => {
    
    // Mock current date
    const mockToday = new Date('2024-06-15T10:00:00'); // Saturday
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockToday);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should return tasks due today', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-15T14:00:00', done: false },
        { task: 'Task 2', dueDate: '2024-06-16T10:00:00', done: false },
        { task: 'Task 3', dueDate: '2024-06-15T23:59:59', done: false }
      ];
      
      const result = getTasksDueToday(todos);
      
      expect(result).toHaveLength(2);
      expect(result[0].task).toBe('Task 1');
      expect(result[1].task).toBe('Task 3');
    });
    
    test('should exclude completed tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-15T14:00:00', done: true },
        { task: 'Task 2', dueDate: '2024-06-15T16:00:00', done: false }
      ];
      
      const result = getTasksDueToday(todos);
      
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Task 2');
    });
    
    // ❌ Negative Tests
    test('should return empty for non-array input', () => {
      expect(getTasksDueToday(null)).toEqual([]);
      expect(getTasksDueToday('string')).toEqual([]);
    });
    
    test('should return empty when no tasks due today', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-16T10:00:00', done: false },
        { task: 'Task 2', dueDate: '2024-06-14T10:00:00', done: false }
      ];
      
      expect(getTasksDueToday(todos)).toEqual([]);
    });
    
    // 🔍 Boundary Tests
    test('should include task at start of day', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T00:00:00', done: false }
      ];
      
      expect(getTasksDueToday(todos)).toHaveLength(1);
    });
    
    test('should include task at end of day', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T23:59:59', done: false }
      ];
      
      expect(getTasksDueToday(todos)).toHaveLength(1);
    });
  });
  
  describe('getTasksDueThisWeek', () => {
    
    const mockToday = new Date('2024-06-15T10:00:00'); // Saturday
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockToday);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should return tasks due this week', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-10T10:00:00', done: false }, // Monday
        { task: 'Task 2', dueDate: '2024-06-15T10:00:00', done: false }, // Saturday
        { task: 'Task 3', dueDate: '2024-06-17T10:00:00', done: false }  // Next week
      ];
      
      const result = getTasksDueThisWeek(todos);
      
      expect(result).toHaveLength(2);
    });
    
    test('should exclude completed tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-10T10:00:00', done: true },
        { task: 'Task 2', dueDate: '2024-06-11T10:00:00', done: false }
      ];
      
      const result = getTasksDueThisWeek(todos);
      
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Task 2');
    });
    
    // ❌ Negative Tests
    test('should return empty for non-array input', () => {
      expect(getTasksDueThisWeek(null)).toEqual([]);
    });
  });
  
  describe('getOverdueTasks', () => {
    
    const mockNow = new Date('2024-06-15T10:00:00');
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should return overdue tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-14T10:00:00', done: false },
        { task: 'Task 2', dueDate: '2024-06-16T10:00:00', done: false },
        { task: 'Task 3', dueDate: '2024-06-10T10:00:00', done: false }
      ];
      
      const result = getOverdueTasks(todos);
      
      expect(result).toHaveLength(2);
      expect(result[0].task).toBe('Task 1');
      expect(result[1].task).toBe('Task 3');
    });
    
    test('should exclude completed tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-14T10:00:00', done: true },
        { task: 'Task 2', dueDate: '2024-06-13T10:00:00', done: false }
      ];
      
      const result = getOverdueTasks(todos);
      
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Task 2');
    });
    
    // 🔍 Boundary Tests
    test('should include task due 1 minute ago', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T09:59:00', done: false }
      ];
      
      expect(getOverdueTasks(todos)).toHaveLength(1);
    });
    
    test('should not include task due in 1 minute', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T10:01:00', done: false }
      ];
      
      expect(getOverdueTasks(todos)).toHaveLength(0);
    });
  });
  
  describe('formatRelativeTime', () => {
    
    const mockNow = new Date('2024-06-15T10:00:00');
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should format seconds ago', () => {
      const date = new Date('2024-06-15T09:59:30');
      expect(formatRelativeTime(date)).toBe('30 seconds ago');
    });
    
    test('should format minutes ago', () => {
      const date = new Date('2024-06-15T09:55:00');
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });
    
    test('should format hours ago', () => {
      const date = new Date('2024-06-15T08:00:00');
      expect(formatRelativeTime(date)).toBe('2 hours ago');
    });
    
    test('should format days ago', () => {
      const date = new Date('2024-06-13T10:00:00');
      expect(formatRelativeTime(date)).toBe('2 days ago');
    });
    
    test('should format future time', () => {
      const date = new Date('2024-06-15T12:00:00');
      expect(formatRelativeTime(date)).toBe('in 2 hours');
    });
    
    test('should format future days', () => {
      const date = new Date('2024-06-18T10:00:00');
      expect(formatRelativeTime(date)).toBe('in 3 days');
    });
    
    // 🔍 Boundary Tests
    test('should handle singular units', () => {
      const date1 = new Date('2024-06-15T09:59:59');
      expect(formatRelativeTime(date1)).toBe('1 second ago');
      
      const date2 = new Date('2024-06-15T09:59:00');
      expect(formatRelativeTime(date2)).toBe('1 minute ago');
      
      const date3 = new Date('2024-06-15T09:00:00');
      expect(formatRelativeTime(date3)).toBe('1 hour ago');
    });
  });
  
  describe('isWeekend', () => {
    
    // ✅ Positive Tests
    test('should return true for Saturday', () => {
      const saturday = new Date('2024-06-15'); // Saturday
      expect(isWeekend(saturday)).toBe(true);
    });
    
    test('should return true for Sunday', () => {
      const sunday = new Date('2024-06-16'); // Sunday
      expect(isWeekend(sunday)).toBe(true);
    });
    
    test('should return false for weekdays', () => {
      const monday = new Date('2024-06-10');
      const tuesday = new Date('2024-06-11');
      const wednesday = new Date('2024-06-12');
      const thursday = new Date('2024-06-13');
      const friday = new Date('2024-06-14');
      
      expect(isWeekend(monday)).toBe(false);
      expect(isWeekend(tuesday)).toBe(false);
      expect(isWeekend(wednesday)).toBe(false);
      expect(isWeekend(thursday)).toBe(false);
      expect(isWeekend(friday)).toBe(false);
    });
  });
});
```

### 🧪 ทดสอบ

```bash
npm test dateHelpers.test.js
```

**ผลลัพธ์:**
```
PASS  tests/unit/dateHelpers.test.js
  Date Helpers
    getTasksDueToday
      ✓ should return tasks due today
      ✓ should exclude completed tasks
      ✓ should return empty for non-array input
      ...
    formatRelativeTime
      ✓ should format seconds ago
      ✓ should format minutes ago
      ✓ should format future time
      ...

Tests: 30+ passed, 30+ total
```

---

## 💡 Tips สำหรับอาจารย์

### การให้คะแนน

| Challenge | คะแนน | เกณฑ์ |
|-----------|-------|-------|
| Mock Database | 35% | Mock ถูกต้อง, tests ครอบคลุม CRUD |
| Error Handling | 30% | จัดการ error ครบ, tests ละเอียด |
| Date/Time Logic | 35% | Mock time, boundary cases |

**Bonus:**
- Coverage > 95%: +5%
- Test descriptions ชัดเจน: +5%

### Common Mistakes

**1. ไม่ reset mock data**
```javascript
// ❌ ผิด - data จาก test ก่อนหน้ายังค้างอยู่
describe('Tests', () => {
  test('test 1', () => { ... });
  test('test 2', () => { ... }); // data จาก test 1 ยังอยู่
});

// ✅ ถูก - reset ก่อน test แต่ละตัว
beforeEach(() => {
  db._reset();
});
```

**2. ไม่ mock time ในการทดสอบ date**
```javascript
// ❌ ผิด - ขึ้นกับเวลาจริง (test จะพังเมื่อเวลาผ่านไป)
test('should get tasks due today', () => {
  // ใช้ new Date() โดยตรง
});

// ✅ ถูก - mock เวลา
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-06-15'));
```

**3. ไม่ handle async errors**
```javascript
// ❌ ผิด - จะไม่จับ error
test('should throw error', async () => {
  Model.create(); // ไม่มี await
});

// ✅ ถูก - ใช้ await + expect
test('should throw error', async () => {
  await expect(Model.create()).rejects.toThrow();
});
```

---

## 🎓 สรุป

เฉลย Challenge Tasks ครอบคลุม:
- ✅ Mock Database (CRUD operations)
- ✅ Error Handling (8 error types)
- ✅ Date/Time Logic (time-sensitive functions)
- ✅ Jest mock/spy techniques
- ✅ Boundary testing
- ✅ Coverage > 95%

**Total Tests:** 70+ tests  
**รวมกับ Workshop:** 155+ tests

**พร้อมใช้สอนและให้คะแนน! 🎉**
