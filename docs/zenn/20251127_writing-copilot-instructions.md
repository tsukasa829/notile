# 【保存用】Next.jsプロジェクトでcopilot-instructionsを書く時に気をつけていること

## はじめに：GitHub Copilot Instructionsとは

GitHub Copilot Instructionsは、Copilotにプロジェクト固有のルールや文脈を伝えるための仕組みです。`.github/copilot-instructions.md`に記述することで、コード生成時に常にこれらの指示が参照されます。

特にNext.jsプロジェクトでは、App RouterとPages Router、Server ComponentsとClient Components、Server Actionsなど、選択肢が多いため、プロジェクトの方針を明確に伝えることが重要です。

## 1. 具体的すぎる指示は避ける

### ❌ 悪い例
```markdown
- ボタンコンポーネントを作る時は必ず以下のコードを使うこと
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
```

### ✅ 良い例
```markdown
- UIコンポーネントにはTailwind CSSを使用する
- ボタンは再利用可能なコンポーネント（components/Button.tsx）を使う
- variantプロパティでスタイルを切り替える設計にする
```

**理由**: 具体的すぎる指示は柔軟性を失い、メンテナンスが困難になります。Next.jsの機能を活かしつつ、パターンを示す程度に留めましょう。

## 2. Next.jsのバージョンと構成を明記する

### 技術スタックを明記
```markdown
## 技術スタック
- Next.js 15 (App Router) ← これが最重要
- React 19
- TypeScript
- Drizzle ORM + PostgreSQL (Supabase)
- Tailwind CSS 4
```

### App Router特有の設定
```markdown
## Next.js設定
- App Routerを使用（Pages Routerは使わない）
- Server Componentをデフォルトとする
- 'use client'は必要最小限に留める
- データフェッチはServer Componentで行う
- フォーム送信にはServer Actionsを使用
```

### ディレクトリ構成
```markdown
## ディレクトリ構成
- `app/`: Next.js App Routerのページ・レイアウト・APIルート
- `components/`: 再利用可能なReactコンポーネント
- `lib/`: ユーティリティ関数、DB接続、認証ロジック
```

**効果**: Copilotが「App Routerのコードを生成すべき」と理解し、Pages Router時代の古いパターンを提案しなくなります。

## 3. Next.js特有の禁止事項を書く

### セキュリティに関わる禁止事項
```markdown
## 禁止事項
- 環境変数を直接コードに埋め込まない
- NEXT_PUBLIC_プレフィックスのない環境変数をクライアントコンポーネントで使わない
- Server Actionsでユーザー入力を検証せずにDBクエリを実行しない
- APIルートでCORS設定を忘れない
```

### Next.jsでよくあるミス
```markdown
- Pages Router時代の`getServerSideProps`や`getStaticProps`を使わない
- Server Componentで`useState`や`useEffect`を使わない
- Client Componentで直接DBアクセスしない
- metadataをClient Componentでexportしない
```

### コーディングスタイルの禁止事項
```markdown
- `any`型の使用を避ける（やむを得ない場合のみ許可）
- console.logをコミットしない（デバッグ用は削除すること）
- 'use client'を安易に追加しない（必要性を検討する）
- `npm run dev`などの開発サーバーを自動起動しない（ユーザーが手動で起動する）
```

**理由**: Next.jsは進化が早く、古いパターンと新しいパターンが混在しがちです。明示的に禁止することで、最新のベストプラクティスに従ったコードを生成できます。

また、Copilotが勝手に開発サーバーを起動すると、既存のプロセスと競合したり、意図しないポート占有が発生する可能性があります。

## 4. Next.jsの開発フローを記載する

### 開発サーバーの起動方法
```markdown
## 開発環境
- ローカル開発: `npm run dev` (http://localhost:3000)
- データベース: ローカルはPGLite、本番はSupabase
- 環境変数: `.env.local` に記載（Git管理しない）
- テストユーザー: `?userId=xxx`でユーザーIDを指定可能（開発環境のみ）
```

### APIルートのテスト手順
```markdown
## テストフロー
1. `GET /api/db/migrate` でテーブル作成（PGLiteのみ）
2. `GET /api/seed` でテストデータ投入
3. レスポンスの `testUser.id` を使ってテスト
4. ブラウザで `?userId={testUser.id}` をURLに追加
```

### ビルドとデプロイ
```markdown
## デプロイ
- `npm run build` でビルド確認
- Vercelへの自動デプロイ（mainブランチへのpush時）
- 環境変数はVercel Dashboardで設定
```

**効果**: CopilotがNext.jsの開発フローを理解し、APIルートやテストコードを適切に生成できます。

## 5. Next.jsの命名規則とパターンを示す

### ファイル命名規則（App Router）
```markdown
## 命名規則
- ページ: `app/path/to/page.tsx` (必ず`page.tsx`という名前)
- レイアウト: `app/path/to/layout.tsx`
- ローディング: `app/path/to/loading.tsx`
- エラー: `app/path/to/error.tsx`
- APIルート: `app/api/path/to/route.ts` (必ず`route.ts`という名前)
- コンポーネント: `components/UserProfile.tsx` (PascalCase)
- ユーティリティ: `lib/formatDate.ts` (camelCase)
```

### コーディングパターン
```markdown
## パターン
- Server Componentをデフォルトとし、'use client'は必要な時のみ
- データフェッチはServer Componentで行う
- フォーム送信にはServer Actionsを使用
- 動的ルート: `app/posts/[id]/page.tsx` で `params.id` を受け取る
- 並列ルート: `@modal`など`@`プレフィックスを使う
```

### Server Component vs Client Component
```markdown
## 使い分け
- Server Component: データフェッチ、SEO対策、シークレット使用
- Client Component: useState、useEffect、イベントハンドラ、ブラウザAPI使用
```

## 6. 定期的に見直す

プロジェクトが進化するにつれて、instructionsも更新が必要です：

- 新しい技術を導入したら追記
- 不要になったルールは削除
- チーム内で議論して改善

## おわりに

Next.jsプロジェクトでのGitHub Copilot Instructionsは「教科書」ではなく「ガイドライン」です。

特に重要なのは：
- **App Routerを使っていることを明記する**（Pages Routerとの混同を防ぐ）
- **Server ComponentとClient Componentの使い分けを示す**
- **Next.js特有の禁止事項を書く**（古いパターンを避ける）

Next.jsは進化が早いため、instructionsも定期的に見直し、最新のベストプラクティスに合わせて更新しましょう。

あなたのNext.jsプロジェクトではどのようなinstructionsを書いていますか？ぜひコメントで教えてください！
