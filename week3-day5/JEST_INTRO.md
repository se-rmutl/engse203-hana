# 🧪 Jest: JavaScript Testing Framework

**เอกสารเสริมก่อนทำ Workshop 16**

---

## 📌 Jest คืออะไร?

**Jest** เป็น **JavaScript Testing Framework** ที่พัฒนาโดย Facebook (Meta)

### คำนิยาม

```
Jest = เครื่องมือสำหรับทดสอบโค้ด JavaScript/TypeScript
     ที่ช่วยให้มั่นใจว่าโค้ดทำงานถูกต้องตามที่คาดหวัง
```

### Analogy: การทดสอบรถยนต์

```
┌────────────────────────────────────────┐
│   โรงงานผลิตรถยนต์                      │
└────────────────────────────────────────┘

ก่อนส่งรถออกขาย ต้องทดสอบ:
✅ เครื่องยนต์ติดไหม?
✅ เบรกทำงานไหม?
✅ ไฟหน้าติดไหม?
✅ แอร์เย็นไหม?

↓

┌────────────────────────────────────────┐
│   การเขียนโปรแกรม                       │
└────────────────────────────────────────┘

ก่อน deploy โค้ด ต้องทดสอบ:
✅ ฟังก์ชันคำนวณถูกต้องไหม?
✅ API return ข้อมูลถูกไหม?
✅ Error handling ทำงานไหม?
✅ Edge cases ผ่านไหม?

→ Jest = เครื่องมือทดสอบโค้ด
```

---

## 🤔 ทำไมต้องใช้ Jest?

### ปัญหาที่เจอเมื่อไม่มี Testing

**สถานการณ์ 1: แก้โค้ดแล้วของเดิมพัง**

```javascript
// ฟังก์ชันคำนวณราคา
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ใช้งานได้ดี ✅
console.log(calculateTotal([
  { price: 100 },
  { price: 200 }
])); // 300

// สัปดาห์ต่อมา... เพิ่ม feature ส่วนลด
function calculateTotal(items, discount) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total - discount; // ⚠️ ถ้า discount = undefined จะเป็น NaN!
}

// โค้ดเดิมพัง! ❌
console.log(calculateTotal([
  { price: 100 },
  { price: 200 }
])); // NaN (เพราะไม่ส่ง discount)
```

**ถ้ามี Jest:**
```javascript
// Test เดิมจะ fail ทันที → รู้ว่าพัง → แก้ทันที!
test('should calculate total without discount', () => {
  expect(calculateTotal([
    { price: 100 },
    { price: 200 }
  ])).toBe(300); // FAIL! ได้ NaN
});
```

---

**สถานการณ์ 2: บั๊กหลุดไป Production**

```
❌ ไม่มี Test:
เขียนโค้ด → รันดูด้วยตา → ดูเหมือนโอเค → deploy
→ User เจอบั๊ก → แก้แบบเร่งด่วน → ทำงานล่วงเวลา 😢

✅ มี Jest:
เขียนโค้ด → เขียน tests → รัน tests → ผ่านหมด ✅ → deploy
→ มั่นใจว่าไม่พัง → User พอใจ → นอนหลับสบาย 😴
```

---

**สถานการณ์ 3: ไม่กล้าแก้โค้ด**

```
Developer: "อยากจะ refactor โค้ดนี้ แต่กลัวพัง..."

❌ ไม่มี Test:
→ ไม่กล้าแก้
→ โค้ดยุ่งเหยิงขึ้นเรื่อย ๆ
→ Technical debt สูงขึ้น

✅ มี Jest:
→ แก้โค้ดเลย
→ รัน tests ถ้าผ่าน = ไม่พัง ✅
→ Refactor ได้อย่างมั่นใจ
```

---

## ✨ Jest มีประโยชน์อย่างไร?

### 1. จับบั๊กก่อนถึง User 🐛

```javascript
function divide(a, b) {
  return a / b; // ⚠️ ถ้า b = 0 จะได้ Infinity!
}

// Test จะจับได้
test('should handle division by zero', () => {
  expect(divide(10, 0)).toBe(Infinity); // เตือนว่าควร handle
});

// แก้ไข
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
```

