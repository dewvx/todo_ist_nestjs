import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Todo List API')
    .setDescription(
      'Todo List REST API สร้างด้วย NestJS — ' +
        'จัดการ Todo: เพิ่ม / แก้ไข / ลบ / แสดงรายการ / เปลี่ยนสถานะ / ค้นหาและกรอง',
    )
    .setVersion('1.0')
    .addTag('todos', 'ฟังก์ชันจัดการ Todo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Todo API is running on http://localhost:${port}`);
}

bootstrap();
