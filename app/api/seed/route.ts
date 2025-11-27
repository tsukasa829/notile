// テストデータ投入用APIエンドポイント
// GET /api/seed でテストデータを作成

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programs, steps, badges, users } from '@/lib/db/schema';

export async function GET() {
  try {
    // テスト用ユーザー作成
    const [testUser] = await db
      .insert(users)
      .values({
        displayName: 'テストユーザー',
        level: 1,
        xp: 0,
        currentStreak: 0,
      })
      .returning();

    // テスト用コース1: Python入門
    const [pythonCourse] = await db
      .insert(programs)
      .values({
        title: 'Python入門コース',
        description: 'プログラミング初心者のためのPython基礎講座。変数、条件分岐、ループなどの基本を学びます。',
        isPublic: true,
        isFree: true,
        category: 'プログラミング',
        aiGenerated: false,
      })
      .returning();

    // Python入門のバッジ
    await db.insert(badges).values({
      name: 'Python初心者マスター',
      description: 'Python入門コースを修了しました！',
      iconUrl: '🐍',
      rarity: 'common',
      programId: pythonCourse.id,
    });

    // Python入門のミッション
    await db.insert(steps).values([
      {
        programId: pythonCourse.id,
        orderIndex: 0,
        title: 'Pythonをインストールしよう',
        content: '公式サイトからPythonをダウンロードしてインストールします。\n\n1. https://python.org にアクセス\n2. Downloads からOSに合ったバージョンをダウンロード\n3. インストーラーを実行\n4. ターミナルで `python --version` を確認',
        estimatedMinutes: 15,
      },
      {
        programId: pythonCourse.id,
        orderIndex: 1,
        title: '最初のプログラム: Hello World',
        content: 'print関数を使って画面に文字を表示してみましょう。\n\n```python\nprint("Hello, World!")\n```\n\nファイルを作成して実行してみてください。',
        estimatedMinutes: 10,
      },
      {
        programId: pythonCourse.id,
        orderIndex: 2,
        title: '変数と型を理解しよう',
        content: 'Pythonの基本的なデータ型を学びます。\n\n- int（整数）\n- float（小数）\n- str（文字列）\n- bool（真偽値）\n\n```python\nname = "太郎"\nage = 25\nheight = 175.5\nis_student = True\n```',
        estimatedMinutes: 20,
      },
      {
        programId: pythonCourse.id,
        orderIndex: 3,
        title: '条件分岐をマスターしよう',
        content: 'if文を使って条件によって処理を分岐させます。\n\n```python\nage = 20\nif age >= 18:\n    print("成人です")\nelse:\n    print("未成年です")\n```',
        estimatedMinutes: 25,
      },
      {
        programId: pythonCourse.id,
        orderIndex: 4,
        title: 'ループ処理を覚えよう',
        content: 'for文とwhile文で繰り返し処理を行います。\n\n```python\n# for文\nfor i in range(5):\n    print(i)\n\n# while文\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```',
        estimatedMinutes: 30,
      },
    ]);

    // テスト用コース2: Web開発入門
    const [webCourse] = await db
      .insert(programs)
      .values({
        title: 'はじめてのWeb開発',
        description: 'HTML, CSS, JavaScriptの基礎を学んで、自分だけのWebページを作ろう！',
        isPublic: true,
        isFree: true,
        category: 'Web開発',
        aiGenerated: false,
      })
      .returning();

    // Web開発のバッジ
    await db.insert(badges).values({
      name: 'Web開発デビュー',
      description: 'はじめてのWeb開発コースを修了しました！',
      iconUrl: '🌐',
      rarity: 'rare',
      programId: webCourse.id,
    });

    // Web開発のミッション
    await db.insert(steps).values([
      {
        programId: webCourse.id,
        orderIndex: 0,
        title: 'HTMLの基本構造を理解する',
        content: 'HTMLの基本タグを学びます。\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>マイページ</title>\n</head>\n<body>\n  <h1>Hello!</h1>\n</body>\n</html>\n```',
        estimatedMinutes: 20,
      },
      {
        programId: webCourse.id,
        orderIndex: 1,
        title: 'CSSでスタイルを付ける',
        content: 'CSSを使ってHTMLに色やレイアウトを追加します。\n\n```css\nbody {\n  background-color: #f0f0f0;\n}\nh1 {\n  color: blue;\n}\n```',
        estimatedMinutes: 25,
      },
      {
        programId: webCourse.id,
        orderIndex: 2,
        title: 'JavaScriptで動きをつける',
        content: 'ボタンをクリックしたときにアラートを表示してみましょう。\n\n```javascript\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("クリックされました！");\n});\n```',
        estimatedMinutes: 30,
      },
    ]);

    // テスト用コース3: 有料コース（サンプル）
    const [premiumCourse] = await db
      .insert(programs)
      .values({
        title: 'AIアプリ開発マスター',
        description: 'ChatGPT APIを使った実践的なAIアプリケーション開発を学びます。',
        isPublic: true,
        isFree: false,
        category: 'AI/機械学習',
        aiGenerated: false,
      })
      .returning();

    // AIコースのバッジ（レジェンダリー）
    await db.insert(badges).values({
      name: 'AIマスター',
      description: 'AIアプリ開発マスターコースを修了しました！',
      iconUrl: '🤖',
      rarity: 'legendary',
      programId: premiumCourse.id,
    });

    await db.insert(steps).values([
      {
        programId: premiumCourse.id,
        orderIndex: 0,
        title: 'OpenAI APIの基礎',
        content: 'APIキーの取得方法と基本的な使い方を学びます。',
        estimatedMinutes: 30,
      },
      {
        programId: premiumCourse.id,
        orderIndex: 1,
        title: 'チャットボットを作ろう',
        content: 'シンプルなチャットボットアプリを構築します。',
        estimatedMinutes: 60,
      },
    ]);

    return NextResponse.json({
      ok: true,
      message: 'テストデータを作成しました',
      testUser: {
        id: testUser.id,
        displayName: testUser.displayName,
        hint: '?userId=' + testUser.id + ' をURLに追加してテスト',
      },
      courses: [
        { id: pythonCourse.id, title: pythonCourse.title, missions: 5 },
        { id: webCourse.id, title: webCourse.title, missions: 3 },
        { id: premiumCourse.id, title: premiumCourse.title, missions: 2 },
      ],
    });
  } catch (error) {
    console.error('Seed failed:', error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