**ประโยชน์:**
- 🛡️ ป้องกันบั๊กก่อนถึง production
- 💰 ประหยัดเวลาและค่าใช้จ่าย (แก้บั๊กตอนพัฒนาถูกกว่าแก้ตอน production 10-100 เท่า!)

---

### 2. เป็นเอกสาร (Documentation) 📝

```javascript
// อ่านโค้ดเฉย ๆ อาจไม่รู้ว่าทำอะไร
function calculateDiscount(price, userType) {
  return userType === 'vip' ? price * 0.8 : price * 0.9;
}

// แต่ถ้าอ่าน tests จะเข้าใจทันที!
test('VIP users get 20% discount', () => {
  expect(calculateDiscount(100, 'vip')).toBe(80);
});

test('Regular users get 10% discount', () => {
  expect(calculateDiscount(100, 'regular')).toBe(90);
});

// → รู้เลยว่า VIP ลด 20%, ปกติลด 10%
```

**ประโยชน์:**
- 📚 Test = เอกสารที่ "รันได้" และ "ไม่มีวันเก่า"
- 🤝 ช่วยให้คนอื่นเข้าใจโค้ดเราได้เร็วขึ้น

---

### 3. Refactor ได้อย่างมั่นใจ 🔧

```javascript
// โค้ดแบบเก่า (ยุ่งเหยิง)
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

// มี tests
test('should calculate total correctly', () => {
  const items = [{ price: 100 }, { price: 200 }];
  expect(calculateTotal(items)).toBe(300);
});

// → มั่นใจแก้เป็นแบบใหม่ได้!
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// รัน test อีกครั้ง → ผ่าน! ✅ → Refactor สำเร็จ
```

**ประโยชน์:**
- 🚀 กล้าปรับปรุงโค้ดให้ดีขึ้น
- 🎯 มั่นใจว่าไม่พังของเดิม

---

### 4. ทำงานเป็นทีมได้ง่ายขึ้น 👥

```
สถานการณ์:
- Alice เขียน feature A (เสร็จแล้ว + มี tests)
- Bob เขียน feature B (ใช้โค้ดของ Alice)

ถ้า Bob แก้โค้ดของ Alice (ไม่ได้ตั้งใจ):
→ Tests ของ Alice จะ fail ทันที! ❌
→ Bob รู้ว่าทำอะไรพัง
→ แก้ก่อน merge
→ ไม่มีปัญหา! ✅
```

**ประโยชน์:**
- 🤝 ลดความขัดแย้งในทีม
- ⚡ Integration ได้เร็วขึ้น

---

### 5. CI/CD Integration 🤖

```
┌─────────────────────────────────────┐
│   CI/CD Pipeline with Jest          │
└─────────────────────────────────────┘

1. Developer push code
   ↓
2. Run Jest tests automatically
   ↓
3. Tests passed? 
   ├─ ✅ YES → Deploy to production
   └─ ❌ NO  → Block deployment (ไม่ให้ deploy โค้ดที่พัง!)
```

**ประโยชน์:**
- 🛡️ ป้องกันโค้ดที่พังไป production
- 🤖 Automated testing (ไม่ต้องทดสอบด้วยมือ)

---

## 🆚 Jest vs Testing Framework อื่น

### เปรียบเทียบ

| Feature | Jest | Mocha | Jasmine | Vitest |
|---------|------|-------|---------|--------|
| **Setup** | ⚡ ง่ายมาก | 🔧 ต้อง setup เอง | 🔧 ปานกลาง | ⚡ ง่าย |
| **Speed** | ⚡⚡ เร็ว | ⚡ ปานกลาง | ⚡ ปานกลาง | ⚡⚡⚡ เร็วมาก |
| **Mocking** | ✅ Built-in | ❌ ต้องติดตั้งเพิ่ม | ✅ Built-in | ✅ Built-in |
| **Coverage** | ✅ Built-in | ❌ ต้องติดตั้งเพิ่ม | ❌ ต้องติดตั้งเพิ่ม | ✅ Built-in |
| **Snapshot** | ✅ Built-in | ❌ ไม่มี | ❌ ไม่มี | ✅ Built-in |
| **Learning Curve** | 📚 ง่าย | 📚📚 ปานกลาง | 📚 ง่าย | 📚 ง่าย |

