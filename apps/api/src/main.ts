import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Dependency-free local .env loader (MUST run before importing AppModule!)
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}
loadEnv();

// Auto-push Prisma schema to database on startup (ensures tables always exist)
function ensureDatabase() {
  try {
    const schemaPath = path.join(process.cwd(), 'packages/database/prisma/schema.prisma');
    if (fs.existsSync(schemaPath)) {
      console.log('Running prisma db push to sync database schema...');
      execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
        stdio: 'inherit',
        env: process.env
      });
      console.log('Database schema synced successfully.');
    }
  } catch (e) {
    console.error('prisma db push failed (app will continue):', e);
  }
}
ensureDatabase();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
