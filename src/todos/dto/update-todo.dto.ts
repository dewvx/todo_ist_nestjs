import { PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

/**
 * ทุก field เป็น optional (สืบทอดจาก CreateTodoDto)
 * ใช้สำหรับ PATCH /todos/:id — แก้ไขเฉพาะ field ที่ส่งมา
 */
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
