import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TodoStatus } from '../todo.model';

export class GetTodosFilterDto {
  /**
   * คำค้นหา (ค้นใน title และ description)
   * @example ชื่อของ
   */
  @IsOptional()
  @IsString()
  @Length(1, 100)
  search?: string;

  /**
   * กรองตามสถานะ
   */
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
