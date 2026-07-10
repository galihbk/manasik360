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
  const schemaPath = path.join(process.cwd(), 'packages/database/prisma/schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.warn('[DB] schema.prisma not found at:', schemaPath);
    return;
  }

  // Try multiple prisma binary locations (monorepo pnpm structure)
  const prismaBinCandidates = [
    path.join(process.cwd(), 'node_modules/.bin/prisma'),
    path.join(process.cwd(), 'node_modules/.pnpm/prisma@5.22.0/node_modules/.bin/prisma'),
    'prisma'
  ];

  let prismaBin = 'prisma';
  for (const candidate of prismaBinCandidates) {
    if (fs.existsSync(candidate)) {
      prismaBin = candidate;
      break;
    }
  }

  console.log('[DB] Running prisma db push with binary:', prismaBin);
  console.log('[DB] Schema path:', schemaPath);
  console.log('[DB] DATABASE_URL set:', !!process.env.DATABASE_URL);

  try {
    execSync(`"${prismaBin}" db push --schema="${schemaPath}" --accept-data-loss`, {
      stdio: 'inherit',
      env: process.env
    });
    console.log('[DB] Database schema synced successfully.');
  } catch (e: any) {
    console.error('[DB] prisma db push failed:', e.message);
    // Try via pnpm filter as fallback
    try {
      execSync(`pnpm --filter @bahrain/database db:push`, {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: process.env
      });
      console.log('[DB] Database schema synced via pnpm filter.');
    } catch (e2: any) {
      console.error('[DB] pnpm db:push also failed:', e2.message);
    }
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
