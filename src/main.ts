import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('E-Commerce Backend')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('commerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, documentFactory);
  app.enableCors({
    origin: true,
    methods:'*',
    credentials: true,
    allowedHeaders: '*',
  })
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
