import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { steps, enrollments, progress, users, programs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// コーチからの褒めメッセージリスト
const COACH_MESSAGES = [
  "素晴らしい！次も頑張ろう！ 🎯",
  "やったね！着実に成長してるよ！ 💪",
  "このペースで続ければ、ゴールは目前だ！ 🏆",
  "すごい！その調子！ ⭐",
  "完璧！一歩一歩、確実に前進してるね！ 🚀",
  "おめでとう！努力が実を結んでいるよ！ 🌟",
  "最高！君なら必ずできる！ 💫",
  "グッジョブ！次のミッションも楽しみだね！ 🎉",
];

// ミッション完了
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; missionId: string }> }
) {
  try {
    const { id: courseId, missionId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 受講登録を確認
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, user.id),
          eq(enrollments.programId, courseId)
        )
      );

    if (!enrollment) {
      return NextResponse.json(
        { ok: false, error: 'Not enrolled in this course' },
        { status: 403 }
      );
    }

    // ミッション（Step）の存在確認
    const [mission] = await db
      .select()
      .from(steps)
      .where(eq(steps.id, missionId));

    if (!mission) {
      return NextResponse.json(
        { ok: false, error: 'Mission not found' },
        { status: 404 }
      );
    }

    // 既に完了しているかチェック
    const [existingProgress] = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.enrollmentId, enrollment.id),
          eq(progress.stepId, missionId)
        )
      );

    if (existingProgress?.isCompleted) {
      return NextResponse.json({
        ok: true,
        alreadyCompleted: true,
        message: 'Mission already completed',
      });
    }

    // 進捗を更新または作成
    if (existingProgress) {
      await db
        .update(progress)
        .set({ 
          isCompleted: true, 
          completedAt: new Date() 
        })
        .where(eq(progress.id, existingProgress.id));
    } else {
      await db.insert(progress).values({
        enrollmentId: enrollment.id,
        stepId: missionId,
        isCompleted: true,
        completedAt: new Date(),
      });
    }

    // XPを付与（10XP per mission）
    const xpGain = 10;
    await db
      .update(users)
      .set({ 
        xp: user.xp + xpGain,
        lastActivityAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // 全ミッション完了チェック
    const allMissions = await db
      .select()
      .from(steps)
      .where(eq(steps.programId, courseId));

    const completedCount = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.enrollmentId, enrollment.id),
          eq(progress.isCompleted, true)
        )
      );

    const isCoursCompleted = completedCount.length + 1 >= allMissions.length;

    // コース完了時の処理
    if (isCoursCompleted) {
      await db
        .update(enrollments)
        .set({ 
          status: 'completed',
          completedAt: new Date(),
        })
        .where(eq(enrollments.id, enrollment.id));
    }

    // ランダムなコーチメッセージを選択
    const coachMessage = COACH_MESSAGES[Math.floor(Math.random() * COACH_MESSAGES.length)];

    return NextResponse.json({
      ok: true,
      xpGain,
      newXp: user.xp + xpGain,
      coachMessage,
      isCourseCompleted: isCoursCompleted,
      progressPercent: Math.round(((completedCount.length + 1) / allMissions.length) * 100),
    });
  } catch (error) {
    console.error('Complete mission failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to complete mission' },
      { status: 500 }
    );
  }
}
