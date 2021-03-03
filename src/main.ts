import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import { TransformInterceptor } from "./shared/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(csurf());
  await app.listen(3000);
}
bootstrap();
