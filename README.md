# Todo List API — NestJS

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

## Swagger UI

เปิด browser ไปที่:

```
http://localhost:3000/api/docs
```

- กด endpoint → **Try it out** → กรอก body/params → **Execute** เพื่อทดสอบได้ทันที
- ดู OpenAPI spec (JSON) ได้ที่ `/api/docs-json`

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
