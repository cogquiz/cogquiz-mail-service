import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVICE_PORT', 3005);
  const serviceName = configService.get<string>('SERVICE_NAME', 'cogquiz-mail-service');
  
  app.setGlobalPrefix('api');
  
  await app.listen(port);
  console.log(`${serviceName} is running on port ${port}`);
}
bootstrap();
