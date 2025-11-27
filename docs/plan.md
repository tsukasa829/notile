# NextQuest - 目標達成支援プラットフォーム

## プロジェクト概要

色々な目標達成を支援するWebプラットフォーム。
「次の冒険（Next Quest）へ」を合言葉に、AIとコミュニティの力で人生をゲームのように攻略する。

---

## コア機能

### 1. タスク管理システム
- 目標に対する進捗を可視化
- タスクの優先度管理と期限設定
- 完了したタスクの履歴管理

### 2. コミュニティ機能
- **同じプログラムをやっているメンバー同士の交流**
  - プログラムごとのチャットルーム
  - メンバーの進捗共有
  - 励まし合いの場として機能

### 3. レビュー・フィードバック機能
- プログラムごとのレビュー制度
- メンバー同士の相互フィードバック
- メンター・講師からのコメント（オプション）

### 4. LLM活用プログラム自動生成
- **ユーザーが自分でプログラムを作成可能**
  - 例: 「Pythonを勉強したい」と入力
  - LLMがPython学習用のTODOリストを自動生成
  - 学習に最適な動画や教材をLLMが検索・提案
  - プログラム（学習カリキュラム）が即座に完成
- **プログラムの公開機能**
  - 気に入ったプログラムを他のユーザーに公開
  - コミュニティで共有し、多くの人が利用可能に

---

## モチベーション向上施策（ゲーミフィケーション & ソーシャル）

### 1. 達成の可視化と報酬（Achievement）
- **バッジ・トロフィーシステム**
  - 「初めの一歩」「7日間連続」「Pythonマスター」など、行動に応じたバッジ付与。
  - レアリティ設定（コモン、レア、エピック、レジェンダリー）で収集欲を刺激。
- **経験値（XP）とレベル**
  - タスク完了ごとにXP獲得。レベルアップ演出で成長を実感させる。
- **ヒートマップ（活動ログ）**
  - GitHubのContributionのような「努力の足跡」をプロフィールに表示。
  - 「空白を埋めたい」という心理を利用して継続を促す。

### 2. ソーシャル・プレッシャーとサポート（Social）
- **アカウンタビリティ・パートナー**
  - 同じ目標を持つユーザーとペアを組み、相互に進捗をチェック。
  - 「相手に迷惑をかけられない」という心理的拘束力を利用。
- **グループチャレンジ**
  - 「30日でWebアプリ開発」などの期間限定イベント。
  - 参加者全員の進捗率をグラフで比較・共有。
- **「応援」リアクション**
  - 停滞しているユーザーに対し、ワンタップで「応援（Nudge）」を送る機能。

### 3. 損失回避とコミットメント（Commitment）
- **ストリーク（連続記録）機能**
  - 「連続学習日数」を大きく表示。
  - 1日休むとリセットされる緊張感を持たせる（「フリーズ」アイテムで救済措置あり）。
- **コミットメント契約（オプション）**
  - 目標未達成の場合にペナルティ（寄付など）が発生する誓約機能。

---

## デザインコンセプト

**青のグラデーションを基調としたシンプルでクールなデザイン**

- **カラーパレット**: 
  - プライマリ: ブルー系グラデーション（#1E3A8A → #3B82F6 → #60A5FA）
  - アクセント: ホワイト、ライトグレー
  
- **デザインの方向性**:
  - ミニマリスト
  - モダンで洗練された印象
  - 集中力を高める落ち着いたトーン
  - 直感的で使いやすいUI/UX

---

## 収益モデル

### 認定証・資格発行システム
- **プログラム完了者に対するデジタル認定証の発行**
  - 料金: ¥3,000/証明書
  - LinkedInやポートフォリオに掲載可能なクレデンシャル
  - ブロックチェーン技術による改ざん防止（オプション）
  
- **認定証の価値**:
  - 学習の達成感と自信の獲得
  - 転職・就職活動でのアピール材料
  - SNSでのシェアによる社会的承認
  - プラットフォームの権威性向上
  - **就活サイト（Wantedly, LinkedIn, Green等）への掲載でスキル証明として活用**

- **発行プロセス**:
  1. プログラムの全タスク完了
  2. 最終レビュー・テストの合格（プログラムによる）
  3. 認定証のデザイン選択
  4. 決済後、即座にPDF + デジタルバッジ発行

---

## ターゲットユーザー

- 何かを学びたい・達成したい意欲のある人
- 一人では続かない、仲間が欲しい人
- カスタマイズ可能な学習プログラムを求める人
- 最新のAI技術を活用した効率的な学習を望む人

---

## 技術スタック

