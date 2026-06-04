import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Utilisez le port de Render ou 3000 en local
  const port = process.env.PORT || 3000;

  // ✅ Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Mon API')
    .setDescription("Documentation de l'API")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Activation du AuthGuard global avec Reflector
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}
bootstrap();