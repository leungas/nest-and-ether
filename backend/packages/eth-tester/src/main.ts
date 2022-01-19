import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // we want to inject the config service here
  const config = app.get(ConfigService);

  // mounting swagger
  const swagger = new DocumentBuilder()
    .setTitle('Test Service for Blank Network with Web3')
    .setDescription('This is a simple service and PoC for Web3 assessment')
    .setVersion('1.0.0')
    .build();

  const docs = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup(config.get('application.swagger.path'), app, docs);

  // mounting app
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
