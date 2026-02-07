# 📚 DAY 5: Testing + Quality + Git Collaboration

**ระยะเวลาสอน:** 1 ชั่วโมง (09:00-10:00)  
**รูปแบบ:** Lecture + Demo + Discussion

---

## 🎯 เป้าหมายการเรียนรู้

หลังจากเรียนเนื้อหานี้ นักศึกษาจะสามารถ:
1. อธิบาย **Testing Pyramid** และเลือกประเภทการทดสอบที่เหมาะสม
2. ออกแบบ **test cases** ที่ครอบคลุม (positive, negative, boundary)
3. เขียน **unit tests** และใช้ mock/stub ได้
4. ทำ **API testing** และสร้าง quality checklist
5. ใช้ **Git workflow** แบบทีม (branch, PR, review, conflict resolution)

---

## 📋 เนื้อหาแบ่งเป็น 4 ส่วน

```
┌───────────────────────────────────────┐
│  1. Testing Fundamentals (15 นาที)     │
│  2. Test Case Design (15 นาที)         │
│  3. API Testing & Quality (15 นาที)    │
│  4. Git Team Workflow (15 นาที)        │
└───────────────────────────────────────┘
```

---

# 1️⃣ Testing Fundamentals (15 นาที)

## 🤔 ทำไมต้องเทส?

### สถานการณ์จริง

**ก่อนมีการทดสอบ:**
```
Developer: "รันได้แล้ว ship เลย!" ✅
[3 เดือนต่อมา...]
User: "ระบบล่มตอนกรอกชื่อภาษาไทย" ❌
User: "ยอดเงินคำนวณผิด" ❌
User: "ลบไม่ได้" ❌
```

**หลังมีการทดสอบ:**
```
Developer: "เขียนโค้ดเสร็จ → รัน tests → ผ่านหมด ✅"
[3 เดือนต่อมา...]
User: "ระบบใช้งานดีมาก!" ✅
Developer: "แก้โค้ด → รัน tests → มั่นใจว่าไม่พัง!" ✅
```

### ข้อดีของการเทส

| ข้อดี | คำอธิบาย |
|-------|----------|
| 🛡️ **ป้องกันบั๊ก** | จับบั๊กก่อนถึงมือ user |
| 💰 **ประหยัดเวลา** | แก้บั๊กตอนพัฒนาถูกกว่าแก้ตอน production |
| 📝 **เป็นเอกสาร** | Test = เอกสารที่บอกว่าโค้ดทำอะไร |
| 🔄 **Refactor ได้** | แก้โค้ดแล้วรัน test รู้ทันทีว่าพังหรือไม่ |
| 😴 **นอนหลับสบาย** | มั่นใจว่าโค้ดทำงานถูกต้อง |

---

## 🏔️ Testing Pyramid

### แนวคิด

```
              ┌──────────┐
             /  E2E Tests  \        ← น้อย, ช้า, แพง
            /  Integration  \       ← ปานกลาง
           /   Unit Tests     \     ← เยอะ, เร็ว, ถูก
          /____________________\
```

### คำอธิบาย

**1. Unit Tests (ฐานของปิรามิด)**
- **คืออะไร:** ทดสอบ function/method เดี่ยว ๆ
- **ตัวอย่าง:** ทดสอบ `calculateTotal(items)`
- **เขียนเยอะ:** 70% ของ tests ทั้งหมด
- **ข้อดี:** เร็ว, ทดสอบง่าย, debug ง่าย

**2. Integration Tests (กลางปิรามิด)**
- **คืออะไร:** ทดสอบการทำงานร่วมกันของหลายส่วน
- **ตัวอย่าง:** ทดสอบ API endpoint ที่เชื่อมกับ database
- **เขียนปานกลาง:** 20% ของ tests ทั้งหมด
- **ข้อดี:** จับปัญหาการเชื่อมต่อระหว่างส่วนต่าง ๆ

**3. E2E Tests (ยอดปิรามิด)**
- **คืออะไร:** ทดสอบทั้งระบบจาก user perspective
- **ตัวอย่าง:** ทดสอบ user login → browse products → checkout
- **เขียนน้อย:** 10% ของ tests ทั้งหมด
- **ข้อดี:** มั่นใจว่าทั้งระบบทำงานร่วมกันได้

---

## 🎯 เทสอะไรก่อน?

### กฎ 80/20

