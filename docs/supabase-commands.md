# Supabase コマンドセットアップガイド

## 前提条件

Supabaseアカウントとプロジェクトが作成済みであること。
https://app.supabase.com

---

## 1. Supabase接続情報取得

### ダッシュボードから取得
1. Supabaseダッシュボードにログイン
2. プロジェクト選択
3. **Settings** → **Database** → **Connection string**
4. **URI** タブを選択してコピー

**接続文字列の形式:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

`[YOUR-PASSWORD]` を実際のパスワードに置き換えてください。

---

## 2. 環境変数設定

`.env.local` を編集:

```bash
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Supabase PostgreSQL接続
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

---

## 3. スキーマをSupabaseにプッシュ

```bash
npm run db:push
```

**出力例:**
```
🔄 Supabaseに接続中...
📄 スキーマを適用中...
✅ スキーマの適用に成功しました！

確認:
作成されたテーブル:
  - users
```

---

## 4. 動作確認

### ローカルでSupabase接続テスト

```bash
# DATABASE_URLが設定されているとSupabaseに接続
npm run dev
```

ブラウザで http://localhost:3000/dashboard にアクセス:
- 自動的にユーザーが作成される
- Supabase Dashboard → **Table Editor** → `users`テーブルにデータが追加される

---

## 5. Vercelデプロイ

### 環境変数設定（Vercelダッシュボード）

```bash
# またはVercel CLIで設定
vercel env add JWT_SECRET
# → ランダムな64文字以上の文字列を入力

vercel env add DATABASE_URL
# → Supabase接続文字列を入力
```

### デプロイ

```bash
vercel --prod
```

---

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run db:push` | Supabaseにスキーマをプッシュ |
| `npm run dev` | 開発サーバー起動（DATABASE_URL設定時はSupabase使用） |
| `npm run build` | 本番ビルド |

---

## トラブルシューティング

### エラー: "DATABASE_URLが設定されていません"
→ `.env.local`に`DATABASE_URL`を追加してください

### エラー: "connection refused"
→ Supabaseプロジェクトが起動中か確認してください

### エラー: "relation 'users' already exists"
→ すでにテーブルが存在します。正常です。

### テーブルをリセットしたい場合
Supabase Dashboard → SQL Editor:
```sql
DROP TABLE IF EXISTS users CASCADE;
```
その後、`npm run db:push`を再実行

---

## 次のステップ

✅ Supabase接続確認完了後:
1. `npm run dev`でローカルテスト
2. `/dashboard`で自動ユーザー作成テスト
3. Supabase Dashboard でデータ確認
4. Vercelにデプロイ
