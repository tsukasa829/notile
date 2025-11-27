import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programs, enrollments } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';

// コース一覧取得（受講者数付き）
export async function GET() {
  try {
    // 公開コースを取得し、受講者数をカウント
    const coursesWithCount = await db
      .select({
        id: programs.id,
        title: programs.title,
        description: programs.description,
        isPublic: programs.isPublic,
        isFree: programs.isFree,
        category: programs.category,
        createdAt: programs.createdAt,
        enrollmentCount: sql<number>`(
          SELECT COUNT(*) FROM ${enrollments} 
          WHERE ${enrollments.programId} = ${programs.id}
        )`.as('enrollment_count'),
      })
      .from(programs)
      .where(eq(programs.isPublic, true))
      .orderBy(programs.createdAt);

    return NextResponse.json({ 
      ok: true, 
      courses: coursesWithCount 
    });
  } catch (error) {
    console.error('Get courses failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