### ทำไมเลือก Jest?

**1. Zero Configuration**
```bash
# Jest: ติดตั้งแล้วใช้ได้เลย!
npm install --save-dev jest
npm test

# Mocha: ต้อง setup เยอะ
npm install --save-dev mocha chai sinon istanbul
# + ต้องเขียน config file
# + ต้อง setup assertion library
# + ต้อง setup mocking library
```

**2. All-in-One**
```
Jest มีครบ:
✅ Test Runner
✅ Assertion Library
✅ Mocking
✅ Coverage
✅ Snapshot Testing

อื่น ๆ: ต้องติดตั้งแยก
```

**3. Great Developer Experience**
```
✅ Error messages ชัดเจน
✅ Watch mode ดีมาก
✅ Fast feedback
✅ Easy to learn
```

**4. Popular & Well-Maintained**
```
⭐ 44k+ stars on GitHub
📦 20M+ downloads/week
🏢 ใช้โดย: Facebook, Airbnb, Uber, Netflix
```

---

## 🎯 แนวคิดพื้นฐานของ Jest

### 1. Test Suite & Test Case

```javascript
// Test Suite = กลุ่มของ tests ที่เกี่ยวข้องกัน
describe('Calculator', () => {
  
  // Test Case = การทดสอบหนึ่ง ๆ
  test('should add two numbers', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('should subtract two numbers', () => {
    expect(5 - 3).toBe(2);
  });
});
```

**Analogy:**
```
Test Suite = ตู้เก็บของ 🗄️
Test Case = ของในตู้แต่ละชิ้น 📦

describe('Kitchen Utensils') {  ← ตู้เครื่องครัว
  test('knife is sharp')        ← มีดคม
  test('spoon is clean')        ← ช้อนสะอาด
  test('fork has 4 prongs')     ← ส้อมมี 4 ง่าม
}
```

---

### 2. Matchers (เครื่องมือตรวจสอบ)

```javascript
// toBe() - เหมือนกันทุกอย่าง (===)
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// toEqual() - เนื้อหาเหมือนกัน (สำหรับ object/array)
expect({ name: 'John' }).toEqual({ name: 'John' });

// toBeTruthy() / toBeFalsy()
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();

// toContain() - มีสมาชิก
expect([1, 2, 3]).toContain(2);
expect('hello world').toContain('world');

// toThrow() - โยน error
expect(() => {
  throw new Error('Oops!');
}).toThrow('Oops!');
```

**Analogy: ไม้บรรทัด 📏**
```
Matchers = ไม้บรรทัดที่ใช้วัด

toBe()       = วัดว่าเท่ากันพอดีไหม
toEqual()    = วัดว่าขนาดเท่ากันไหม (ไม่สนใจว่าเป็นอันเดียวกันหรือไม่)
toBeGreaterThan() = วัดว่ามากกว่าไหม
toContain()  = วัดว่ามีอยู่ในนี้ไหม
```

---

### 3. Setup & Teardown

```javascript
describe('Database Tests', () => {
  
  // รันก่อน test ทุกตัว
  beforeEach(() => {
    database.connect();
    database.clear();
  });
  
  // รันหลัง test ทุกตัว
  afterEach(() => {
    database.disconnect();
  });
  
  test('should insert record', () => {
    database.insert({ name: 'John' });
    expect(database.count()).toBe(1);
  });
  
  test('should delete record', () => {
    database.insert({ name: 'John' });
    database.delete(1);
    expect(database.count()).toBe(0);
  });
});
```

