// ローカルPGLite用: テーブル作成API
// GET /api/db/migrate でテーブルを作成

import { NextResponse } from 'next/server';
import { db, pgliteClient } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // PGLiteの場合のみテーブル作成
    if (!pgliteClient) {
      return NextResponse.json({
        ok: false,
        error: 'This endpoint is only for PGLite (local development)',
      });
    }

    // テーブル作成SQL
    await pgliteClient.exec(`
      -- Enum型
      DO $$ BEGIN
        CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Users テーブル
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        display_name TEXT,
        level INTEGER NOT NULL DEFAULT 1,
        xp INTEGER NOT NULL DEFAULT 0,
        current_streak INTEGER NOT NULL DEFAULT 0,
        last_activity_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Programs テーブル
      CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        is_public BOOLEAN NOT NULL DEFAULT false,
        is_free BOOLEAN NOT NULL DEFAULT true,
        category TEXT,
        ai_generated BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Steps テーブル
      CREATE TABLE IF NOT EXISTS steps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        program_id UUID NOT NULL REFERENCES programs(id),
        order_index INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        resource_url TEXT,
        estimated_minutes INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Enrollments テーブル
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        program_id UUID NOT NULL REFERENCES programs(id),
        status enrollment_status NOT NULL DEFAULT 'active',
        started_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP
      );

      -- Progress テーブル
      CREATE TABLE IF NOT EXISTS progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        enrollment_id UUID NOT NULL REFERENCES enrollments(id),
        step_id UUID NOT NULL REFERENCES steps(id),
        is_completed BOOLEAN NOT NULL DEFAULT false,
        completed_at TIMESTAMP
      );

      -- Badge Rarity Enum
      DO $$ BEGIN
        CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Certificates テーブル（修了証書）
      CREATE TABLE IF NOT EXISTS certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        program_id UUID NOT NULL REFERENCES programs(id),
        enrollment_id UUID NOT NULL REFERENCES enrollments(id),
        certificate_number TEXT NOT NULL UNIQUE,
        issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completion_date TIMESTAMP NOT NULL
      );

      -- Badges テーブル（バッジ定義）
      CREATE TABLE IF NOT EXISTS badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        icon_url TEXT,
        rarity badge_rarity NOT NULL DEFAULT 'common',
        program_id UUID REFERENCES programs(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- User Badges テーブル（ユーザー獲得バッジ）
      CREATE TABLE IF NOT EXISTS user_badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        badge_id UUID NOT NULL REFERENCES badges(id),
        earned_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    return NextResponse.json({
      ok: true,
      message: 'PGLite tables created successfully',
      tables: ['users', 'programs', 'steps', 'enrollments', 'progress', 'certificates', 'badges', 'user_badges'],
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
