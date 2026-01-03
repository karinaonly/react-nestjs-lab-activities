import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
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
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