**ทดสอบ 20% ของโค้ดที่สำคัญที่สุด → ได้ผล 80%**

### ลำดับความสำคัญ

```
1. ⚠️  Critical Path (ถ้าพังกระทบหนัก)
   ├─ การคำนวณเงิน
   ├─ การยืนยันตัวตน
   └─ การทำธุรกรรม

2. 🔄 Business Logic ที่ซับซ้อน
   ├─ การคำนวณส่วนลด
   ├─ การตรวจสอบสิทธิ์
   └─ การจัดการสถานะ

3. 🐛 ส่วนที่เคยมีบั๊กบ่อย
   └─ ส่วนที่ user รายงานบั๊กซ้ำ ๆ

4. 🔧 Utility Functions
   └─ ฟังก์ชันที่ใช้บ่อย ใช้หลายที่
```

### ตัวอย่างจริง: E-commerce

```javascript
// ✅ ต้องเทส (Critical!)
function calculateTotal(items, discountCode) {
  // คำนวณราคารวม + ส่วนลด
}

function processPayment(cardInfo, amount) {
  // ประมวลผลการชำระเงิน
}

// ⚠️ ควรเทส (Business Logic)
function checkInventory(productId, quantity) {
  // ตรวจสอบสต็อก
}

// 💡 เทสถ้ามีเวลา
function formatProductName(name) {
  // จัดรูปแบบชื่อสินค้า
}
```

---

## 📊 Unit vs Integration vs E2E

### เปรียบเทียบ

| ประเภท | ความเร็ว | ค่าใช้จ่าย | ความซับซ้อน | เขียนง่าย | Debug ง่าย |
|--------|----------|-----------|------------|-----------|-----------|
| **Unit** | ⚡⚡⚡ | 💰 | 🔧 | ✅✅✅ | ✅✅✅ |
| **Integration** | ⚡⚡ | 💰💰 | 🔧🔧 | ✅✅ | ✅✅ |
| **E2E** | ⚡ | 💰💰💰 | 🔧🔧🔧 | ✅ | ✅ |

### ตัวอย่าง: ระบบสั่งซื้อสินค้า

**Unit Test:**
```javascript
// ทดสอบฟังก์ชันคำนวณราคาเดี่ยว ๆ
test('calculateDiscount ลด 10% ถูกต้อง', () => {
  expect(calculateDiscount(1000, 0.10)).toBe(900);
});
```

**Integration Test:**
```javascript
// ทดสอบ API endpoint ที่เชื่อม DB
test('POST /api/orders สร้างออเดอร์ได้', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({ items: [...], userId: 1 });
  
  expect(response.status).toBe(201);
  // ตรวจสอบว่าบันทึกใน DB จริง
});
```

**E2E Test:**
```javascript
// ทดสอบทั้ง flow จาก UI
test('User สามารถสั่งซื้อสินค้าได้', async () => {
  // 1. Login
  await page.goto('/login');
  await page.fill('#email', 'test@test.com');
  await page.click('#login-btn');
  
  // 2. เลือกสินค้า
  await page.click('.product-card');
  await page.click('#add-to-cart');
  
  // 3. Checkout
  await page.click('#checkout');
  await page.fill('#card-number', '4111111111111111');
  await page.click('#confirm-order');
  
  // 4. ตรวจสอบความสำเร็จ
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## 💡 Analogy: ทดสอบรถยนต์

**Unit Test = ทดสอบชิ้นส่วน**
```
✅ เครื่องยนต์ติดไหม?
✅ ไฟหน้าติดไหม?
✅ แบรกทำงานไหม?
```

**Integration Test = ทดสอบระบบ**
```
✅ เครื่องยนต์ + เกียร์ ทำงานร่วมกันไหม?
✅ แบรก + ล้อ ทำงานร่วมกันไหม?
```

**E2E Test = ทดสอบขับจริง**
```
✅ ขับออกจากโรงงาน → ไปตามถนน → จอดที่หน้าบ้าน
✅ ทุกอย่างทำงานร่วมกันได้ไหม?
```

---

# 2️⃣ Test Case Design (15 นาที)

## 🎯 Test Case คืออะไร?

**Test Case** = สถานการณ์ทดสอบที่ระบุ:
- **Input:** ข้อมูลนำเข้า
- **Expected Output:** ผลลัพธ์ที่คาดหวัง
- **Actual Output:** ผลลัพธ์จริง

---

## 📝 3 ประเภทของ Test Cases

### 1. Positive Test Cases (Happy Path)

**ทดสอบกรณีปกติ ที่ควรทำงานสำเร็จ**

```javascript
// ฟังก์ชันสมัครสมาชิก
function register(email, password) {
  // validation logic
}

