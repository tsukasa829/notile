import { NextResponse } from 'next/server';
import { db, initializeDB } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    // DB初期化（初回のみ）
    await initializeDB();

    // 新規ユーザー作成
    const newUser = await db.insert(users).values({
      id: uuidv4(),
      displayName: `User_${Date.now()}`,
      level: 1,
      xp: 0,
      currentStreak: 0,
    }).returning();

    const user = newUser[0];

    // セッション作成
    await createSession({
      userId: user.id,
      displayName: user.displayName || undefined,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (error) {
    console.error('Auto user creation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
