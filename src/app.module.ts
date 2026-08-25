import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { AppController } from './app.controller';

@Module({
  imports: [TodosModule],
  controllers: [AppController],
})
export class AppModule {}