// ✅ Positive Test Cases
test('สมัครด้วยอีเมลถูกต้อง', () => {
  expect(register('user@email.com', 'Pass123!')).toBe(true);
});

test('สมัครด้วยรหัสผ่านที่แข็งแรง', () => {
  expect(register('test@test.com', 'StrongP@ss123')).toBe(true);
});
```

### 2. Negative Test Cases (Error Path)

**ทดสอบกรณีที่ไม่ถูกต้อง ควร error**

```javascript
// ❌ Negative Test Cases
test('สมัครด้วยอีเมลไม่ถูกรูปแบบ ต้อง error', () => {
  expect(() => register('invalid-email', 'Pass123!'))
    .toThrow('Invalid email');
});

test('สมัครด้วยรหัสผ่านสั้นเกินไป ต้อง error', () => {
  expect(() => register('user@email.com', '123'))
    .toThrow('Password too short');
});

test('สมัครด้วยอีเมลว่าง ต้อง error', () => {
  expect(() => register('', 'Pass123!'))
    .toThrow('Email required');
});
```

### 3. Boundary Test Cases (Edge Cases)

**ทดสอบขอบเขต/เงื่อนไขพิเศษ**

```javascript
// 🔍 Boundary Test Cases
test('รหัสผ่านยาว 8 ตัว (ขั้นต่ำ) ผ่าน', () => {
  expect(register('user@email.com', 'Pass123!')).toBe(true);
});

test('รหัสผ่านยาว 7 ตัว (น้อยกว่าขั้นต่ำ) ไม่ผ่าน', () => {
  expect(() => register('user@email.com', 'Pass12!'))
    .toThrow();
});

test('อีเมลยาว 100 ตัว (ใกล้สูงสุด)', () => {
  const longEmail = 'a'.repeat(88) + '@email.com';
  expect(register(longEmail, 'Pass123!')).toBe(true);
});
```

---

## 🎲 Equivalence Partitioning

**แนวคิด:** แบ่งข้อมูลเป็นกลุ่ม ๆ ที่มีพฤติกรรมเหมือนกัน

### ตัวอย่าง: ตรวจสอบอายุ

```javascript
function checkAge(age) {
  if (age < 0) return 'invalid';
  if (age < 18) return 'minor';
  if (age <= 65) return 'adult';
  return 'senior';
}
```

**Equivalence Classes:**
```
Group 1: age < 0        → invalid  (เทส: -1, -10)
Group 2: 0 ≤ age < 18   → minor    (เทส: 0, 10, 17)
Group 3: 18 ≤ age ≤ 65  → adult    (เทส: 18, 30, 65)
Group 4: age > 65       → senior   (เทส: 66, 100)
```

**Test Cases:**
```javascript
test('อายุติดลบ → invalid', () => {
  expect(checkAge(-1)).toBe('invalid');
});

test('อายุ 0-17 → minor', () => {
  expect(checkAge(0)).toBe('minor');
  expect(checkAge(10)).toBe('minor');
  expect(checkAge(17)).toBe('minor');
});

test('อายุ 18-65 → adult', () => {
  expect(checkAge(18)).toBe('adult');
  expect(checkAge(30)).toBe('adult');
  expect(checkAge(65)).toBe('adult');
});

test('อายุ 66+ → senior', () => {
  expect(checkAge(66)).toBe('senior');
  expect(checkAge(100)).toBe('senior');
});
```

---

## 🎭 Mock & Stub

### ทำไมต้องใช้?

**ปัญหา:** Unit test ควรทดสอบ function เดียว แต่ function อาจต้องเรียก:
- Database
- External API
- File system
- อื่น ๆ

**วิธีแก้:** ใช้ Mock/Stub แทนของจริง

---

### Stub (ปลอมค่าที่ return)

```javascript
// ฟังก์ชันที่ต้องเรียก database
async function getUserProfile(userId) {
  const user = await database.getUser(userId);
  return {
    name: user.name,
    email: user.email,
    memberSince: user.createdAt
  };
}

