import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { PGlite } from '@electric-sql/pglite';
import postgres from 'postgres';
import * as schema from './schema';

const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = process.env.DATABASE_URL;

// デバッグ用ログ
console.log('🔍 DB Config:', { 
  NODE_ENV: process.env.NODE_ENV, 
  isDevelopment, 
  hasDatabaseUrl: !!databaseUrl 
});

// 環境に応じてDB接続を切り替え
let db: ReturnType<typeof drizzlePglite> | ReturnType<typeof drizzlePostgres>;
let pgliteClient: PGlite | null = null;
// postgres-js raw client (Supabase接続時のみ設定)
export let rawClient: ReturnType<typeof postgres> | null = null;

if (isDevelopment && !databaseUrl) {
  // ローカル開発: PGLite
  console.log('🔵 Using PGLite (local development)');
  pgliteClient = new PGlite('./local.db');
  db = drizzlePglite(pgliteClient, { schema });
} else if (databaseUrl) {
  // 本番またはDATABASE_URL指定時: Supabase PostgreSQL
  console.log('🟢 Using Supabase PostgreSQL (production)');

  // 接続文字列を分解してトレースログ
  try {
    const urlObj = new URL(databaseUrl.replace('postgresql://', 'postgres://'));
    console.log('🔎 Parsed DATABASE_URL:', {
      protocol: urlObj.protocol,
      username: urlObj.username,
      host: urlObj.hostname,
      port: urlObj.port,
      database: urlObj.pathname.replace('/', ''),
      search: urlObj.search,
    });
  } catch (e) {
    console.warn('⚠️ Failed to parse DATABASE_URL', e);
  }

  // Pooler 環境では SSL 必須 & prepared statements 無効化
  const client = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  rawClient = client;
  db = drizzlePostgres(client, { schema });

  // Note: Introspection removed from module init to avoid build-time connection attempts
  // Use /api/db/info endpoint for runtime connection verification
} else {
  console.error('❌ DATABASE_URL is not set in production!');
  throw new Error('Database configuration error: Set DATABASE_URL for production');
}

export { db };

// Initialize DB (PGLiteの場合のみ必要)
export async function initializeDB() {
  if (!pgliteClient) {
    console.log('ℹ️ Using remote PostgreSQL, skipping local initialization');
    return;
  }

  try {
    await pgliteClient.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        display_name TEXT,
        level INTEGER NOT NULL DEFAULT 1,
        xp INTEGER NOT NULL DEFAULT 0,
        current_streak INTEGER NOT NULL DEFAULT 0,
        last_activity_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ PGLite database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}
