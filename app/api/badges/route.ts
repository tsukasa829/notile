// ユーザーのバッジ一覧取得API
// GET /api/badges?userId=xxx

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { badges, userBadges, programs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userBadgeList = await db
      .select({
        id: userBadges.id,
        earnedAt: userBadges.earnedAt,
        badge: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          iconUrl: badges.iconUrl,
          rarity: badges.rarity,
        },
        program: {
          id: programs.id,
          title: programs.title,
        },
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .leftJoin(programs, eq(badges.programId, programs.id))
      .where(eq(userBadges.userId, user.id))
      .orderBy(userBadges.earnedAt);

    return NextResponse.json(userBadgeList);
  } catch (error) {
    console.error('Failed to fetch badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}
