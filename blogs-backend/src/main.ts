import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true, // 允许发送 cookie
  })
  app.setGlobalPrefix('api') // 设置全局前缀
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
