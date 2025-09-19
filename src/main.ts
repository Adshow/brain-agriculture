import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtros globais
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuração Swagger
  const config = new DocumentBuilder()
    .setTitle('Minha API')
    .setDescription('Documentação da API')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Rota interativa com Swagger UI
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Docs - Minha API',
  });

  // Exportar automaticamente a especificação
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  try {
    const YAML = require('yaml');
    fs.writeFileSync('./openapi.yaml', YAML.stringify(document));
  } catch (e) {
    console.warn('⚠️ Não foi possível gerar openapi.yaml (instale a lib "yaml" para isso)');
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
