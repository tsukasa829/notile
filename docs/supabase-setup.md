# Supabase PostgreSQL セットアップガイド

## 1. Supabaseプロジェクト作成

1. [Supabase](https://app.supabase.com) にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力:
   - Name: `nextquest` (任意)
   - Database Password: 強力なパスワードを生成（保管必須）
   - Region: `Northeast Asia (Tokyo)` 推奨
4. 「Create new project」をクリック（2-3分かかります）

---

## 2. データベース初期化

### 接続文字列取得
1. Supabaseダッシュボード → Project Settings → Database
2. 「Connection string」セクション → 「URI」をコピー
3. パスワード部分を実際のパスワードに置換

**形式:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### SQLスキーマ実行
1. Supabaseダッシュボード → SQL Editor
2. 「New query」をクリック
3. `supabase/init.sql` の内容をコピー&ペースト
4. 「Run」をクリック

---

## 3. 環境変数設定

### ローカル開発（`.env.local`）
```bash
# JWT Secret（本番では必ず変更）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database URL（Supabaseから取得した接続文字列）
# ローカルではコメントアウトしてPGLiteを使用
# DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### Vercel本番環境
1. Vercelダッシュボード → Settings → Environment Variables
2. 以下を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `JWT_SECRET` | ランダムな64文字以上の文字列 | Production |
| `DATABASE_URL` | Supabaseの接続文字列 | Production |

**JWT_SECRET生成例:**
```bash
# Node.jsで生成
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. 動作確認

### ローカルでSupabase接続テスト
```bash
# .env.localでDATABASE_URLを有効化
DATABASE_URL=postgresql://... npm run dev
```

### 本番デプロイ
```bash
# Vercelにデプロイ
vercel --prod
```

### 確認項目
- [ ] `/dashboard`でユーザーが自動作成される
- [ ] Supabase Dashboard → Table Editor → `users`テーブルにデータが追加される
- [ ] ログアウト→再アクセスで新しいユーザーが作成される

---

## 5. トラブルシューティング

### エラー: "Cannot connect to database"
- DATABASE_URLが正しいか確認
- パスワードに特殊文字がある場合はURLエンコード
- Supabaseプロジェクトが起動中か確認

### エラー: "relation 'users' does not exist"
- `supabase/init.sql`を実行したか確認
- SQL Editorで `SELECT * FROM users;` を実行してテーブル存在確認

### PGLiteとSupabaseの切り替え
- `DATABASE_URL`が設定されている → Supabase使用
- `DATABASE_URL`未設定 + 開発環境 → PGLite使用
- 本番環境で`DATABASE_URL`未設定 → エラー

---

## セキュリティチェックリスト

- [ ] `JWT_SECRET`を本番環境で変更済み
- [ ] Supabaseパスワードを安全に保管
- [ ] `.env.local`を`.gitignore`に追加済み
- [ ] Vercel環境変数が正しく設定されている
- [ ] DATABASE_URLに直接パスワードを含まない（環境変数経由）

---

## 次のステップ

✅ ローカル＆本番でDB接続確認完了後:
1. プログラム管理機能実装
2. ゲーミフィケーション（XP/レベル）ロジック
3. コミュニティ機能（チャット）
4. LLM統合（プログラム自動生成）
