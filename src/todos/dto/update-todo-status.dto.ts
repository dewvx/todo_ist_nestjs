import { IsEnum } from 'class-validator';
import { TodoStatus } from '../todo.model';

export class UpdateTodoStatusDto {
  /**
   * สถานะใหม่ที่ต้องการเปลี่ยน
   */
  @IsEnum(TodoStatus, {
    message: `status must be one of: ${Object.values(TodoStatus).join(', ')}`,
  })
  status!: TodoStatus;
}
