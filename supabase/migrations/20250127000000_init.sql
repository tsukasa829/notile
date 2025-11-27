-- NextQuest - Supabase初期スキーマ
-- Supabase SQL Editorで実行してください

-- Users テーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level DESC);

-- コメント
COMMENT ON TABLE users IS 'ユーザー情報テーブル';
COMMENT ON COLUMN users.id IS 'ユーザーID（UUID）';
COMMENT ON COLUMN users.display_name IS '表示名';
COMMENT ON COLUMN users.level IS 'レベル（ゲーミフィケーション）';
COMMENT ON COLUMN users.xp IS '経験値';
COMMENT ON COLUMN users.current_streak IS '連続日数';
COMMENT ON COLUMN users.last_activity_at IS '最終アクティビティ日時';
COMMENT ON COLUMN users.created_at IS '作成日時';
