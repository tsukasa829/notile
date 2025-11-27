import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programs, steps, enrollments, progress } from '@/lib/db/schema';
import { eq, sql, and, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// コース詳細取得（ミッション一覧付き）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    // コース情報を取得
    const [course] = await db
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
      .where(eq(programs.id, id));

    if (!course) {
      return NextResponse.json(
        { ok: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // ミッション（Steps）一覧を取得
    const missions = await db
      .select()
      .from(steps)
      .where(eq(steps.programId, id))
      .orderBy(asc(steps.orderIndex));

    // ユーザーがログインしている場合、受講状況と進捗を取得
    let enrollment = null;
    let completedStepIds: string[] = [];

    if (user) {
      const [userEnrollment] = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, user.id),
            eq(enrollments.programId, id)
          )
        );

      enrollment = userEnrollment;

      if (userEnrollment) {
        const progressData = await db
          .select({ stepId: progress.stepId })
          .from(progress)
          .where(
            and(
              eq(progress.enrollmentId, userEnrollment.id),
              eq(progress.isCompleted, true)
            )
          );
        completedStepIds = progressData.map(p => p.stepId);
      }
    }

    // ミッションに完了状態を付加
    const missionsWithProgress = missions.map(mission => ({
      ...mission,
      isCompleted: completedStepIds.includes(mission.id),
    }));

    return NextResponse.json({
      ok: true,
      course,
      missions: missionsWithProgress,
      enrollment,
      progressPercent: missions.length > 0 
        ? Math.round((completedStepIds.length / missions.length) * 100) 
        : 0,
    });
  } catch (error) {
    console.error('Get course detail failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch course detail' },
      { status: 500 }
    );
  }
}
