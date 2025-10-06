import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`API rodando em http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('Falha ao iniciar a API', error);
  process.exitCode = 1;
});