// ❌ ไม่ดี: เรียก DB จริง (ช้า, ขึ้นกับ DB)
test('getUserProfile returns profile', async () => {
  const profile = await getUserProfile(1);
  expect(profile.name).toBe('John');
});

// ✅ ดี: Stub database (เร็ว, ไม่ขึ้นกับ DB)
test('getUserProfile returns profile', async () => {
  // Stub: database.getUser() return ค่าปลอม
  database.getUser = jest.fn().mockResolvedValue({
    name: 'John',
    email: 'john@test.com',
    createdAt: '2024-01-01'
  });
  
  const profile = await getUserProfile(1);
  expect(profile.name).toBe('John');
  expect(profile.email).toBe('john@test.com');
});
```

### Mock (ตรวจสอบว่าถูกเรียกไหม)

```javascript
// ฟังก์ชันส่งอีเมล
async function sendWelcomeEmail(userId) {
  const user = await database.getUser(userId);
  await emailService.send({
    to: user.email,
    subject: 'Welcome!',
    body: `Hi ${user.name}`
  });
}

// ✅ Mock: ตรวจสอบว่าเรียก emailService.send() ไหม
test('sendWelcomeEmail sends email', async () => {
  database.getUser = jest.fn().mockResolvedValue({
    name: 'John',
    email: 'john@test.com'
  });
  
  // Mock emailService
  emailService.send = jest.fn();
  
  await sendWelcomeEmail(1);
  
  // ตรวจสอบว่าถูกเรียก
  expect(emailService.send).toHaveBeenCalledWith({
    to: 'john@test.com',
    subject: 'Welcome!',
    body: 'Hi John'
  });
});
```

---

## 📊 Test Coverage

### Coverage คืออะไร?

**Coverage** = เปอร์เซ็นต์ของโค้ดที่ถูก test ครอบคลุม

```
Coverage = (จำนวนบรรทัดที่ test รัน / จำนวนบรรทัดทั้งหมด) × 100%
```

### ประเภท Coverage

| ประเภท | คำอธิบาย |
|--------|----------|
| **Line Coverage** | บรรทัดโค้ดที่ถูกรัน |
| **Branch Coverage** | เงื่อนไข if/else ที่ถูกทดสอบ |
| **Function Coverage** | ฟังก์ชันที่ถูกเรียก |

### ตัวอย่าง

```javascript
function calculateDiscount(price, isMember) {
  if (isMember) {
    return price * 0.9;  // บรรทัด 3
  }
  return price;          // บรรทัด 5
}

// Test 1: เทสแค่ isMember = true
test('member gets 10% discount', () => {
  expect(calculateDiscount(100, true)).toBe(90);
});

// ผล:
// - Line Coverage: 75% (3 จาก 4 บรรทัด)
// - Branch Coverage: 50% (1 จาก 2 branch)

// Test 2: เพิ่มเทส isMember = false
test('non-member pays full price', () => {
  expect(calculateDiscount(100, false)).toBe(100);
});

// ผล:
// - Line Coverage: 100% (4 จาก 4 บรรทัด)
// - Branch Coverage: 100% (2 จาก 2 branch)
```

### Coverage เท่าไรดี?

```
🎯 เป้าหมาย: 70-80% (realistic)

✅ 80%+     = ดีมาก
✅ 70-80%   = ดี
⚠️  50-70%  = พอใช้
❌ < 50%    = ควรเพิ่ม
```

**หมายเหตุ:** Coverage สูง ≠ Quality สูง เสมอไป

---

# 3️⃣ API Testing & Quality (15 นาที)

## 🧪 API Testing คืออะไร?

**API Testing** = ทดสอบ API endpoints ว่า:
- รับ request ถูกต้องไหม
- ประมวลผลถูกต้องไหม
- return response ถูกรูปแบบไหม
- จัดการ error ได้ไหม

---

## 🔥 Smoke Testing

### Smoke Test คืออะไร?

**Smoke Test** = ทดสอบแบบผิวเผิน ว่าระบบ**รันได้**หรือไม่

**Analogy:** เหมือนเปิดเครื่อง → ดูมีควันไหม 💨

### ตัวอย่าง Smoke Tests

```
┌───────────────────────────────────────┐
│       Smoke Test Checklist            │
└───────────────────────────────────────┘

✅ Server ตั้งต้นได้ไหม?
✅ ต่อ Database ได้ไหม?
✅ Endpoint พื้นฐานทำงานไหม?
   ├─ GET /api/health → 200
   ├─ GET /api/users → 200
   ├─ POST /api/users → 201
   └─ GET /api/users/1 → 200