**Analogy: ร้านอาหาร 🍽️**
```
beforeEach()  = เตรียมโต๊ะก่อนลูกค้ามา (ปูผ้า, จัดช้อนส้อม)
test()        = ลูกค้ามากินข้าว
afterEach()   = เก็บโต๊ะหลังลูกค้าไป (ล้างจาน, เช็ดโต๊ะ)

→ ทุกครั้งที่มีลูกค้าใหม่ โต๊ะสะอาดเสมอ!
```

---

### 4. Mocking (ปลอม)

```javascript
// สมมติว่ามีฟังก์ชันส่ง email (ใช้เวลานาน + ต้อง internet)
async function sendEmail(to, subject, body) {
  // ... API call to email service
}

// Test จะส่ง email จริงทุกครั้งหรือ? → ไม่ดี!
// วิธีแก้: Mock มัน!

const mockSendEmail = jest.fn();

test('should send welcome email', async () => {
  // ใช้ mock แทนของจริง
  mockSendEmail.mockResolvedValue({ success: true });
  
  await sendWelcomeEmail('user@test.com');
  
  // ตรวจสอบว่าถูกเรียกไหม
  expect(mockSendEmail).toHaveBeenCalledWith(
    'user@test.com',
    'Welcome!',
    expect.any(String)
  );
});
```

**Analogy: ตุ๊กตาฝึกหัด 🎯**
```
Mock = ตุ๊กตาฝึกหัด

Real:
- ฝึกกับคนจริง
- ถ้าชกแรง คนจริงเจ็บ ❌
- เสี่ยงอันตราย ❌

Mock:
- ฝึกกับตุ๊กตา
- ชกแรงแค่ไหนก็ได้ ✅
- ปลอดภัย ✅
- ฝึกได้บ่อย ๆ ✅
```

---

### 5. Coverage (ความครอบคลุม)

```javascript
// โค้ด
function calculateDiscount(price, isMember) {
  if (isMember) {
    return price * 0.9;  // บรรทัดที่ 3
  }
  return price;          // บรรทัดที่ 5
}

// Test 1: ทดสอบแค่ isMember = true
test('member gets discount', () => {
  expect(calculateDiscount(100, true)).toBe(90);
});

// Coverage Report:
// ✅ บรรทัดที่ 3 ถูก test
// ❌ บรรทัดที่ 5 ไม่ถูก test
// → Coverage = 75%

// Test 2: เพิ่มทดสอบ isMember = false
test('non-member pays full price', () => {
  expect(calculateDiscount(100, false)).toBe(100);
});

// Coverage Report:
// ✅ บรรทัดที่ 3 ถูก test
// ✅ บรรทัดที่ 5 ถูก test
// → Coverage = 100%
```

**Analogy: แผนที่สมบัติ 🗺️**
```
Coverage = แผนที่ที่บอกว่าโค้ดส่วนไหนถูกทดสอบแล้ว

เขียวๆ = ถูก test แล้ว ✅
แดงๆ   = ยังไม่ถูก test ❌

→ มองเห็นได้ชัดเจนว่าต้องเขียน test เพิ่มตรงไหน
```

---

## 🎨 ตัวอย่างจากง่ายไปยาก

### ระดับ 1: Function ง่าย ๆ

```javascript
// ฟังก์ชันที่จะทดสอบ
function add(a, b) {
  return a + b;
}

// Test
test('should add two numbers', () => {
  // Arrange (เตรียม)
  const a = 2;
  const b = 3;
  
  // Act (ทำ)
  const result = add(a, b);
  
  // Assert (ตรวจสอบ)
  expect(result).toBe(5);
});
```

---

### ระดับ 2: มี Validation

```javascript
// ฟังก์ชันที่มี validation
function validateAge(age) {
  if (age < 0) {
    throw new Error('Age cannot be negative');
  }
  if (age > 150) {
    throw new Error('Age is too high');
  }
  return true;
}

// Tests
describe('validateAge', () => {
  // ✅ Positive test
  test('should accept valid age', () => {
    expect(validateAge(25)).toBe(true);
  });
  
  // ❌ Negative tests
  test('should reject negative age', () => {
    expect(() => validateAge(-1)).toThrow('Age cannot be negative');
  });
  
  test('should reject too high age', () => {
    expect(() => validateAge(200)).toThrow('Age is too high');
  });
  
  // 🔍 Boundary tests
  test('should accept age 0', () => {
    expect(validateAge(0)).toBe(true);
  });
  
  test('should accept age 150', () => {
    expect(validateAge(150)).toBe(true);
  });
});
```

