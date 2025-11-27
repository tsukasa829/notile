# 初回デプロイ検証計画

## 目的
PGLite（開発） → Supabase PostgreSQL（本番）構成が正常に動作するか確認

---

## 検証機能（MVP: Minimum Viable Product）

### ✅ 実装する最小機能

1. **ユーザー登録・ログイン**
   - メールアドレス + パスワードでサインアップ
   - ログイン/ログアウト
   - セッション維持（JWT Cookie）
   - パスワードハッシュ化（bcrypt）

2. **DB接続確認**
   - ローカル: PGLiteでユーザーCRUD
   - 本番: Supabase PostgreSQLでユーザーCRUD
   - Drizzle ORMで両環境統一

3. **保護されたページ**
   - ダッシュボード（認証必須）
   - ユーザー情報表示
   - ログアウトボタン

---

## 実装スコープ（最小限）

### DB（Drizzle ORM）
- `users` テーブルのみ
  - id (uuid)
  - email (unique)
  - password_hash
  - display_name
  - created_at

### API Routes
- `POST /api/auth/signup` - 新規登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - セッション確認

### ページ
- `/` - ランディング（既存）
- `/signup` - 登録フォーム
- `/login` - ログインフォーム
- `/dashboard` - ダッシュボード（認証必須）

---

## 検証項目チェックリスト

### ローカル環境
- [ ] PGLiteでDB初期化
- [ ] ユーザー登録が成功
- [ ] ログインが成功
- [ ] ダッシュボードにアクセス可能
- [ ] ログアウトが成功

### デプロイ後（Vercel + Supabase）
- [ ] 環境変数が正しく設定される
- [ ] Supabase PostgreSQLに接続成功
- [ ] ユーザー登録が成功（本番DB）
- [ ] ログインが成功（本番DB）
- [ ] セッションがVercel Edge環境で維持される
- [ ] ダッシュボードにアクセス可能
- [ ] ログアウトが成功

---

## 技術スタック（検証用）

```
├── DB操作: Drizzle ORM
├── ローカルDB: PGLite
├── 本番DB: Supabase (PostgreSQL接続)
├── 認証: 独自実装（bcrypt + JWT）
├── セッション: jose (JWT) + httpOnly Cookie
└── デプロイ: Vercel
```

---

## 実装順序

1. Drizzle ORM + PGLiteセットアップ
2. `users`テーブル定義 + マイグレーション
3. 認証APIルート実装
4. サインアップ/ログインページ
5. ダッシュボードページ（認証ガード）
6. ローカルテスト
7. Supabase PostgreSQL接続設定
8. Vercelデプロイ
9. 本番テスト

---

## 所要時間見積もり

- 実装: 2-3時間
- テスト: 30分
- デプロイ: 30分
- **合計: 3-4時間**

---

## 成功条件

✅ ローカルと本番の両方で以下が動作すること:
1. ユーザー登録
2. ログイン
3. 認証が必要なページへのアクセス
4. ログアウト
5. 未認証時のリダイレクト

この検証が成功すれば、次のフェーズ（プログラム管理、ゲーミフィケーション等）に進める。
