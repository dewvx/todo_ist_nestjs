import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TodoStatus } from '../todo.model';

export class CreateTodoDto {
  /**
   * ชื่องาน (จำเป็น, 3-100 ตัวอักษร)
   * @example ซื้อของเข้าบ้าน
   */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'title should not be empty' })
  @Length(3, 100, { message: 'title must be between 3 and 100 characters' })
  title!: string;

  /**
   * รายละเอียดงาน (ไม่บังคับ, ไม่เกิน 500 ตัวอักษร)
   * @example นม ไข่ ขนมปัง
   */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(0, 500, { message: 'description must be at most 500 characters' })
  description?: string;

  /**
   * สถานะเริ่มต้นของงาน (ไม่บังคับ, ค่าเริ่มต้นคือ PENDING)
   */
  @IsOptional()
  @IsEnum(TodoStatus, {
    message: `status must be one of: ${Object.values(TodoStatus).join(', ')}`,
  })
  status?: TodoStatus;
}
