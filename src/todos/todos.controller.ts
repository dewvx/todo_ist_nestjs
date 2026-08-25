import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { Todo } from './todo.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { GetTodosFilterDto } from './dto/get-todos-filter.dto';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'เพิ่ม Todo ใหม่' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTodoDto): Todo {
    return this.todosService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'แสดงรายการ Todo ทั้งหมด (ค้นหาได้ด้วย ?search= และกรองสถานะด้วย ?status=)',
  })
  findAll(@Query() filter: GetTodosFilterDto): Todo[] {
    return this.todosService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'แสดง Todo รายการเดียวตาม id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Todo {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไข Todo (ส่งเฉพาะ field ที่ต้องการแก้)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTodoDto): Todo {
    return this.todosService.update(id, dto);
  }

  /** เปลี่ยนสถานะเฉพาะส่วน */
  @Patch(':id/status')
  @ApiOperation({
    summary: 'เปลี่ยนสถานะ Todo (PENDING / IN_PROGRESS / DONE)',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTodoStatusDto,
  ): Todo {
    return this.todosService.updateStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบ Todo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.todosService.remove(id);
  }
}