---

### ระดับ 3: Async Function

```javascript
// ฟังก์ชัน async
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
}

// Test (วิธีที่ 1: async/await)
test('should fetch user by id', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});

// Test (วิธีที่ 2: resolves)
test('should fetch user by id', () => {
  return expect(fetchUser(1)).resolves.toHaveProperty('name', 'John');
});
```

---

### ระดับ 4: Mock Dependencies

```javascript
// ฟังก์ชันที่ต้องเรียก database
const database = require('./database');

async function createUser(name, email) {
  // ตรวจสอบ email ซ้ำ
  const existing = await database.findByEmail(email);
  if (existing) {
    throw new Error('Email already exists');
  }
  
  // สร้าง user
  const user = await database.insert({ name, email });
  return user;
}

// Test (Mock database)
jest.mock('./database');

test('should create user', async () => {
  // Mock: findByEmail ไม่เจอ
  database.findByEmail.mockResolvedValue(null);
  
  // Mock: insert สำเร็จ
  database.insert.mockResolvedValue({ id: 1, name: 'John', email: 'john@test.com' });
  
  const user = await createUser('John', 'john@test.com');
  
  expect(user.name).toBe('John');
  expect(database.insert).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@test.com'
  });
});

test('should throw error for duplicate email', async () => {
  // Mock: findByEmail เจอ user เดิม
  database.findByEmail.mockResolvedValue({ id: 1, email: 'john@test.com' });
  
  await expect(createUser('John', 'john@test.com'))
    .rejects
    .toThrow('Email already exists');
});
```

---

## 🚀 เริ่มต้นใช้ Jest

### 1. ติดตั้ง

```bash
npm install --save-dev jest
```

### 2. เพิ่ม script ใน package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3. เขียน test แรก

```javascript
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```javascript
// math.test.js
const { add } = require('./math');

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
```

### 4. รัน test

```bash
npm test
```

**ผลลัพธ์:**
```
PASS  ./math.test.js
  ✓ adds 1 + 2 to equal 3 (2ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.234s
```

---

## 📊 Jest Workflow

```
┌─────────────────────────────────────┐
│        Jest Testing Workflow        │
└─────────────────────────────────────┘

1. เขียนโค้ด
   ↓
2. เขียน test
   ↓
3. รัน test
   ↓
4. Tests ผ่านหมด?
   ├─ ✅ YES → Done! ✨
   └─ ❌ NO  → 
        ↓
      5. อ่าน error message
        ↓
      6. Debug & แก้โค้ด
        ↓
      7. รัน test อีกครั้ง
        ↓
      วนกลับไปข้อ 4
```

---

## 🎯 Best Practices

### 1. เขียน Test ที่มีชื่อชัดเจน

```javascript
// ❌ แย่
test('test 1', () => { ... });

// ✅ ดี
test('should return 400 when email is invalid', () => { ... });
```

### 2. AAA Pattern

```javascript
test('should calculate discount', () => {
  // Arrange - เตรียมข้อมูล
  const price = 100;
  const discount = 0.1;
  
  // Act - ทำสิ่งที่จะทดสอบ
  const result = calculatePrice(price, discount);
  
  // Assert - ตรวจสอบผล
  expect(result).toBe(90);
});
```

### 3. Test One Thing at a Time

```javascript
// ❌ แย่ - test หลายอย่างในครั้งเดียว
test('user functions work', () => {
  expect(createUser()).toBeTruthy();
  expect(deleteUser()).toBeTruthy();
  expect(updateUser()).toBeTruthy();
});

// ✅ ดี - แยก test
test('should create user', () => {
  expect(createUser()).toBeTruthy();
});

test('should delete user', () => {
  expect(deleteUser()).toBeTruthy();
});

test('should update user', () => {
  expect(updateUser()).toBeTruthy();
});
```

### 4. Don't Test Implementation Details

```javascript
// ❌ แย่ - test implementation
test('should call internal method', () => {
  const spy = jest.spyOn(obj, '_internalMethod');
  obj.publicMethod();
  expect(spy).toHaveBeenCalled(); // ไม่ควร test private method
});

// ✅ ดี - test behavior
test('should return correct result', () => {
  const result = obj.publicMethod();
  expect(result).toBe(expected); // test ผลลัพธ์ที่เห็นได้
});
```

---

## 💡 เคล็ดลับสำหรับมือใหม่

### 1. เริ่มจากง่าย ๆ

```
อย่าเขียน test ทุกอย่างตั้งแต่แรก!

เริ่มจาก:
1️⃣ ฟังก์ชันที่สำคัญที่สุด (critical path)
2️⃣ ฟังก์ชันที่ซับซ้อน (complex logic)
3️⃣ ฟังก์ชันที่เคยมีบั๊ก (bug-prone areas)

แล้วค่อย ๆ เพิ่มไป
```

### 2. ใช้ Watch Mode

```bash
npm test -- --watch
```

```
→ Jest จะ auto-run ทุกครั้งที่บันทึกไฟล์
→ Feedback เร็ว
→ Productive!
```

### 3. อ่าน Error Messages

```
Jest error messages ชัดเจนมาก!

Expected: 5
Received: 4

  3 |   const result = add(2, 2);
  4 |
> 5 |   expect(result).toBe(5);
    |                  ^
  6 | });

