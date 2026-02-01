# 🎯 เฉลย: Challenge Tasks - Workshop 11 Level 1

## ภาพรวม

เฉลยสำหรับ 3 Challenge Tasks:
1. **Sorting** - เรียงลำดับสินค้า
2. **Stock Status Filter** - กรองตามสต็อก
3. **Bulk Operations** - อัพเดทหลายรายการ

---

## 🔄 Challenge 1: Sorting

### โจทย์
```javascript
// GET /api/products?sort=price&order=asc
// GET /api/products?sort=name&order=desc
```

### ✅ เฉลย

**อัพเดท `src/validators/productValidator.js`:**

```javascript
// src/validators/productValidator.js

exports.validateQuery = [
  query('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  // ✅ Add sorting validation
  query('sort')
    .optional()
    .isIn(['name', 'price', 'stock', 'createdAt'])
    .withMessage('Invalid sort field. Valid fields: name, price, stock, createdAt'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be "asc" or "desc"')
];
```

**อัพเดท `src/controllers/productController.js`:**

```javascript
// src/controllers/productController.js

exports.getAll = (req, res) => {
  try {
    let products = Product.getAll();
    
    // Filters (existing code)
    if (req.query.category) {
      products = products.filter(p => p.category === req.query.category);
    }
    
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      products = products.filter(p => p.price >= minPrice);
    }
    
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      products = products.filter(p => p.price <= maxPrice);
    }
    
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // ✅ Sorting
    const sortBy = req.query.sort || 'id';
    const order = req.query.order || 'asc';
    
    products.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle string comparison (case-insensitive)
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    // Pagination (existing code)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      sorting: {
        sortBy,
        order
      },
      count: paginatedProducts.length,
      data: paginatedProducts
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch products',
        details: error.message
      }
    });
  }
};
```

### 🧪 ทดสอบ

```bash
# เรียงตาม price (ถูกไปแพง)
GET http://localhost:3000/api/products?sort=price&order=asc

# เรียงตาม name (Z-A)
GET http://localhost:3000/api/products?sort=name&order=desc

# เรียงตาม stock (มากไปน้อย)
GET http://localhost:3000/api/products?sort=stock&order=desc

# รวม filter + sort
GET http://localhost:3000/api/products?category=Electronics&sort=price&order=asc
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "pagination": {...},
  "sorting": {
    "sortBy": "price",
    "order": "asc"
  },
  "count": 3,
  "data": [
    { "id": 3, "name": "AirPods Pro", "price": 8990, ... },
    { "id": 1, "name": "iPhone 15 Pro", "price": 42900, ... },
    { "id": 2, "name": "MacBook Pro M3", "price": 59900, ... }
  ]
}
```

---

## 📦 Challenge 2: Stock Status Filter

### โจทย์
```javascript
// GET /api/products?inStock=true
// GET /api/products?inStock=false
```

### ✅ เฉลย

**อัพเดท `src/validators/productValidator.js`:**

```javascript
// src/validators/productValidator.js

exports.validateQuery = [
  // ... existing validations ...
  
  // ✅ Add stock status validation
  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be true or false')
];
```

**อัพเดท `src/controllers/productController.js`:**

```javascript
// src/controllers/productController.js

exports.getAll = (req, res) => {
  try {
    let products = Product.getAll();
    
    // Filters
    if (req.query.category) {
      products = products.filter(p => p.category === req.query.category);
    }
    
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      products = products.filter(p => p.price >= minPrice);
    }
    
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      products = products.filter(p => p.price <= maxPrice);
    }
    
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // ✅ Stock status filter
    if (req.query.inStock !== undefined) {
      const inStock = req.query.inStock === 'true';
      products = products.filter(p => 
        inStock ? p.stock > 0 : p.stock === 0
      );
    }
    
    // Sorting (from Challenge 1)
    const sortBy = req.query.sort || 'id';
    const order = req.query.order || 'asc';
    
    products.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      sorting: {
        sortBy,
        order
      },
      filters: {
        category: req.query.category,
        inStock: req.query.inStock
      },
      count: paginatedProducts.length,
      data: paginatedProducts
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch products',
        details: error.message
      }
    });
  }
};
```

### 🧪 ทดสอบ

```bash
# สินค้าที่มีสต็อก
GET http://localhost:3000/api/products?inStock=true

# สินค้าที่หมดสต็อก
GET http://localhost:3000/api/products?inStock=false

# รวม filter + inStock
GET http://localhost:3000/api/products?category=Electronics&inStock=true&sort=price&order=asc
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "pagination": {...},
  "sorting": {...},
  "filters": {
    "category": "Electronics",
    "inStock": "true"
  },
  "count": 3,
  "data": [...]
}
```

---

## 🔨 Challenge 3: Bulk Operations

### โจทย์
```javascript
// PATCH /api/products/bulk
// Body: { ids: [1, 2, 3], updates: { category: "Sale" } }
```

### ✅ เฉลย

**เพิ่ม validation `src/validators/productValidator.js`:**

```javascript
// src/validators/productValidator.js

/**
 * Validation for bulk update
 */
exports.bulkUpdate = [
  body('ids')
    .isArray({ min: 1 }).withMessage('ids must be a non-empty array')
    .custom((value) => {
      if (!value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('All ids must be positive integers');
      }
      return true;
    }),
  
  body('updates')
    .isObject().withMessage('updates must be an object')
    .notEmpty().withMessage('updates cannot be empty'),
  
  body('updates.name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('updates.price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('updates.category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('updates.stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];
```

