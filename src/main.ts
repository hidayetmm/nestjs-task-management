import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT;

  const config = new DocumentBuilder()
    .setTitle('Task management')
    .setDescription('User can sign up/sign in, CRUD tasks')
    .setVersion('2.0')
    .setContact('Hidayat Mammadov', null, 'hidayetmmdv@gmail.com')
    .addBearerAuth({
      description: 'Please enter token:',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: ['http://localhost:3000'] });
  await app.listen(port);
}
bootstrap();
