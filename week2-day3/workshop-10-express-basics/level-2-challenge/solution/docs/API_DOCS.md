# Book Library API Documentation

Base URL: `http://localhost:3000`

## General Response Format
- Success:
```json
{ "success": true, "data": {} }
```
- Error:
```json
{ "success": false, "error": { "message": "..." } }
```

## Rate Limiting
- Controlled by `.env`
  - `RATE_LIMIT_WINDOW` (ms) default 900000 (15 min)
  - `RATE_LIMIT_MAX` default 100 requests
- When exceeded: `429 Too Many Requests`

---

## Authors

### GET `/api/authors`
Query:
- `country` (optional) เช่น `UK`

Response:
- `count`: จำนวนรายการ
- `data`: รายชื่อ authors

### GET `/api/authors/:id`
Returns author พร้อม `books` ของ author นั้น

### POST `/api/authors`
Body:
```json
{ "name": "J.R.R. Tolkien", "country": "UK", "birthYear": 1892 }
```
Response: `201 Created`

### PUT `/api/authors/:id`
Body: (ต้องครบทุก field ตาม validation)
```json
{ "name": "George Orwell", "country": "UK", "birthYear": 1903 }
```

### DELETE `/api/authors/:id`
- ถ้า author มี books อยู่ จะลบไม่ได้ (`400`)

---

## Books

### GET `/api/books`
Query:
- `genre` (optional) เช่น `Fantasy`
- `page` (optional) default `1`
- `limit` (optional) default `10` (max 100)

Response:
- `pagination`: page/limit/total/totalPages/hasPrev/hasNext
- `data`: รายการ books พร้อม `author`

### GET `/api/books/:id`
Returns book พร้อม `author`

### GET `/api/books/search`
Query:
- `q` (required) ค้นจาก title (case-insensitive)

### POST `/api/books`
Body:
```json
{
  "title": "The Hobbit",
  "authorId": 1,
  "year": 1937,
  "genre": "Fantasy",
  "isbn": "978-0-12345-678-9"
}
```
- `authorId` ต้องมีอยู่จริง ไม่งั้นจะได้ `400`
Response: `201 Created`

### PUT `/api/books/:id`
Body: (ต้องครบทุก field ตาม validation)
- `authorId` ต้องมีอยู่จริง

### DELETE `/api/books/:id`
Deletes a book

---

## Docs

### GET `/api/docs`
Returns Markdown documentation (ไฟล์นี้)
