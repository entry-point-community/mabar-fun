import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://mabar-fun-web.vercel.app'],
  });

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(2000);
}
bootstrap();
