# 📊 Workshop 16: Unit Testing - สรุป

## ✅ สิ่งที่สร้างเสร็จแล้ว

### 📁 ไฟล์ที่สร้าง

1. **README.md** - Workshop 16 Level 1 Guided
   - Unit Testing with Jest
   - 5 Steps (Setup → Coverage)
   - Code ครบ 100%
   - 85+ tests

2. **CHALLENGE_SOLUTIONS.md** - เฉลย 3 Challenges
   - Challenge 1: Test Todo Model (with Mock)
   - Challenge 2: Test Error Handling
   - Challenge 3: Test Date/Time Logic
   - 70+ tests เพิ่มเติม

---

## 📋 เนื้อหาที่ครอบคลุม

### Workshop Content

**Step 1: Setup Jest**
- ติดตั้ง Jest
- Configuration
- Scripts
- Test setup file

**Step 2: Validation Logic & Tests**
- validateTask()
- isValidPriority()
- validateDueDate()
- validateTodo()
- 25 tests (positive/negative/boundary)

**Step 3: Business Rules & Tests**
- canMarkAsDone()
- isOverdue()
- calculateCompletionRate()
- getPriorityScore()
- isDueSoon()
- 30 tests

**Step 4: Data Processing & Tests**
- filterTodosByStatus()
- sortTodosByPriority()
- searchTodos()
- groupTodosByPriority()
- paginateTodos()
- 30 tests

**Step 5: Coverage Report**
- Coverage configuration
- HTML report
- Coverage thresholds (70%)

---

## 🎯 Challenge Tasks

### Challenge 1: Mock Database
**เนื้อหา:**
- สร้าง mock database
- Test CRUD operations
- Mock database errors
- 18 tests

**เทคนิค:**
- `jest.mock()`
- Custom mock implementation
- Async/await testing
- Error simulation

### Challenge 2: Error Handling
**เนื้อหา:**
- AppError class
- Database error handling
- Validation error handling
- 15 tests

**Error Types:**
- Connection errors
- Duplicate entry
- Foreign key constraint
- Timeout
- Not found
- Auth/Authorization

### Challenge 3: Date/Time Logic
**เนื้อหา:**
- getTasksDueToday()
- getTasksDueThisWeek()
- getOverdueTasks()
- formatRelativeTime()
- isWeekend()
- 35 tests

**เทคนิค:**
- `jest.useFakeTimers()`
- `jest.setSystemTime()`
- Boundary testing with dates
- Relative time formatting

---

## 📊 สถิติ

| รายการ | จำนวน |
|--------|-------|
| **ไฟล์ทั้งหมด** | 2 ไฟล์ |
| **รวมคำ** | ~15,000 คำ |
| **Steps** | 5 steps |
| **Tests (Workshop)** | 85 tests |
| **Tests (Challenges)** | 70 tests |
| **Total Tests** | 155 tests |
| **Coverage Target** | 70%+ |

---

## 🎯 Learning Outcomes

นักศึกษาจะได้เรียนรู้:

**1. Testing Fundamentals**
- ✅ Jest setup และ configuration
- ✅ Test file structure
- ✅ Test lifecycle (beforeEach, afterEach)

**2. Test Case Design**
- ✅ Positive tests (happy path)
- ✅ Negative tests (error cases)
- ✅ Boundary tests (edge cases)
- ✅ Equivalence partitioning

**3. Mock & Stub**
- ✅ Mock functions (`jest.fn()`)
- ✅ Mock modules (`jest.mock()`)
- ✅ Mock timers (`jest.useFakeTimers()`)
- ✅ Spy functions (`jest.spyOn()`)

**4. Async Testing**
- ✅ Testing async/await
- ✅ Testing promises
- ✅ Testing rejections
- ✅ Timeout handling

**5. Coverage**
- ✅ Line coverage
- ✅ Branch coverage
- ✅ Function coverage
- ✅ Coverage thresholds

---

## 💡 Key Concepts

### Test Structure (AAA Pattern)

```javascript
test('description', () => {
  // Arrange - setup
  const input = 'test';
  
  // Act - execute
  const result = functionUnderTest(input);
  
  // Assert - verify
  expect(result).toBe(expected);
});
```

### Matchers

```javascript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);

// Strings
expect(string).toMatch(/pattern/);

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

### Mock Patterns

```javascript
// Mock function
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue(data);
mockFn.mockRejectedValue(error);

// Spy on existing function
jest.spyOn(object, 'method');

// Check calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(2);

// Mock module
jest.mock('./module', () => ({
  function: jest.fn()
}));

// Mock time
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-01'));
jest.useRealTimers();
```

---

## 🎓 Best Practices

### 1. Test Naming

```javascript
// ✅ Good - descriptive
test('should return user when ID exists', () => {});

// ❌ Bad - vague
test('get user', () => {});
```

### 2. One Assertion Per Test

```javascript
// ✅ Good
test('should return correct name', () => {
  expect(user.name).toBe('John');
});

test('should return correct age', () => {
  expect(user.age).toBe(30);
});

// ⚠️ Acceptable - related assertions
test('should return complete user object', () => {
  expect(user.name).toBe('John');
  expect(user.age).toBe(30);
  expect(user.email).toBe('john@test.com');
});
```

### 3. Setup/Teardown

```javascript
// Setup before each test
beforeEach(() => {
  database.reset();
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

### 4. Don't Test Implementation

```javascript
// ❌ Bad - testing implementation
test('should call internal method', () => {
  expect(obj._internalMethod).toHaveBeenCalled();
});

// ✅ Good - testing behavior
test('should return correct result', () => {
  expect(obj.publicMethod()).toBe(expected);
});
```

---

## 📍 Location

```
/week2-day5/workshop-16-unit-testing/level-1-guided/
├── README.md
└── solutions/
    └── CHALLENGE_SOLUTIONS.md
```

---

## 🔗 ความเชื่อมโยง

**ใช้ร่วมกับ:**
- Workshop 14 (SQLite API) - ทดสอบ logic
- Workshop 15 (MongoDB API) - ทดสอบ logic
- Day 5 Theory (README.md) - Testing concepts

**ต่อไปที่:**
- Workshop 17: API Testing
- Workshop 18: Git Collaboration

---

**พร้อมใช้สอนได้เลย! 🧪**
