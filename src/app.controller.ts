import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check — ตรวจสอบสถานะ API' })
  healthCheck() {
    return {
      status: 'ok',
      message: 'Todo List API is running',
      endpoints: {
        'POST   /todos': 'เพิ่ม Todo',
        'GET    /todos': 'แสดงรายการ Todo (?search=&status=)',
        'GET    /todos/:id': 'แสดง Todo รายการเดียว',
        'PATCH  /todos/:id': 'แก้ไข Todo',
        'PATCH  /todos/:id/status': 'เปลี่ยนสถานะ Todo',
        'DELETE /todos/:id': 'ลบ Todo',
      },
    };
  }
}