### 環境別構成

| レイヤー | ローカル環境（開発中） | 本番環境（デプロイ後） |
|---------|---------------------|---------------------|
| **アプリ** | Next.js 16 | Next.js 16 (Vercel) |
| **DB操作** | Drizzle ORM | Drizzle ORM |
| **DB本体** | PGLite (ローカルファイル) | Supabase (PostgreSQL) |

### 採用理由

#### PGLite（開発環境）
- **メリット**:
  - セットアップ不要（npm installのみ）
  - ローカルファイルベースで軽量
  - PostgreSQL互換でSupabaseへの移行がスムーズ
  - オフライン開発可能
- **用途**: 開発中のスキーマ設計・機能テスト

#### Supabase（本番環境）
- **利用方針**: **標準PostgreSQLとして利用（独自機能は最小化）**
  - ✅ フルマネージドPostgreSQL（ホスティングのみ）
  - ✅ 標準SQL機能（トリガー、関数、インデックス等）
  - ❌ Supabase Auth → 使わない（Next.js側で実装）
  - ❌ Realtime機能 → 使わない（必要なら後で検討）
  - ❌ Row Level Security（RLS） → 使わない（アプリ層で制御）
  - ❌ Storage → 使わない（Vercel Blob / S3等を別途検討）
- **メリット**:
  - ベンダーロックイン回避（他のPostgreSQL環境への移行が容易）
  - アプリケーションロジックの一元管理
  - デバッグ・テストが容易
- **用途**: 本番データ永続化のみ（Pure PostgreSQL接続）

#### Drizzle ORM
- **メリット**:
  - TypeScript完全対応（型安全）
  - 軽量（Prismaより高速）
  - PostgreSQL特化の最適化
  - マイグレーション管理
  - PGLite/Supabase両対応
- **用途**: DB操作の抽象化・スキーマ管理

### その他技術

- **フロントエンド**: Next.js 16 (App Router) / React 19
- **スタイリング**: Tailwind CSS 4
- **型システム**: TypeScript 5
- **認証**: Next.js実装（NextAuth.js / 独自実装）
- **セッション管理**: JWT / Cookie（httpOnly）
- **ファイルストレージ**: Vercel Blob / AWS S3（検討中）
- **決済**: Stripe
- **デプロイ**: Vercel (Next.js) + Supabase (PostgreSQL接続のみ)
- **LLM統合**: OpenAI API / Anthropic Claude API

---

## データモデル設計（Supabase / PostgreSQL）

### 1. Users (ユーザー)
- `id`: UUID (PK)
- `email`: String
- `display_name`: String
- `avatar_url`: String
- `level`: Integer (Default: 1)
- `xp`: Integer (Default: 0)
- `current_streak`: Integer
- `last_activity_at`: Timestamp

### 2. Programs (学習プログラム)
- `id`: UUID (PK)
- `creator_id`: UUID (FK -> Users.id)
- `title`: String
- `description`: Text
- `is_public`: Boolean (Default: false)
- `category`: String
- `ai_generated`: Boolean
- `created_at`: Timestamp

### 3. Steps (プログラムの各ステップ/タスク)
- `id`: UUID (PK)
- `program_id`: UUID (FK -> Programs.id)
- `order_index`: Integer
- `title`: String
- `content`: Text (Markdown)
- `resource_url`: String (動画や記事のリンク)
- `estimated_minutes`: Integer

### 4. Enrollments (受講登録)
- `id`: UUID (PK)
- `user_id`: UUID (FK -> Users.id)
- `program_id`: UUID (FK -> Programs.id)
- `status`: Enum ('active', 'completed', 'dropped')
- `started_at`: Timestamp
- `completed_at`: Timestamp

### 5. Progress (進捗状況)
- `id`: UUID (PK)
- `enrollment_id`: UUID (FK -> Enrollments.id)
- `step_id`: UUID (FK -> Steps.id)
- `is_completed`: Boolean
- `completed_at`: Timestamp

### 6. Badges (バッジマスタ)
- `id`: UUID (PK)
- `name`: String
- `description`: Text
- `image_url`: String
- `condition_type`: String

### 7. UserBadges (獲得バッジ)
- `user_id`: UUID (FK -> Users.id)
- `badge_id`: UUID (FK -> Badges.id)
- `awarded_at`: Timestamp

### 8. Certificates (認定証)
- `id`: UUID (PK)
- `user_id`: UUID (FK -> Users.id)
- `program_id`: UUID (FK -> Programs.id)
- `issued_at`: Timestamp
- `verification_code`: String (一意の識別子)