✅ Error handling ทำงานไหม?
   └─ GET /api/users/999 → 404
```

### ตัวอย่าง Code

```javascript
// Smoke Tests
describe('API Smoke Tests', () => {
  
  test('Health check endpoint works', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
  });
  
  test('GET /api/users returns users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  
  test('POST /api/users creates user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'test@test.com' });
    expect(response.status).toBe(201);
  });
  
  test('GET /api/users/:id with invalid ID returns 404', async () => {
    const response = await request(app).get('/api/users/99999');
    expect(response.status).toBe(404);
  });
});
```

---

## 📋 API Test Strategy

### ทดสอบอะไรบ้าง?

**1. Happy Path (Success Cases)**
```javascript
test('GET /api/products returns all products', async () => {
  const res = await request(app).get('/api/products');
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
});
```

**2. Validation (Bad Input)**
```javascript
test('POST /api/products with empty name returns 422', async () => {
  const res = await request(app)
    .post('/api/products')
    .send({ name: '', price: 100 });
  
  expect(res.status).toBe(422);
  expect(res.body.success).toBe(false);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});
```

**3. Authorization (Permissions)**
```javascript
test('DELETE /api/users/:id without auth returns 401', async () => {
  const res = await request(app).delete('/api/users/1');
  expect(res.status).toBe(401);
});
```

**4. Not Found (Missing Resources)**
```javascript
test('GET /api/products/999 returns 404', async () => {
  const res = await request(app).get('/api/products/999');
  expect(res.status).toBe(404);
  expect(res.body.error.code).toBe('NOT_FOUND');
});
```

**5. Edge Cases**
```javascript
test('GET /api/products?page=-1 returns 400', async () => {
  const res = await request(app).get('/api/products?page=-1');
  expect(res.status).toBe(400);
});

test('POST /api/products with huge price', async () => {
  const res = await request(app)
    .post('/api/products')
    .send({ name: 'Test', price: 999999999 });
  expect(res.status).toBe(422);
});
```

---

## ✅ Quality Checklist

### Pre-Deployment Checklist

```
┌────────────────────────────────────┐
│     Quality Checklist              │
└────────────────────────────────────┘

📝 Code Quality
  ✅ Lint ผ่าน (ไม่มี errors/warnings)
  ✅ Format สม่ำเสมอ (prettier/eslint)
  ✅ ไม่มี console.log ที่ไม่จำเป็น
  ✅ ไม่มี TODO/FIXME ค้างอยู่

🧪 Testing
  ✅ Unit tests ผ่านหมด
  ✅ API tests ผ่านหมด
  ✅ Coverage ≥ 70%
  ✅ ทดสอบ edge cases

🔒 Security
  ✅ Input validation ทุก endpoint
  ✅ Error messages ไม่เผยข้อมูลลับ
  ✅ SQL injection ป้องกันแล้ว
  ✅ XSS ป้องกันแล้ว

🚀 Performance
  ✅ Query ไม่ช้า (< 1 วินาที)
  ✅ ไม่มี N+1 queries
  ✅ มี pagination ใน list endpoints

📄 Documentation
  ✅ API endpoints มีเอกสาร
  ✅ Environment variables มีคำอธิบาย
  ✅ README updated
```

---

## 🐛 Bug Report ที่ดี

### Template

```markdown
## Bug Report

### ชื่อบั๊ก
[สรุปสั้น ๆ ชัดเจน]

### ระดับความรุนแรง
- [ ] Critical (ระบบล่ม, ข้อมูลผิด)
- [ ] High (ฟีเจอร์หลักใช้ไม่ได้)
- [ ] Medium (ฟีเจอร์รองใช้ไม่ได้)
- [ ] Low (UI ผิดเล็กน้อย)

### Steps to Reproduce
1. ไปที่หน้า...
2. กดปุ่ม...
3. กรอกข้อมูล...
4. เห็นบั๊ก

### Expected Result
[ควรเป็นอย่างไร]

### Actual Result
[เป็นอย่างไร]

### Screenshots/Logs
[แนบภาพหรือ error logs]

### Environment
- OS: macOS / Windows / Linux
- Browser: Chrome 120
- API Version: v1.2.3
```

### ตัวอย่าง Bug Report

```markdown
## Bug Report: ราคารวมคำนวณผิด

