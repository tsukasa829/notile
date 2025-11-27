# NextQuest - 目標達成支援プラットフォーム

AIとコミュニティの力で、人生をゲームのように攻略する学習プラットフォーム。

## 🚀 Getting Started

### 1. Supabaseプロジェクト作成

1. [Supabase](https://app.supabase.com)でアカウント作成
2. 新規プロジェクト作成
3. Project Settings > API から以下を取得:
   - `Project URL`
   - `anon public` key

### 2. 環境変数設定

`.env.local`ファイルを作成（`.env.local.example`を参考）:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. データベース初期化

Supabaseダッシュボード > SQL Editor で以下を実行:

```bash
# supabase/migrations/001_initial_schema.sql の内容をコピー&ペースト
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で確認

## 📁 プロジェクト構造

```
notile/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # ルートレイアウト（ナビゲーション）
│   └── page.tsx         # トップページ
├── lib/
│   └── supabase.ts      # Supabaseクライアント
├── supabase/
│   └── migrations/      # SQLマイグレーション
├── docs/
│   └── plan.md          # プロジェクト企画書
└── .env.local.example   # 環境変数テンプレート
```

## 🎨 デザインシステム

### カラーパレット（Tailwind）
- `primary-*`: 青グラデーション（#1E3A8A → #3B82F6 → #60A5FA）
- `bg-blue-gradient`: 135度グラデーション

### 主要コンポーネント
- グラスモーフィズム: `bg-primary-800/30 backdrop-blur-sm border border-primary-700/50`
- ボタン: `bg-blue-gradient hover:opacity-90`

## 📊 データモデル

- **users**: ユーザー情報、レベル、XP、連続日数
- **programs**: 学習プログラム（公開/非公開）
- **steps**: プログラムのタスク
- **enrollments**: ユーザーのプログラム受講状況
- **progress**: タスク完了状態
- **badges**: バッジマスタ
- **user_badges**: 獲得バッジ
- **certificates**: 認定証（有料）

## 🔐 認証

Supabase Authを使用:
- メールログイン
- OAuth（Google/GitHub等）

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## 📝 Next Steps

- [ ] Supabase Authログイン実装
- [ ] プログラム作成フォーム（LLM生成）
- [ ] ダッシュボード（進捗可視化）
- [ ] コミュニティチャット
- [ ] バッジシステム
- [ ] 認定証発行（Stripe決済）

## 📖 詳細ドキュメント

プロジェクト企画の全体像は `docs/plan.md` を参照してください。
