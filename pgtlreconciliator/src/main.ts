import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import './processor/reconciliation.processor'; // ← this runs the code!

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.CLIENT_BASEURL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
      whitelist: true, // Strip out any properties that are not defined in the DTO.
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Reconciliation App')
    .setDescription('Your API description')
    .setVersion('1.0')
    // .addServer('http://localhost:3004/', 'Local environment')
    // .addServer('https://staging.yourapi.com/', 'Staging')
    // .addServer('https://production.yourapi.com/', 'Production')
    .addTag('Your API Tag')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
