import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from "./shared/transform.interceptor";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
