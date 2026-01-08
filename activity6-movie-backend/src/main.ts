import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Serve static files from movie-images folder
  app.useStaticAssets(join(__dirname, '..', 'movie-images'), {
    prefix: '/movie-images/',
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('Movie API with authentication, movies management, reviews and user management')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Movies', 'Movie management endpoints')
    .addTag('Reviews', 'Review management endpoints')
    .addTag('Users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on port ${process.env.PORT ?? 3001}`);
  console.log(`Swagger UI available at http://localhost:${process.env.PORT ?? 3001}/api/docs`);
}
bootstrap();