→ บอกชัดเจนว่าคาดหวัง 5 แต่ได้ 4
→ บอกบรรทัดที่ผิด
```

### 4. ใช้ Coverage เป็นเครื่องมือ ไม่ใช่เป้าหมาย

```
❌ เป้าหมายผิด: "ต้องได้ 100% coverage!"
✅ เป้าหมายถูก: "test ส่วนสำคัญให้ครบถ้วน"

Coverage 70-80% + test ส่วนสำคัญครบ
> Coverage 100% แต่ test ไม่มีคุณภาพ
```

---

## 🔗 เชื่อมโยงกับ Workshop 16

ใน Workshop 16 เราจะ:

1. **Setup Jest** ✅
   - Configuration
   - Scripts
   - Test structure

2. **เขียน Tests จริง** ✅
   - Validation logic (25 tests)
   - Business rules (35 tests)
   - Data processing (30 tests)

3. **ใช้ Mocking** ✅
   - Mock database
   - Mock time
   - Mock external services

4. **ดู Coverage** ✅
   - Coverage report
   - Identify untested code

**พร้อมแล้ว?** → ไปเริ่ม [Workshop 16](./README.md) กันเลย! 🚀

---

## 📚 Resources

### Official Docs
- [Jest Official Website](https://jestjs.io/)
- [Getting Started Guide](https://jestjs.io/docs/getting-started)

### Video Tutorials
- [Jest Crash Course - Traversy Media](https://www.youtube.com/watch?v=7r4xVDI2vho)
- [Testing JavaScript with Jest - freeCodeCamp](https://www.youtube.com/watch?v=8gHEv5iNRKk)

### Cheat Sheets
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

---

## 🎓 สรุป

### Jest คือ?
✅ JavaScript Testing Framework ที่ดีที่สุดตัวหนึ่ง

### ทำไมต้องใช้?
✅ จับบั๊กก่อนถึง user  
✅ เป็นเอกสาร  
✅ Refactor ได้มั่นใจ  
✅ ทำงานทีมได้ง่าย  

### มีประโยชน์อย่างไร?
✅ ประหยัดเวลาและเงิน  
✅ Code quality ดีขึ้น  
✅ มั่นใจในโค้ดที่เขียน  

### เริ่มต้นยังไง?
1. `npm install --save-dev jest`
2. เขียน test แรก
3. `npm test`
4. ✨ Magic!

---

**พร้อมหรือยัง?** → [เริ่ม Workshop 16 เลย!](./README.md) 🧪
