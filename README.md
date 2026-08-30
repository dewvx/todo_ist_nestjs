# Todo List API — NestJS

🔗 **Live Demo (Swagger UI):** https://todo-ist-nestjs.onrender.com/api/docs

> ⚠️ **หมายเหตุ (Render Free Tier)**
> - **Cold start** — ถ้าไม่มีใครเรียกใช้สักพัก (~15 นาที) request แรกจะช้า (~30–60 วิ) รอจนโหลดเสร็จแล้วลองใหม่ได้ปกติ
> - **In-memory storage** — instance restart/sleep แล้วข้อมูล Todo จะถูกล้างทั้งหมด (พฤติกรรมปกติของ free tier + in-memory storage)

Todo List REST Application พัฒนาด้วย [NestJS](https://docs.nestjs.com) ครอบคลุมฟังก์ชันหลัก: เพิ่ม / แก้ไข / ลบ / แสดงรายการ / เปลี่ยนสถานะ / ค้นหาและกรอง / Data Validation

## ฟีเจอร์

- เพิ่ม Todo (`POST /todos`)
- แก้ไข Todo (`PATCH /todos/:id`)
- ลบ Todo (`DELETE /todos/:id`)
- แสดงรายการ Todo (`GET /todos`, `GET /todos/:id`)
- เปลี่ยนสถานะ Todo (`PATCH /todos/:id/status`) — `PENDING` / `IN_PROGRESS` / `DONE`
- Search / Filter — ค้นหาจาก title/description, กรองตามสถานะ
- Data Validation — `class-validator` + global `ValidationPipe`
- Swagger UI — เอกสาร API ภาษาไทย ทดสอบ endpoint ได้ในตัว

## เทคโนโลยี

| องค์ประกอบ | รายละเอียด |
|---|---|
| Framework | NestJS 11 |
| Runtime | Node.js 20+ (ทดสอบบน Node 22) |
| Validation | class-validator + class-transformer |
| API Docs | @nestjs/swagger (OpenAPI) |
| Storage | In-memory (Map) — รีสตาร์ทเซิร์ฟเวอร์ข้อมูลจะหาย |

## การติดตั้ง

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันโหมด development (auto-reload)
npm run start:dev

# หรือ build + run โหมด production
npm run build
npm run start:prod
```

เซิร์ฟเวอร์เริ่มที่ **http://localhost:3000** (เปลี่ยนพอร์ตได้ผ่าน environment variable `PORT`)

---

## วิธีทดสอบ API ด้วย Swagger UI (ทีละขั้นตอน)

Swagger UI คือหน้าเว็บที่ให้เราทดสอบ API ได้โดยไม่ต้องพิมพ์คำสั่ง curl หรือติดตั้ง Postman เลย

### ขั้นตอนที่ 1: เลือกวิธีเปิด Swagger UI

**วิธี A: Production (ง่ายสุด)** — เปิด browser ไปที่ลิงก์ Live Demo ได้เลย ไม่ต้องติดตั้งหรือรันอะไร:

```
https://todo-ist-nestjs.onrender.com/api/docs
```

> 💡 ถ้าโหลดนานผิดปกติ = cold start ของ Render free tier (ดูคำเตือนด้านบน) — รอแล้ว refresh

**วิธี B: Local** — รันเซิร์ฟเวอร์ในเครื่องก่อน:

```bash
npm run start:dev
```

รอจนเห็นข้อความ `Todo API is running on http://localhost:3000` แล้วเปิด browser ไปที่:

```
http://localhost:3000/api/docs
```

จะเห็นหน้าเอกสาร API ภาษาไทย แบ่งเป็นกลุ่ม `todos` ตาม endpoint ต่างๆ

> 💡 ดู OpenAPI spec แบบ JSON ได้ที่ `/api/docs-json` เช่น `https://todo-ist-nestjs.onrender.com/api/docs-json` (ใช้ import เข้า Postman/Insomnia ได้)

### ขั้นตอนที่ 2: ทดสอบแต่ละ Endpoint

สำหรับทุก endpoint ใช้แนวทางเดียวกัน:

1. **คลิกที่แถบ endpoint** เพื่อขยายดูรายละเอียด
2. กดปุ่ม **Try it out** (มุมขวาบน) — ปุ่มจะเปลี่ยนเป็น Cancel
3. กรอกข้อมูล:
   - ถ้ามี `Request body` → แก้ไข JSON ในช่อง textarea (มี example ให้ล่วงหน้าแล้ว)
   - ถ้ามี path parameter เช่น `id` → กรอกในช่อง text ทางขวา
   - ถ้ามี query parameters เช่น `search`, `status` → กด **Add string item** แล้วกรอกค่า
4. กด **Execute**
5. ดูผลลัพธ์ในส่วน **Server response** — Code = HTTP status, Response body = ข้อมูลที่ได้

### ตัวอย่าง: ทดสอบเพิ่ม Todo (`POST /todos`)

1. ขยาย `POST /todos` → กด **Try it out**
2. แก้ Request body เป็น:

```json
{
  "title": "ซื้อของเข้าบ้าน",
  "description": "นม ไข่ ขนมปัง",
  "status": "PENDING"
}
```

3. กด **Execute** → ควรได้ response code `201` พร้อมข้อมูล Todo ที่สร้าง (ระบบ generate `id` เป็น UUID ให้เอง)
4. **คัดลอกค่า `id` จาก response เก็บไว้** — ใช้สำหรับทดสอบ GET/PATCH/DELETE ต่อไป

### ตัวอย่าง: ทดสอบ Endpoint ที่เหลือ

| ลำดับ | Endpoint | วิธีกรอก | Response ที่คาดหวัง |
|---|---|---|---|
| 1 | `GET /todos` | ไม่ต้องกรอกอะไร กด Execute ได้เลย | `200` + รายการทั้งหมด |
| 2 | `GET /todos/{id}` | วาง id จากขั้นตอน POST | `200` + Todo รายการเดียว |
| 3 | `PATCH /todos/{id}` | วาง id + body เช่น `{"title": "ฉบับแก้ไข"}` | `200` + Todo ที่แก้แล้ว |
| 4 | `PATCH /todos/{id}/status` | วาง id + body เช่น `{"status": "DONE"}` | `200` + Todo สถานะใหม่ |
| 5 | `GET /todos?search=...&status=...` | เพิ่ม query param เช่น `search=ของ`, `status=DONE` | `200` + รายการที่กรองแล้ว |
| 6 | `DELETE /todos/{id}` | วาง id | `204` (ไม่มี response body = สำเร็จ) |

### ตัวอย่าง: ทดสอบ Data Validation

ลองส่งข้อมูลผิดๆ เพื่อดูว่า validation ทำงาน:

- `POST /todos` โดยตั้ง title สั้นกว่า 3 ตัวอักษร เช่น `"ab"` → ได้ `400` พร้อม message
- `POST /todos` โดยเพิ่ม field แปลกปลอม เช่น `"hacker": true` → ได้ `400` (`property hacker should not exist`)
- `PATCH /todos/{id}/status` ด้วย status นอก enum เช่น `"FINISHED"` → ได้ `400`
- กรอก id ที่ไม่ใช่ UUID หรือไม่มีในระบบ → ได้ `404`

### Tips

- กด **Schema** ใต้ Request body เพื่อดูว่า field ไหน required, มีกฎอะไรบ้าง
- Response `404 Not Found` = ไม่พบ Todo ตาม id นั้น (ลอง `GET /todos` เพื่อดู id ล่าสุด)
- ข้อมูลเก็บแบบ in-memory — รีสตาร์ทเซิร์ฟเวอร์ (หรือ Render instance restart/sleep) ข้อมูลจะถูกล้าง

---

## Deployment

Deploy บน [Render](https://render.com):

- **URL:** https://todo-ist-nestjs.onrender.com
- **Swagger UI (production):** https://todo-ist-nestjs.onrender.com/api/docs
- เชื่อมต่อกับ GitHub repo — push branch main จะ auto-deploy ให้อัตโนมัติ
- Free tier: instance จะ sleep เมื่อไม่มี traffic ~15 นาที (request แรกหลัง sleep จะช้า)

---

## API Endpoints

| Method | Endpoint | คำอธิบาย | Success Code |
|---|---|---|---|
| GET | `/` | Health check | 200 |
| POST | `/todos` | เพิ่ม Todo ใหม่ | 201 |
| GET | `/todos` | แสดงรายการ Todo (รองรับ query: `search`, `status`) | 200 |
| GET | `/todos/:id` | แสดง Todo รายการเดียว | 200 |
| PATCH | `/todos/:id` | แก้ไข Todo (ส่งเฉพาะ field ที่ต้องการแก้) | 200 |
| PATCH | `/todos/:id/status` | เปลี่ยนสถานะ Todo | 200 |
| DELETE | `/todos/:id` | ลบ Todo | 204 |

### ตัวอย่างการใช้งาน (curl)

```bash
# เพิ่ม Todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "ซื้อของเข้าบ้าน", "description": "นม ไข่ ขนมปัง"}'

# แสดงรายการทั้งหมด
curl http://localhost:3000/todos

# ค้นหา + กรอง
curl "http://localhost:3000/todos?search=ของ&status=PENDING"

# แสดงรายการเดียว
curl http://localhost:3000/todos/<id>

# แก้ไข (ส่งเฉพาะ field ที่ต้องการ)
curl -X PATCH http://localhost:3000/todos/<id> \
  -H "Content-Type: application/json" \
  -d '{"title": "ซื้อของเข้าบ้านฉบับแก้ไข"}'

# เปลี่ยนสถานะ
curl -X PATCH http://localhost:3000/todos/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "DONE"}'

# ลบ
curl -X DELETE http://localhost:3000/todos/<id>
```

## Data Validation

ทุก request body/query ผ่าน global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted` + `transform`):

| Field | กฎ | ใช้กับ |
|---|---|---|
| `title` | จำเป็น, string, 3–100 ตัวอักษร, trim อัตโนมัติ | create, update |
| `description` | optional, string, ≤500 ตัวอักษร | create, update |
| `status` | enum: `PENDING`, `IN_PROGRESS`, `DONE` | create, update, status |
| `search` | optional, string, 1–100 ตัวอักษร | filter |
| `id` (path) | ต้องเป็นรูปแบบ UUID | get/update/delete |

กรณีส่งข้อมูลไม่ถูกต้อง จะได้ HTTP `400` พร้อม message บอกสาเหตุ เช่น:

```json
{
  "message": ["property hacker should not exist", "title must be between 3 and 100 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

กรณี id ไม่มีในระบบ → HTTP `404 Not Found`

## โครงสร้างโปรเจกต์

```
src/
├── main.ts                     # entry point: bootstrap + ValidationPipe + Swagger
├── app.module.ts               # root module
├── app.controller.ts           # GET / health check
└── todos/
    ├── todos.module.ts         # module ของ feature Todo
    ├── todos.controller.ts     # routes + Swagger annotations (ภาษาไทย)
    ├── todos.service.ts        # business logic (CRUD, search, filter)
    ├── todo.model.ts           # Todo interface + TodoStatus enum
    └── dto/
        ├── create-todo.dto.ts          # validation ตอนเพิ่ม
        ├── update-todo.dto.ts          # PartialType(CreateTodoDto) ตอนแก้ไข
        ├── update-todo-status.dto.ts   # validation ตอนเปลี่ยนสถานะ
        └── get-todos-filter.dto.ts     # validation ของ query params
```

### Flow การทำงาน

```
Request → Controller (route) → DTO (ValidationPipe validate+transform)
        → Service (business logic) → Response JSON
```

---

## ผู้พัฒนา

GitHub: **dewvx** — dd221552@gmail.com
