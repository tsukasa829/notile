# Copilot Instructions for notile

## 開発サーバーについて
- 開発サーバー (`npm run dev`) は**別のターミナルセッションで起動済み**です
- Copilotは開発サーバーを起動する必要はありません
- http://localhost:3000 でアクセス可能です

## データベース構成
- **ローカル開発**: PGLite (`./local.db`) を使用
- **本番 (Vercel)**: Supabase PostgreSQL (Transaction mode) を使用

## 環境変数
- `.env.local`: ローカル開発用（DATABASE_URLなし → PGLite使用）
- `.env.production`: 本番用（参考用、実際の値はVercel環境変数で管理）

## 接続文字列（本番）
```
postgresql://postgres.amjecphftfxyshtsujmt:***@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
```
- ホスト: `aws-1-ap-northeast-1.pooler.supabase.com`（aws-0ではない）
- ポート: 6543（Transaction mode）
- ユーザー名: `postgres.PROJECT_REF` 形式