### ระดับความรุนแรง
- [x] Critical

### Steps to Reproduce
1. เข้าหน้าตะกร้า
2. เพิ่มสินค้า 2 ชิ้น (ราคา 100 บาท/ชิ้น)
3. ใส่โค้ดส่วนลด "SAVE10" (ลด 10%)
4. ดูราคารวม

### Expected Result
ราคารวม = (100 × 2) × 0.9 = 180 บาท

### Actual Result
ราคารวม = 200 บาท (ไม่ได้หักส่วนลด)

### Screenshots
[แนบภาพตะกร้า]

### Logs
```
POST /api/cart/apply-discount
Response: { success: true, discount: 0 }
```

### Environment
- Browser: Chrome 120
- API: v1.2.3
```

---

# 4️⃣ Git Team Workflow (15 นาที)

## 🌿 Branch Strategy

### Git Flow (Simplified)

```
main (production)
  ↑
  └─ develop (staging)
       ↑
       ├─ feature/login
       ├─ feature/cart
       ├─ bugfix/price-calculation
       └─ hotfix/security-patch
```

### Branch Naming Convention

```
┌────────────────────────────────────┐
│      Branch Naming Pattern         │
└────────────────────────────────────┘

feature/[feature-name]     → ฟีเจอร์ใหม่
bugfix/[bug-name]          → แก้บั๊กทั่วไป
hotfix/[urgent-fix]        → แก้บั๊กเร่งด่วน
refactor/[what-refactor]   → ปรับปรุงโค้ด

ตัวอย่าง:
✅ feature/user-login
✅ bugfix/cart-total-calculation
✅ hotfix/sql-injection
✅ refactor/api-error-handling

❌ my-branch
❌ test
❌ fix-bug
```

---

## 🔄 Pull Request (PR) Workflow

### PR Lifecycle

```
1. สร้าง branch ใหม่
   git checkout -b feature/login

2. เขียนโค้ด + commit
   git add .
   git commit -m "feat: add login form"

3. Push to remote
   git push origin feature/login

4. สร้าง Pull Request บน GitHub
   - เขียน description
   - เพิ่ม reviewers

5. Code Review
   - ผู้อื่นดูโค้ด
   - แสดงความคิดเห็น
   - Request changes

6. แก้ตาม feedback
   git add .
   git commit -m "fix: address review comments"
   git push

7. Approve + Merge
   - Reviewer approve
   - Merge to develop

8. ลบ branch (ถ้าไม่ใช้แล้ว)
   git branch -d feature/login
```

---

## 📝 PR Template

### Good PR Description

```markdown
## Description
เพิ่มฟีเจอร์ login ด้วย email/password

## Changes
- เพิ่ม LoginForm component
- เพิ่ม POST /api/auth/login endpoint
- เพิ่ม input validation
- เพิ่ม error handling

## Testing
- [x] Unit tests ผ่าน
- [x] API tests ผ่าน
- [x] ทดสอบ manual บน dev environment

## Screenshots
[แนบภาพหน้า login]

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Tests added/updated
- [x] Documentation updated
```

---

## 👀 Code Review Checklist

### ผู้ Review ต้องดูอะไร?

```
┌────────────────────────────────────┐
│    Code Review Checklist           │
└────────────────────────────────────┘

✅ Functionality
  □ โค้ดทำตามที่ PR บอกไหม?
  □ Edge cases ครอบคลุมไหม?

✅ Code Quality
  □ ชื่อตัวแปร/ฟังก์ชันชัดเจนไหม?
  □ โค้ดซับซ้อนเกินไปไหม?
  □ มี comments ที่จำเป็นไหม?

✅ Testing
  □ มี tests ครอบคลุมไหม?
  □ Tests ผ่านหมดไหม?

✅ Security
  □ Input validation ครบไหม?
  □ มีช่องโหว่ไหม?

✅ Performance
  □ มี N+1 queries ไหม?
  □ Memory leak ไหม?

✅ Documentation
  □ API docs updated ไหม?
  □ README updated ไหม?
```

### Review Comments (ตัวอย่าง)

**✅ Good Comment:**
```
💡 Suggestion:
ตรงนี้ถ้าใช้ `Array.filter()` แทน loop 
จะอ่านง่ายกว่านะ

