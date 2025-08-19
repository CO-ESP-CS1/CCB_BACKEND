import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard'; // Assure-toi que ce chemin est correct
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Mon API')
    .setDescription("Documentation de l'API")
    .setVersion('1.0')
    .addBearerAuth() // Ajoute la possibilité d'envoyer un JWT dans Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Activation du AuthGuard global avec Reflector
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  await app.listen(3000);
}
bootstrap();
