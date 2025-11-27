/**
 * Supabaseへスキーマをプッシュするスクリプト
 * 
 * 使い方:
 * 1. .env.localにDATABASE_URLを設定
 * 2. npm run db:push
 */

import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URLが設定されていません');
  console.error('');
  console.error('.env.localに以下を設定してください:');
  console.error('DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@...supabase.com:6543/postgres');
  process.exit(1);
}

console.log('🔄 Supabaseに接続中...');
const sql = postgres(DATABASE_URL);

try {
  // init.sqlを読み込んで実行
  const sqlFile = join(__dirname, '..', 'supabase', 'init.sql');
  const sqlContent = readFileSync(sqlFile, 'utf-8');
  
  console.log('📄 スキーマを適用中...');
  await sql.unsafe(sqlContent);
  
  console.log('✅ スキーマの適用に成功しました！');
  console.log('');
  console.log('確認:');
  const result = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  
  console.log('作成されたテーブル:');
  result.forEach(row => console.log(`  - ${row.table_name}`));
  
} catch (error) {
  console.error('❌ エラーが発生しました:');
  console.error(error.message);
  process.exit(1);
} finally {
  await sql.end();
}