const active = users.filter(u => u.status === 'active');
```

**❌ Bad Comment:**
```
โค้ดแย่มาก เขียนใหม่เลย!
```

---

## ⚔️ Conflict Resolution

### Conflict เกิดเมื่อไหร่?

```
Main branch:
  function calculate() {
    return price * 1.07;  // +7% tax
  }

Your branch:
  function calculate() {
    return price * 0.9;   // -10% discount
  }

→ Git ไม่รู้จะเลือกอันไหน!
```

### วิธีแก้ Conflict

**Step 1: Pull latest code**
```bash
git checkout develop
git pull origin develop
git checkout feature/discount
git merge develop
```

**Step 2: แก้ conflict**
```javascript
// Git จะแสดง conflict แบบนี้:
<<<<<<< HEAD (your branch)
function calculate() {
  return price * 0.9;   // -10% discount
}
=======
function calculate() {
  return price * 1.07;  // +7% tax
}
>>>>>>> develop

// แก้เป็น:
function calculate() {
  return price * 0.9 * 1.07;  // discount + tax
}
```

**Step 3: Commit**
```bash
git add .
git commit -m "Merge develop and resolve conflicts"
git push
```

---

## 🎯 Team Collaboration Best Practices

### 1. Commit Message Convention

```
┌────────────────────────────────────┐
│    Commit Message Format           │
└────────────────────────────────────┘

<type>: <subject>

Types:
  feat:     ฟีเจอร์ใหม่
  fix:      แก้บั๊ก
  refactor: ปรับปรุงโค้ด
  test:     เพิ่ม/แก้ tests
  docs:     เอกสาร
  style:    format โค้ด

ตัวอย่าง:
✅ feat: add login form validation
✅ fix: correct price calculation
✅ refactor: extract helper functions
✅ test: add unit tests for cart
✅ docs: update API documentation

❌ update
❌ fix bug
❌ changes
```

### 2. Small PRs

```
❌ Bad PR (ใหญ่เกินไป):
  - 50 files changed
  - 2000 lines added
  - ใช้เวลา review 2 ชั่วโมง

✅ Good PR (พอดี):
  - 5-10 files changed
  - 200-300 lines
  - ใช้เวลา review 15-30 นาที
```

### 3. Review ภายใน 24 ชม.

```
PR created → Notify team
↓
Review within 24h
↓
Address feedback
↓
Approve & Merge
```

### 4. Protected Branches

```
main branch:
  ✅ ห้าม push โดยตรง
  ✅ ต้องผ่าน PR
  ✅ ต้องมี 1 approve
  ✅ CI tests ต้องผ่าน
```

---

## 📊 สรุป Day 5

### สิ่งที่เรียนรู้

```
┌────────────────────────────────────┐
│         Day 5 Summary              │
└────────────────────────────────────┘

1️⃣ Testing Fundamentals
   ✅ Testing Pyramid
   ✅ Unit/Integration/E2E
   ✅ เทสอะไรก่อน

2️⃣ Test Case Design
   ✅ Positive/Negative/Boundary
   ✅ Equivalence Partitioning
   ✅ Mock/Stub
   ✅ Coverage

3️⃣ API Testing & Quality
   ✅ Smoke Testing
   ✅ API Test Strategy
   ✅ Quality Checklist
   ✅ Bug Reporting

4️⃣ Git Team Workflow
   ✅ Branch Strategy
   ✅ PR Workflow
   ✅ Code Review
   ✅ Conflict Resolution
```

---

## 🎯 เตรียมพร้อมสำหรับ Workshops

**Workshop 16: Unit Testing**
- เขียน unit tests ด้วย Jest
- Mock/Stub
- Coverage reporting

**Workshop 17: API Testing**
- Postman collections
- Automated API tests
- Test documentation

**Workshop 18: Git Collaboration**
- Branch workflow
- PR practice
- Conflict resolution drill

---

## 💡 Key Takeaways

```
🎯 "Test ไม่ใช่เสียเวลา แต่เป็นการประหยัดเวลาในอนาคต"

🎯 "Test ที่ดี = โค้ดที่ดี"

🎯 "PR เล็ก ๆ = Review ง่าย = Merge เร็ว"

🎯 "Conflict เป็นเรื่องปกติ แก้ได้ อย่ากลัว!"
```

---

**พร้อมเริ่ม Workshops! 🚀**

**Next:** [Workshop 16: Unit Testing](./workshop-16-unit-testing/level-1-guided/README.md)
