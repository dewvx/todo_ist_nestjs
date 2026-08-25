import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo, TodoStatus } from './todo.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { GetTodosFilterDto } from './dto/get-todos-filter.dto';

@Injectable()
export class TodosService {
  /** In-memory storage (Map) — เก็บใน RAM รีสตาร์ทแล้วข้อมูลหาย */
  private readonly todos = new Map<string, Todo>();

  create(dto: CreateTodoDto): Todo {
    const now = new Date();
    const todo: Todo = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TodoStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  findAll(filter?: GetTodosFilterDto): Todo[] {
    let result = [...this.todos.values()];

    if (filter?.status) {
      result = result.filter((todo) => todo.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(q) ||
          (todo.description ?? '').toLowerCase().includes(q),
      );
    }

    return result.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  findOne(id: string): Todo {
    const todo = this.todos.get(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return todo;
  }

  update(id: string, dto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);

    if (dto.title !== undefined) todo.title = dto.title;
    if (dto.description !== undefined) todo.description = dto.description;
    if (dto.status !== undefined) todo.status = dto.status;

    todo.updatedAt = new Date();
    this.todos.set(todo.id, todo);
    return todo;
  }

  updateStatus(id: string, { status }: UpdateTodoStatusDto): Todo {
    const todo = this.update(id, { status });
    return todo;
  }

  remove(id: string): void {
    const todo = this.findOne(id);
    this.todos.delete(todo.id);
  }
}