**เพิ่ม function ใน `src/data/products.js`:**

```javascript
// src/data/products.js

/**
 * Bulk update products
 */
function bulkUpdate(ids, updates) {
  const updatedProducts = [];
  const notFoundIds = [];
  
  ids.forEach(id => {
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      notFoundIds.push(id);
    } else {
      products[index] = {
        ...products[index],
        ...updates,
        id, // ห้ามเปลี่ยน ID
        updatedAt: new Date().toISOString()
      };
      updatedProducts.push(products[index]);
    }
  });
  
  return {
    updated: updatedProducts,
    notFound: notFoundIds
  };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  partialUpdate,
  remove,
  bulkUpdate // ✅ Export new function
};
```

**เพิ่ม controller `src/controllers/productController.js`:**

```javascript
// src/controllers/productController.js

/**
 * PATCH /api/products/bulk
 * Bulk update products
 */
exports.bulkUpdate = (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    // Convert types if present
    const processedUpdates = { ...updates };
    if (processedUpdates.price) {
      processedUpdates.price = parseFloat(processedUpdates.price);
    }
    if (processedUpdates.stock) {
      processedUpdates.stock = parseInt(processedUpdates.stock);
    }
    
    const result = Product.bulkUpdate(ids, processedUpdates);
    
    if (result.notFound.length > 0) {
      return res.status(207).json({ // 207 Multi-Status
        success: true,
        message: 'Bulk update completed with some errors',
        updated: result.updated.length,
        notFound: result.notFound,
        data: result.updated
      });
    }
    
    res.json({
      success: true,
      message: `Successfully updated ${result.updated.length} products`,
      updated: result.updated.length,
      data: result.updated
    });
  } catch (error) {
    console.error('Error in bulkUpdate:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to bulk update products',
        details: error.message
      }
    });
  }
};
```

**เพิ่ม route `src/routes/products.js`:**

```javascript
// src/routes/products.js

/**
 * PATCH /api/products/bulk
 * Bulk update products
 */
router.patch('/bulk',
  validator.bulkUpdate,
  validator.handleValidationErrors,
  productController.bulkUpdate
);

// ⚠️ สำคัญ: ต้องใส่ route /bulk ก่อน /:id
```

### 🧪 ทดสอบ

**1. Bulk update category**
```
PATCH http://localhost:3000/api/products/bulk
Content-Type: application/json

{
  "ids": [1, 2, 3],
  "updates": {
    "category": "Electronics"
  }
}
```

**2. Bulk update multiple fields**
```
PATCH http://localhost:3000/api/products/bulk
Content-Type: application/json

{
  "ids": [1, 2],
  "updates": {
    "category": "Sale",
    "stock": 100
  }
}
```

**3. Some IDs not found**
```
PATCH http://localhost:3000/api/products/bulk
Content-Type: application/json

{
  "ids": [1, 999, 2, 888],
  "updates": {
    "stock": 50
  }
}
```

**ผลลัพธ์ (207 Multi-Status):**
```json
{
  "success": true,
  "message": "Bulk update completed with some errors",
  "updated": 2,
  "notFound": [999, 888],
  "data": [
    { "id": 1, "stock": 50, ... },
    { "id": 2, "stock": 50, ... }
  ]
}
```

---

## 💡 Tips สำหรับอาจารย์

### การให้คะแนน

| Challenge | คะแนน | เกณฑ์ |
|-----------|-------|-------|
| Sorting | 30% | Sort algorithm, validation, multiple fields |
| Stock Filter | 30% | Boolean filter, query validation |
| Bulk Operations | 40% | Array handling, partial success, 207 status |

**Bonus:**
- Error handling ครบถ้วน: +5%
- Input validation ครบ: +5%

### Common Mistakes

**1. Sort ไม่ handle string**
```javascript
// ❌ ผิด - case sensitive
return a.name > b.name ? 1 : -1;

// ✅ ถูก - case insensitive
const aName = a.name.toLowerCase();
const bName = b.name.toLowerCase();
return aName > bName ? 1 : -1;
```

**2. Bulk update ไม่ handle not found**
```javascript
// ❌ ผิด - return 404 ถ้า ID ไม่เจอ
if (!product) return res.status(404).json(...);

// ✅ ถูก - return 207 Multi-Status
if (notFound.length > 0) {
  return res.status(207).json({
    updated: [...],
    notFound: [...]
  });
}
```

**3. Route order ผิด**
```javascript
// ❌ ผิด - /bulk จะถูก match โดย /:id
router.patch('/:id', ...);
router.patch('/bulk', ...); // จะไม่ทำงาน!

// ✅ ถูก - /:id อยู่ท้ายสุด
router.patch('/bulk', ...);
router.patch('/:id', ...);
```

---

## 🎓 สรุป

เฉลย Challenge Tasks ครอบคลุม:
- ✅ Sorting (เรียงลำดับ + validation)
- ✅ Stock Status Filter (Boolean filter)
- ✅ Bulk Operations (Array handling + 207 status)
- ✅ Input validation ครบถ้วน
- ✅ Error handling

**พร้อมใช้สอนและให้คะแนน! 🎉**
